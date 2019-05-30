'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'media',
      'folderId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'folders',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('media', 'folderId')
  }
}
