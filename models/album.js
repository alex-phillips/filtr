'use strict'

const Sequelize = require('sequelize')

class Album extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      public: DataTypes.BOOLEAN
    }, { sequelize })
  }

  static associate (models) {
    this.belongsToMany(models.Media, {
      through: 'media_to_albums'
    })
  }
}

module.exports = Album
