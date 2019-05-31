'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'albums',
      'parentId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'albums',
          key: 'id'
        },
        onDelete: 'SET NULL'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('albums', 'parentId')
  }
}
