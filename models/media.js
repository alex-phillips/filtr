'use strict'

module.exports = (sequelize, DataTypes) => {
  const media = sequelize.define('media', {
    path: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    mimetype: DataTypes.STRING,
    size: DataTypes.INTEGER,
    checksum: DataTypes.STRING
  }, {})

  media.associate = function (models) {
  }

  return media
}
