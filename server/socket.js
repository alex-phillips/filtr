const Scanner = require('../scanner')
const { Config } = require('../models/index')

const libraryScanner = new Scanner()

class Socket {
  constructor (connection) {
    this.connection = connection

    let routes = {
      'scan': this.scan
    }

    for (let route in routes) {
      this.connection.on(route, routes[route])
    }
  }

  emit (event, data) {
    this.connection.emit(event, data)
  }

  async scan () {
    if (libraryScanner.isRunning() === true) {
      this.emit('scan', 'Scan already in progress')
    } else {
      let path = await Config.findOne({
        where: {
          name: 'path'
        }
      })
      this.emit('scan', 'Starting library scan...')
      try {
        await libraryScanner.run(path.value.split('\n'))
        this.emit('scan', 'Scan completed!')
      } catch (err) {
        this.emit('scan', err.message)
      }
    }
  }
}

module.exports = Socket
