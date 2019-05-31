'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'media_to_albums',
      {
        albumId: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        mediaId: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('media_to_albums')
  }
}
