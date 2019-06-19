'use strict'

const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')

/**
 * required for processing GIF thumbnails
 */
// const { execFileSync } = require('child_process')
// const gifsicle = require('gifsicle')

/**
 * for handling normal images
 */
const sharp = require('sharp')

/**
 * for creating thumbnail (screenshot) for videos
 */
const ffmpeg = require('fluent-ffmpeg')

/**
 * for determining file mimetype
 */
const mmmagic = require('mmmagic')
const Magic = require('mmmagic').Magic

/**
 * To spawn child processes for things like ffprobe
 */
const childProcess = require('child_process')

/**
 * Package to extract EXIF image data
 */
const exifParser = require('exif-parser')

class Media extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      path: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      mimetype: DataTypes.STRING,
      size: DataTypes.INTEGER,
      checksum: DataTypes.STRING,
      lastModified: DataTypes.DATE,
      public: DataTypes.BOOLEAN,
      iso: DataTypes.STRING,
      aperture: DataTypes.STRING,
      make: DataTypes.STRING,
      model: DataTypes.STRING,
      shutter: DataTypes.STRING,
      focal: DataTypes.STRING,
      orientation: DataTypes.INTEGER,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      altitude: DataTypes.FLOAT,
      takestamp: DataTypes.DATE
    }, { sequelize })
  }

  static associate (models) {
    this.belongsToMany(models.Album, {
      through: 'media_to_albums',
      foreignKey: 'mediaId',
      as: 'albums'
    })

    this.belongsToMany(models.Tag, {
      through: 'media_to_tags',
      foreignKey: 'mediaId',
      as: 'tags'
    })

    this.belongsTo(models.Folder, {
      foreignKey: 'folderId',
      as: 'folder'
    })
  }

  getThumbnailPath () {
    return `${process.env.BASE_DIR}/cache/thumbnails/${this.id}.png`
  }

  /**
   * Retreive the thumbnail filepath and generate it if it doesn't
   * already exist
   */
  async getThumbnail () {
    let thumbnail = this.getThumbnailPath()

    let stat = fs.statSync(this.path)

    if (fs.existsSync(thumbnail) && stat.mtime.toString() === this.lastModified.toString()) {
      return thumbnail
    }

    let h = 350
    let w = Math.round(this.width * h / this.height)

    // Don't make a thumbnail if it's smaller than what we're going to make anyway
    if (this.height <= h) {
      return this.path
    }

    if (this.mimetype.match(/video\//)) {
      return new Promise((resolve, reject) => {
        ffmpeg(this.path)
          .on('end', () => {
            return resolve(thumbnail)
          })
          .screenshots({
            count: 1,
            timemarks: [0],
            filename: path.basename(thumbnail),
            folder: path.dirname(thumbnail),
            size: `${w}x${h}`
          })
      })
    }

    switch (this.mimetype) {
      // case 'image/gif':
      //   execFileSync(gifsicle, ['--scale', '0.5', '-o', thumbnail, this.path])
      //   break
      default:
        await sharp(this.path).resize({ width: w }).toFile(thumbnail)
        fs.utimesSync(thumbnail, new Date(this.lastModified), new Date(this.lastModified))
    }

    return thumbnail
  }

  probeVideo () {
    let args = [
      '-v', '0',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      this.path
    ]

    // Startup is a LOT quicker with the previous args, but this set MIGHT get is keyframes?
    // Might not be necessary since we're transcoding anyway though
    // var args = [
    //   '-i', this.path, '-show_frames',
    //   '-skip_frame', 'nokey',
    //   '-select_streams', 'v',
    //   '-show_entries',
    //   'frame=pkt_dts_time', // 'frame=pkt_pts_time' works for everything except avi
    //   '-print_format', 'json',
    //   '-show_format'
    // ]

    let probeChild = childProcess.spawnSync('ffprobe', args)

    return probeChild.stdout.toString()
  }

  toJSON () {
    let data = this.get()

    if (data.orientation === 7) {
      console.log(data)
    }

    switch (data.orientation) {
      case 5:
      case 6:
      case 7:
      case 8:
        let w = data.width
        let h = data.height
        data.realWidth = h
        data.width = h
        data.realHeight = w
        data.height = w
        break
    }

    if (data.orientation === 7) {
      console.log(data)
    }

    return {
      ...data,
      url: `/media/${this.id}`
    }
  }

  /**
   * Return the mimetype of the given file
   */
  static async getMIMEType (file) {
    return new Promise((resolve, reject) => {
      let detector = new Magic(mmmagic.MAGIC_MIME_TYPE)
      detector.detectFile(file, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  }

  static getEXIFData (path) {
    let parser = exifParser.create(fs.readFileSync(path))

    try {
      let data = parser.parse().tags

      return {
        iso: data.ISO,
        aperture: '',
        make: data.Make,
        model: data.Model,
        shutter: data.ExposureTime,
        focal: data.FocalLength,
        orientation: data.Orientation,
        latitude: data.GPSLatitude,
        longitude: data.GPSLongitude,
        altitude: data.GPSAltitudeRef,
        takestamp: new Date(data.DateTimeOriginal * 1000)
      }
    } catch (err) {
      return {}
    }
  }

  static buildOrderQuery (mode, direction) {
    let order = []
    direction = (direction || 'desc').toUpperCase()
    switch (mode) {
      case 'date_added':
        order.push(['id', direction])
        break
      case 'name':
        order.push(['name', direction])
        break
    }

    return order
  }
}

module.exports = Media
