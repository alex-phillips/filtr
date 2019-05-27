const express = require('express')
const router = express.Router()
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')

router.get('/', wrap(async (req, res, next) => {
  return res.json(await db.Tag.findAll())
}))

router.get('/:ids', wrap(async (req, res, next) => {
  let ids = req.params.ids.split(',')
  let tags = await db.Tag.findAll({
    where: {
      id: ids
    },
    include: [
      {
        model: db.Media,
        as: 'media',
        nested: false,
        attributes: ['id']
      }
    ]
  })

  if (tags.length === 0) {
    return res.status(404).json([])
  }

  if (ids.length === 1) {
    return res.json(tags[0])
  }

  return res.json(tags)
}))

router.post('/', wrap(async (req, res, next) => {
  let tag = await db.Tag.create({
    name: req.body.name
  })

  return res.json(tag)
}))

module.exports = router
