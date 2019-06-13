const express = require('express')
const router = express.Router()
const { Media, Tag } = require('../../models/index')
const wrap = require('../middleware/routeWrapper')
const passport = require('passport')

router.get('/', wrap(async (req, res, next) => {
  return res.json(await Tag.findAll())
}))

router.get('/:ids', wrap(async (req, res, next) => {
  let ids = req.params.ids.split(',')
  let tags = await Tag.findAll({
    where: {
      id: ids
    }
    // include: [
    //   {
    //     model: Media,
    //     as: 'media',
    //     nested: false,
    //     attributes: ['id']
    //   }
    // ]
  })

  if (tags.length === 0) {
    return res.status(404).json([])
  }

  if (ids.length === 1) {
    return res.json(tags[0])
  }

  return res.json(tags)
}))

router.get('/:id/media', wrap(async (req, res, next) => {
  let where = {
    id: req.params.id
  }

  let tag = await Tag.findOne({
    where: where
  })

  where = {
    ...!req.user && { public: 1 }
  }

  let media = await tag.getMedia({
    limit: 50,
    offset: req.query.offset || 0,
    order: Media.buildOrderQuery(req.query.sortMode, req.query.order),
    where: where,
    include: [
      {
        model: Tag,
        as: 'tags'
      }
    ]
  })

  return res.json(media)
}))

router.post('/', passport.authenticate('jwt', { session: false }), wrap(async (req, res, next) => {
  let tag = await Tag.create({
    name: req.body.name
  })

  return res.json(tag)
}))

module.exports = router
