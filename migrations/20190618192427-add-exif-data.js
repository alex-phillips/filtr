'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'media',
        'iso',
        {
          type: Sequelize.STRING,
          after: 'public',
          defaultValue: ''
        }
      ),
      queryInterface.addColumn(
        'media',
        'aperture',
        {
          type: Sequelize.STRING,
          after: 'public',
          defaultValue: ''
        }
      ),
      queryInterface.addColumn(
        'media',
        'make',
        {
          type: Sequelize.STRING,
          after: 'public',
          defaultValue: ''
        }
      ),
      queryInterface.addColumn(
        'media',
        'model',
        {
          type: Sequelize.STRING,
          after: 'public',
          defaultValue: ''
        }
      ),
      queryInterface.addColumn(
        'media',
        'shutter',
        {
          type: Sequelize.STRING,
          after: 'public',
          defaultValue: ''
        }
      ),
      queryInterface.addColumn(
        'media',
        'focal',
        {
          type: Sequelize.STRING,
          after: 'public',
          defaultValue: ''
        }
      ),
      queryInterface.addColumn(
        'media',
        'orientation',
        {
          type: Sequelize.INTEGER,
          after: 'public',
          defaultValue: 1
        }
      ),
      queryInterface.addColumn(
        'media',
        'latitude',
        {
          type: Sequelize.FLOAT,
          after: 'public',
          defaultValue: 0.0
        }
      ),
      queryInterface.addColumn(
        'media',
        'longitude',
        {
          type: Sequelize.FLOAT,
          after: 'public',
          defaultValue: 0.0
        }
      ),
      queryInterface.addColumn(
        'media',
        'altitude',
        {
          type: Sequelize.FLOAT,
          after: 'public',
          defaultValue: 0.0
        }
      ),
      queryInterface.addColumn(
        'media',
        'takestamp',
        {
          type: Sequelize.DATE,
          after: 'public'
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      'iso',
      'aperture',
      'make',
      'model',
      'shutter',
      'focal',
      'orientation',
      'latitude',
      'longitude',
      'altitude',
      'takestamp'
    ].map(field => {
      return queryInterface.removeColumn('media', field)
    }))
  }
}
