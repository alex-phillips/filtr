const express = require('express')
const router = express.Router()
const db = require('../../models/index')

router.get('/:id', (req, res, next) => {
  db.Media.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(media => res.json(media))
})

router.get('/:id/original', (req, res, next) => {
  db.Media.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(media => {
      res.sendFile(media.path)
    })
})

router.get('/:id/thumb', (req, res, next) => {
  db.Media.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(media => media.getThumbnail())
    .then(thumbnail => res.sendFile(thumbnail))
})

module.exports = router
