'use strict'

const Sequelize = require('sequelize')

class Folder extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      name: DataTypes.STRING,
      parentId: DataTypes.INTEGER
    }, { sequelize })
  }

  static associate (models) {
    this.hasMany(models.Folder, {
      as: 'children',
      foreignKey: 'parentId'
    })

    this.belongsTo(models.Folder, {
      as: 'parent',
      foreignKey: 'parentId'
    })

    this.hasMany(models.Media, {
      as: 'media',
      foreignKey: 'folderId'
    })
  }

  toJSON () {
    return {
      ...this.get(),
      url: `/folders/${this.id}`
    }
  }
}

module.exports = Folder
