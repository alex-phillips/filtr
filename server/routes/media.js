const express = require('express')
const router = express.Router()
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')

router.get('/', wrap(async (req, res, next) => {
  let limit = 75
  return res.json(await db.Media.findAll({
    limit: limit,
    offset: req.query.offset || 0
  }))
}))

router.get('/:ids', wrap(async (req, res, next) => {
  let ids = req.params.ids.split(',')
  let media = await db.Media.findAll({
    where: {
      id: ids
    },
    include: [{
      model: db.Tag,
      as: 'tags',
      attributes: ['id', 'name']
    }]
  })

  if (ids.length === 1 && media.length === 1) {
    return res.json(media[0].toJSON())
  }

  res.json(media.toJSON())
}))

router.get('/:id/original', wrap(async (req, res, next) => {
  let media = await db.Media.findOne({
    where: {
      id: req.params.id
    }
  })

  res.sendFile(media.path)
}))

router.get('/:id/thumbnail', wrap(async (req, res, next) => {
  let media = await db.Media.findOne({
    where: {
      id: req.params.id
    }
  })

  res.sendFile(await media.getThumbnail())
}))

router.put('/:id', wrap(async (req, res, next) => {
  delete req.body.id

  await db.Media.update(req.body, {
    where: {
      id: req.params.id
    }
  })

  let media = await db.Media.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: db.Tag,
        as: 'tags'
      }
    ]
  })

  if (req.body.tags) {
    await media.setTags(req.body.tags)
    media = await db.Media.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.Tag,
          as: 'tags'
        }
      ]
    })
  }

  return res.json(media)
}))

module.exports = router
