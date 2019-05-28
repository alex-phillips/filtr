'use strict'

const Sequelize = require('sequelize')

class Tag extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      name: DataTypes.STRING
    }, { sequelize })
  }

  static associate (models) {
    this.belongsToMany(models.Media, {
      through: 'media_to_tags',
      foreignKey: 'tagId',
      as: 'media'
    })
  }

  toJSON () {
    return {
      ...this.get(),
      url: `/tags/${this.id}`
    }
  }
}

module.exports = Tag
