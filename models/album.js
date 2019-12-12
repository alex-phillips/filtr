'use strict'

const Sequelize = require('sequelize')

class Album extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      public: DataTypes.BOOLEAN,
      parentId: DataTypes.INTEGER,
      previewId: DataTypes.INTEGER
    }, {
      sequelize,
      tableName: 'albums'
    })
  }

  static associate (models) {
    this.belongsToMany(models.Media, {
      through: 'media_to_albums',
      as: 'media'
    })

    this.belongsTo(models.Media, {
      as: 'preview',
      foreignKey: 'previewId'
    })

    this.hasMany(models.Album, {
      as: 'children',
      foreignKey: 'parentId'
    })

    this.belongsTo(models.Album, {
      as: 'parent',
      foreignKey: 'parentId'
    })
  }

  toJSON () {
    return {
      ...this.get(),
      url: `/albums/${this.id}`
    }
  }
}

module.exports = Album
