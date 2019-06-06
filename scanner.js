process.chdir(__dirname)

require('./bootstrap')
const db = require('./models/index')
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg')
const { Op } = require('sequelize')

class Scanner {
  constructor () {
    this.running = false
  }

  isRunning () {
    return this.running
  }

  async run (paths) {
    this.running = true

    this.pathCache = {}
    this.mediaCache = new Set()
    this.folderIds = new Set()

    for (let dir of paths) {
      if (!dir) {
        continue
      }

      let files = this.walk(dir)

      for (let file of files) {
        console.log(`SCANNING file ${file}`)

        let stat = fs.statSync(file)
        let media = await db.Media.findOne({
          where: {
            path: file
          }
        })

        if (media && media.size === stat.size && media.lastModified.toString() === (new Date(stat.mtime).toString())) {
          // If size and modtime are the same, it hasn't changed since the last scan
        } else {
          // Remove thumbnail if it exists and the photo was updated
          if (media && fs.existsSync(media.getThumbnailPath())) {
            fs.unlinkSync(media.getThumbnailPath())
          }

          let mimetype = await db.Media.getMIMEType(file)
          let mediaInfo = {}

          try {
            if (mimetype.match(/image\/(?:png|jpg|jpeg|gif)/)) {
              mediaInfo = await this.getImageInformation(file)
            } else if (mimetype.match(/video\//)) {
              mediaInfo = await this.getVideoInformation(file)
            } else {
              console.log(`Invalid file type: ${mimetype}`)
              continue
            }

            media = await db.Media.create({
              ...mediaInfo,
              path: file,
              name: path.basename(file, path.extname(file)),
              size: stat.size,
              mimetype: mimetype,
              checksum: this.getFileMd5(file),
              lastModified: new Date(stat.mtime)
            })
          } catch (err) {
            console.log(`FAILED to scan file ${file}: `, err.message)
            continue
          }
        }

        this.mediaCache.add(media.id)

        let dirpath = path.dirname(media.path)

        // If we've already processed this path, just set the folder and continue
        if (this.pathCache[dirpath]) {
          media.setFolder(this.pathCache[dirpath])
          continue
        }

        let parent = null
        for (let dir of dirpath.split('/').filter(p => p !== '')) {
          let parentId = parent !== null ? parent.id : null
          parent = (await db.Folder.findOrCreate({
            where: {
              name: dir,
              parentId: parentId
            }
          }))[0]

          this.folderIds.add(parent.id)
        }

        this.pathCache[dirpath] = parent.id
        media.setFolder(parent)
      }
    }

    await db.Folder.destroy({
      where: {
        id: {
          [Op.notIn]: [...this.folderIds]
        }
      }
    })

    await db.Media.destroy({
      where: {
        id: {
          [Op.notIn]: [...this.mediaCache]
        }
      }
    })

    this.running = false
  }

  async getVideoInformation (filepath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(fs.createReadStream(filepath), (err, metadata) => {
        if (err) {
          return reject(err)
        }

        let videoStream = null
        for (let stream of metadata.streams) {
          if (stream.codec_type === 'video') {
            videoStream = stream
            break
          }
        }

        if (videoStream) {
          return resolve({
            width: videoStream.width,
            height: videoStream.height
          })
        }

        return reject(`No video stream found in file ${filepath}`)
      })
    })
  }

  async getImageInformation (filepath) {
    let imageInfo = await sharp(filepath).metadata()

    return {
      width: imageInfo.width,
      height: imageInfo.height
    }
  }

  walk (dir, results) {
    results = results || []

    let list = fs.readdirSync(dir)
    for (let file of list) {
      file = path.resolve(dir, file)
      let stat = fs.statSync(file)
      if (stat.isDirectory()) {
        results = results.concat(this.walk(file))
      } else {
        results.push(file)
      }
    }

    return results
  }

  getFileMd5 (filepath) {
    let sum = crypto.createHash('md5')
    sum.update(fs.readFileSync(filepath))

    return sum.digest('hex')
  }
}

if (require.main === module) {
  let scanner = new Scanner()
  scanner.run(process.argv.slice(2))
} else {
  module.exports = Scanner
}
