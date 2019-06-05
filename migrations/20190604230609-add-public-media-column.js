'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'media',
      'public',
      {
        type: Sequelize.BOOLEAN,
        after: 'lastModified',
        defaultValue: 0
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('media', 'public')
  }
}
