const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../dist/spa/index.html'))
})

router.get('/search', wrap(async (req, res, next) => {
  let query = req.query.query

  let albums = db.Album.findAll({

  })
}))

module.exports = router
