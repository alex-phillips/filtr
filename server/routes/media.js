const express = require('express')
const router = express.Router()
const db = require('../../models/index')

router.get('/', (req, res, next) => {
  db.Media.findAll()
    .then(media => res.json(media))
})

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

router.put('/:id', (req, res, next) => {
  db.Media.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(media => {
      for (let prop of [
        'name',
        'description'
      ]) {
        media[prop] = req.body[prop] || media[prop]
      }

      return media.save().then(() => res.json(media))
    })
})

module.exports = router
