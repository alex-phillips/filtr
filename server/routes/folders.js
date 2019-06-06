const express = require('express')
const router = express.Router()
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')

/**
 * Get all folders
 */
router.get('/', wrap(async (req, res, next) => {
  let filter = null
  try {
    filter = JSON.parse(req.query.filter)
  } catch (e) {}

  let folders = await db.Folder.findAll({
    where: filter
  })

  return res.json(folders)
}))

/**
 * Get a folder's media
 */
router.get('/:id/media', wrap(async (req, res, next) => {
  let media = await db.Media.findAll({
    where: {
      folderId: req.params.id,
      ...!req.user && { public: 1 }
    },
    limit: 50,
    offset: req.query.offset || 0,
    order: db.Media.buildOrderQuery(req.query.sortMode, req.query.order)
  })

  return res.json(media)
}))

module.exports = router
