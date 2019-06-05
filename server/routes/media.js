const express = require('express')
const router = express.Router()
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')
const passport = require('passport')

router.get('/', wrap(async (req, res, next) => {
  let where = {}
  if (!req.user) {
    where.public = 1
  }

  let limit = 50
  return res.json(await db.Media.findAll({
    limit: limit,
    offset: req.query.offset || 0,
    order: db.Media.buildOrderQuery(req.query.sortMode, req.query.order),
    where: where,
    include: {
      model: db.Tag,
      as: 'tags',
      attributes: ['id', 'name']
    }
  }))
}))

router.get('/:ids', wrap(async (req, res, next) => {
  let ids = req.params.ids.split(',')
  let where = {
    id: ids
  }

  if (!req.user) {
    where.public = 1
  }

  let media = await db.Media.findAll({
    where: where,
    include: [{
      model: db.Tag,
      as: 'tags',
      attributes: ['id', 'name']
    }]
  })

  if (media.length === 0) {
    return res.status(404).json([])
  }

  if (ids.length === 1 && media.length === 1) {
    return res.json(media[0])
  }

  res.json(media)
}))

router.get('/:id/original', wrap(async (req, res, next) => {
  let media = await db.Media.findOne({
    where: {
      id: req.params.id
    }
  })

  if (!req.user && !media.public) {
    return res.status(404)
  }

  res.sendFile(media.path)
}))

router.get('/:id/thumbnail', wrap(async (req, res, next) => {
  let media = await db.Media.findOne({
    where: {
      id: req.params.id
    }
  })

  if (!media) {
    return res.status(404).json([])
  }

  if (!req.user && !media.public) {
    return res.status(404).json([])
  }

  res.sendFile(await media.getThumbnail())
}))

router.put('/:ids', passport.authenticate('jwt', { session: false }), wrap(async (req, res, next) => {
  let retval = []

  delete req.body.id
  let ids = req.params.ids.split(',')

  for (let id of ids) {
    await db.Media.update(req.body, {
      where: {
        id: ids
      }
    })

    let media = await db.Media.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: db.Tag,
          as: 'tags'
        }
      ]
    })

    if (req.body.tags) {
      // Use `setTags` if editing a single one. When editing multiple, we
      // only want to append tags.
      if (ids.length === 1) {
        await media.setTags(req.body.tags)
      } else {
        await media.addTags(req.body.tags)
      }

      media = await db.Media.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: db.Tag,
            as: 'tags'
          }
        ]
      })
    }

    retval.push(media)
  }

  // If the initial request was only for a single ID, return JUST that object,
  // otherwise, return an array of all objects
  if (ids.length === 1) {
    return res.json(retval[0])
  }

  return res.json(retval)
}))

module.exports = router
