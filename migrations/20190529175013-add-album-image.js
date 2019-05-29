'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'albums',
      'previewId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'media',
          key: 'id'
        },
        onDelete: 'SET NULL'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('albums', 'previewId')
  }
}
