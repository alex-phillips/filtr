const express = require('express')
const router = express.Router()
const { User } = require('../../models/index')
const wrap = require('../middleware/routeWrapper')

router.get('/', wrap(async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json([])
  }

  return res.json(await User.findAll())
}))

router.post('/', wrap(async (req, res, next) => {
  let users = await User.findAll()

  // Do we want to prevent user registration unless logged in?
  if (users.length !== 0 && !req.user) {
    return res.status(403).json([])
  }

  let existing = await User.findOne({
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

  let user = await User.create(req.body)

  return res.json(user)
}))

router.put('/', wrap(async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json([])
  }

  if (!req.user.verifyPassword(req.body.currentPassword)) {
    return res.status(400).json({
      message: 'Incorrect password'
    })
  }

  await req.user.update(req.body)

  return res.json([])
}))

module.exports = router
