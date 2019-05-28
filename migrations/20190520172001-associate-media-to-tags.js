'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'media_to_tags',
      {
        tagId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          unique: 'mediaTag'
        },
        mediaId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          unique: 'mediaTag'
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
    return queryInterface.dropTable('media_to_tags')
  }
}
