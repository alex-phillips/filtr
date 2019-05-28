const express = require('express')
const router = express.Router()
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')

router.get('/', wrap(async (req, res, next) => {
  let limit = 50
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

router.put('/:ids', wrap(async (req, res, next) => {
  let retval = []

  delete req.body.id
  let ids = req.params.ids.split(',')

  for (let id of ids) {
    if (ids.length === 1) {
      // Only update media attributes if editing single item
      await db.Media.update(req.body, {
        where: {
          id: id
        }
      })
    }

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
