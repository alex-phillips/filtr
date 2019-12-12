'use strict'

const Sequelize = require('sequelize')

class Config extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      name: DataTypes.STRING,
      value: DataTypes.STRING
    }, {
      sequelize,
      tableName: 'configs'
    })
  }
}

module.exports = Config
