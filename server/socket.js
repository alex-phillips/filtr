const Scanner = require('../scanner')
const db = require('../models/index')

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
      let path = await db.Config.findOne({
        where: {
          name: 'path'
        }
      })
      libraryScanner.setPath(path.value)
      this.emit('scan', 'Starting library scan...')
      try {
        await libraryScanner.run()
        this.emit('scan', 'Scan completed!')
      } catch (err) {
        this.emit('scan', 'There was a problem running the scan: ', err.message)
      }
    }
  }
}

module.exports = Socket
