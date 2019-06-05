const express = require('express')
const router = express.Router()
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')

router.get('/', wrap(async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json([])
  }

  return res.json(await db.User.findAll())
}))

router.post('/', wrap(async (req, res, next) => {
  let existing = await db.User.findOne({
    where: {
      email: req.body.email
    }
  })

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists'
    })
  }

  let user = await db.User.create(req.body)

  return res.json(user)
}))

module.exports = router
