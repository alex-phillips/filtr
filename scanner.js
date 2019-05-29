require('./bootstrap')
const db = require('./models/index')
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg')

class Scanner {
  constructor (path) {
    this.path = path
  }

  async run () {
    let files = this.walk(this.path)

    for (let file of files) {
      let mimetype = await db.Media.getMIMEType(file)

      if (mimetype.match(/image\/(?:png|jpg|jpeg|gif)/)) {
        await this.processImage(file, mimetype)
      } else if (mimetype.match(/video\//)) {
        await this.processVideo(file, mimetype)
      } else {
        console.log(`Invalid file type: ${mimetype}`)
        continue
      }
    }
  }

  async processImage (file, mimetype) {
    let photo = await db.Media.findOne({
      where: {
        path: file
      }
    })

    let imageInfo = await this.getImageInformation(file)
    if (!photo) {
      photo = await db.Media.create({ ...imageInfo, mimetype: mimetype })
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
    let stat = fs.statSync(filepath)

    try {
      var imageInfo = await sharp(filepath).metadata()
    } catch (e) {
      console.log(e)
      process.exit()
    }

    return {
      path: filepath,
      name: path.basename(filepath, path.extname(filepath)),
      size: stat.size,
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

let scanner = new scanner(process.argv[2])
scanner.run()
