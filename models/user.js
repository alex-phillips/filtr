'use strict'

const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

class User extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set (val) {
          this.setDataValue('password', bcrypt.hashSync(val, 10))
        }
      }

    }, { sequelize })
  }

  verifyPassword (check) {
    return bcrypt.compareSync(check, this.password)
  }

  toJSON () {
    return this.get()
  }
}

module.exports = User
