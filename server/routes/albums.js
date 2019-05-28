const express = require('express')
const router = express.Router()
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')

/**
 * Get all albums
 */
router.get('/', wrap(async (req, res, next) => {
  let albums = await db.Album.findAll({
    limit: 50,
    offset: req.query.offset || 0,
    include: [
      {
        model: db.Media,
        as: 'media'
      }
    ]
  })

  return res.json(albums)
}))

/**
 * Get an album
 */
router.get('/:id', wrap(async (req, res, next) => {
  let album = await db.Album.findOne({
    where: {
      id: req.params.id
    }
  })

  return res.json(album)
}))

/**
 * Get an album's media
 */
router.get('/:id/media', wrap(async (req, res, next) => {
  let album = await db.Album.findOne({
    where: {
      id: req.params.id
    }
  })

  let media = await album.getMedia({
    limit: 50,
    offset: req.query.offset || 0
  })

  return res.json(media)
}))

/**
 * Create a new album
 */
router.post('/', wrap(async (req, res, next) => {
  let album = await db.Album.create({
    name: req.body.name,
    description: req.body.description
  })

  return res.json(album)
}))

/**
 * Delete an entire album
 */
router.delete('/:ids', wrap(async (req, res, next) => {
  let ids = req.params.ids.split(',')
  await db.Album.destroy({
    where: {
      id: ids
    }
  })

  return res.json([])
}))

/**
 * Add media to an album
 */
router.put('/:id/media/:media_ids', wrap(async (req, res, next) => {
  let album = await db.Album.findOne({
    where: {
      id: req.params.id
    }
  })

  album.addMedia(req.params.media_ids.split(','))

  album = await db.Album.findOne({
    where: {
      id: album.id
    }
  })

  return res.json(album)
}))

/**
 * Remove media from an album
 */
router.delete('/:id/media/:media_ids', wrap(async (req, res, next) => {
  let retval = []
  let ids = req.params.media_ids.split(',')
  for (let id of ids) {
    let media = await db.Media.findOne({
      where: {
        id: id
      }
    })

    try {
      media.removeAlbum(req.params.id)
    } catch (err) {
      console.log(err)
    }

    retval.push(media)
  }

  return res.json(retval)
}))

module.exports = router
