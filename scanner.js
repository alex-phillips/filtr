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
  constructor (path) {
    this.path = path
    this.running = false
  }

  setPath (path) {
    this.path = path
  }

  isRunning () {
    return this.running
  }

  async run () {
    this.running = true

    let pathCache = {}
    let mediaCache = new Set()
    let folderIds = new Set()

    let files = this.walk(this.path)
    for (let file of files) {
      let mimetype = await db.Media.getMIMEType(file)

      console.log(`SCANNING file ${file} with MIMETYPE ${mimetype}`)

      let media = null
      try {
        if (mimetype.match(/image\/(?:png|jpg|jpeg|gif)/)) {
          media = await this.processImage(file, mimetype)
        } else if (mimetype.match(/video\//)) {
          media = await this.processVideo(file, mimetype)
        } else {
          console.log(`Invalid file type: ${mimetype}`)
          continue
        }
      } catch (err) {
        console.log(`FAILED to scan file ${file}: `, err.message)
        continue
      }

      mediaCache.add(media.id)

      let dirpath = path.dirname(media.path)

      // If we've already processed this path, just set the folder and continue
      if (pathCache[dirpath]) {
        media.setFolder(pathCache[dirpath])
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

        folderIds.add(parent.id)
      }

      pathCache[dirpath] = parent.id
      media.setFolder(parent)
    }

    db.Folder.destroy({
      where: {
        id: {
          [Op.notIn]: [...folderIds]
        }
      }
    })

    db.Media.destroy({
      where: {
        id: {
          [Op.notIn]: [...mediaCache]
        }
      }
    })

    this.running = false
  }

  async processImage (file, mimetype) {
    let photo = await db.Media.findOne({
      where: {
        path: file
      }
    })

    let stat = fs.statSync(file)
    if (photo && photo.size === stat.size && photo.lastModified.toString() === (new Date(stat.mtime).toString())) {
      return photo
    }

    // Remove thumbnail if it exists and the photo was updated
    if (photo && fs.existsSync(photo.getThumbnailPath())) {
      fs.unlinkSync(photo.getThumbnailPath())
    }

    let imageInfo = await this.getImageInformation(file)
    if (!photo) {
      photo = await db.Media.create({
        ...imageInfo,
        size: stat.size,
        mimetype: mimetype,
        lastModified: new Date(stat.mtime)
      })
    }

    return photo
  }

  async processVideo (file, mimetype) {
    let video = await db.Media.findOne({
      where: {
        path: file
      }
    })

    if (!video) {
      video = await db.Media.create({ ...await this.getVideoInformation(file), mimetype: mimetype })
    }

    return video
  }

  async getVideoInformation (filepath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filepath, (err, metadata) => {
        if (err) {
          return reject(err)
        }

        return resolve({
          path: filepath,
          name: path.basename(filepath, path.extname(filepath)),
          size: metadata.format.size,
          width: metadata.streams[0].width,
          height: metadata.streams[0].height,
          checksum: this.getFileMd5(filepath)
        })
      })
    })
  }

  async getImageInformation (filepath) {
    let imageInfo = await sharp(filepath).metadata()

    return {
      path: filepath,
      name: path.basename(filepath, path.extname(filepath)),
      width: imageInfo.width,
      height: imageInfo.height,
      checksum: this.getFileMd5(filepath)
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

module.exports = Scanner
