const Scanner = require('../scanner')
const db = require('../models/index')

const libraryScanner = new Scanner()

class Socket {
  routes = {
    'scan': this.scan
  }

  constructor (connection) {
    this.connection = connection

    for (let route in this.routes) {
      this.connection.on(route, this.routes[route])
    }
  }

  emit (event, data) {
    this.connection.emit(event, data)
  }

  async scan () {
    if (libraryScanner.isRunning() === true) {
      this.emit('scan', 'Scan already in progress')
    } else {
      let path = await db.Config.findOne({
        where: {
          name: 'path'
        }
      })
      libraryScanner.setPath(path.value)
      this.emit('scan', 'Starting library scan...')
      await libraryScanner.run()
      this.emit('scan', 'Scan completed!')
    }
  }
}

module.exports = Socket
