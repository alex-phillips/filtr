const express = require('express')
const router = express.Router()
const { Media, Folder } = require('../../models/index')
const wrap = require('../middleware/routeWrapper')
const passport = require('passport')

/**
 * Get all folders
 */
router.get('/', passport.authenticate('jwt', { session: false }), wrap(async (req, res, next) => {
  let filter = null
  try {
    filter = JSON.parse(req.query.filter)
  } catch (e) {}

  let folders = await Folder.findAll({
    where: filter
  })

  return res.json(folders)
}))

/**
 * Get a folder's media
 */
router.get('/:id/media', passport.authenticate('jwt', { session: false }), wrap(async (req, res, next) => {
  let media = await Media.findAll({
    where: {
      folderId: req.params.id
    },
    limit: 50,
    offset: req.query.offset || 0,
    order: Media.buildOrderQuery(req.query.sortMode, req.query.order)
  })

  return res.json(media)
}))

module.exports = router
