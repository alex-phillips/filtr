'use strict'

const Sequelize = require('sequelize')
const fs = require('fs')
const path = require('path')

/**
 * required for processing GIF thumbnails
 */
const { execFileSync } = require('child_process')
const gifsicle = require('gifsicle')

/**
 * for handling normal images
 */
const sharp = require('sharp')

/**
 * for creating thumbnail (screenshot) for videos
 */
const ffmpeg = require('fluent-ffmpeg')

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
      checksum: DataTypes.STRING
    }, { sequelize })
  }

  static associate (models) {
    this.belongsToMany(models.Album, {
      through: 'media_to_albums'
    })
  }

  async getThumbnail () {
    let thumbnail = `${process.env.BASE_DIR}/cache/thumbnails/${this.id}${path.extname(this.path)}`
    if (this.mimetype.match(/video\//)) {
      thumbnail = `${process.env.BASE_DIR}/cache/thumbnails/${this.id}.png`
    }

    if (fs.existsSync(thumbnail)) {
      return thumbnail
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
            folder: path.dirname(thumbnail)
          })
      })
    }

    switch (this.mimetype) {
      case 'image/gif':
        execFileSync(gifsicle, ['--scale', '0.5', '-o', thumbnail, this.path])
        break
      default:
        await sharp(this.path).resize({ width: this.width / 2 }).toFile(thumbnail)
    }

    return thumbnail
  }
}

module.exports = Media
