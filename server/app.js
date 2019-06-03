'use strict'

require('../bootstrap')

const debug = require('debug')
const http = require('http')
const createError = require('http-errors')
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cors())

/**
 * Import and use routes
 */
const routes = {
  '': require('./routes/index'),
  'media': require('./routes/media'),
  'albums': require('./routes/albums'),
  'tags': require('./routes/tags'),
  'folders': require('./routes/folders')
}

app.use(express.static(path.join(__dirname, '../dist/spa/')))

for (let route in routes) {
  app.use(`/${route}`, routes[route])
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000'
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

const io = require('socket.io')(server)
const Socket = require('./socket')
io.on('connection', socket => {
  let connection = new Socket(socket)
})

/**
 * Listen on provided port, on all network interfaces.
 */
let s = server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
