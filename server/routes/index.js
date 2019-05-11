const express = require('express')
const router = express.Router()
const path = require('path')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../dist/spa/index.html'))
})

module.exports = router
