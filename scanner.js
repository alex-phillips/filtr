process.chdir(__dirname)

require('./bootstrap')
const { Media, Folder } = require('./models/index')
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

      await this.iterateDirectory(dir)
    }

    await Folder.destroy({
      where: {
        id: {
          [Op.notIn]: [...this.folderIds]
        }
      }
    })

    await Media.destroy({
      where: {
        id: {
          [Op.notIn]: [...this.mediaCache]
        }
      }
    })

    this.running = false
  }

  async scanFile (file) {
    console.log(`SCANNING file ${file}`)

    let stat = fs.statSync(file)
    let media = await Media.findOne({
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

      let mimetype = await Media.getMIMEType(file)
      let mediaInfo = {}

      try {
        if (mimetype.match(/image\/(?:png|jpg|jpeg|gif)/)) {
          mediaInfo = await this.getImageInformation(file, mimetype)
        } else if (mimetype.match(/video\//)) {
          mediaInfo = await this.getVideoInformation(file)
        } else {
          console.log(`Invalid file type: ${mimetype}`)
          return
        }

        if (media) {
          media = await media.set({
            ...mediaInfo,
            path: file,
            name: path.basename(file, path.extname(file)),
            size: stat.size,
            mimetype: mimetype,
            checksum: this.getFileMd5(file),
            lastModified: new Date(stat.mtime)
          })
        } else {
          media = await Media.create({
            ...mediaInfo,
            path: file,
            name: path.basename(file, path.extname(file)),
            size: stat.size,
            mimetype: mimetype,
            checksum: this.getFileMd5(file),
            lastModified: new Date(stat.mtime)
          })
        }
      } catch (err) {
        console.log(`FAILED to scan file ${file}: `, err.message)
        return
      }
    }

    this.mediaCache.add(media.id)

    let dirpath = path.dirname(media.path)

    // If we've already processed this path, just set the folder and continue
    if (this.pathCache[dirpath]) {
      media.setFolder(this.pathCache[dirpath])
      return
    }

    let parent = null
    for (let dir of dirpath.split('/').filter(p => p !== '')) {
      let parentId = parent !== null ? parent.id : null
      parent = (await Folder.findOrCreate({
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

  async getImageInformation (filepath, mimetype) {
    let imageInfo = await sharp(filepath).metadata()
    let retval = {
      width: imageInfo.width,
      height: imageInfo.height
    }

    if (mimetype === 'image/jpeg') {
      retval = {
        ...retval,
        ...Media.getEXIFData(filepath)
      }
    }

    return retval
  }

  async iterateDirectory (dirpath) {
    let list = fs.readdirSync(dirpath)

    let files = []
    let folders = []
    for (let item of list) {
      item = `${dirpath}/${item}`
      let stat = fs.statSync(item)
      if (stat.isDirectory()) {
        folders.push(item)
      } else {
        files.push(item)
      }
    }

    for (let file of files) {
      await this.scanFile(file)
    }

    for (let folder of folders) {
      await this.iterateDirectory(folder)
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
