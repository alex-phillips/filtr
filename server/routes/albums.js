const express = require('express')
const router = express.Router()
const db = require('../../models/index')

router.get('/:id', (req, res, next) => {
  console.log(req.params)
  db.Album.findOne({
    where: {
      id: req.params.id
    },
    include: [db.Media]
  })
    .then(album => res.json(album))
})

module.exports = router
