const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../../dist/spa/index.html'))
})

router.post('/login', wrap(async (req, res, next) => {
  let user = await db.User.findOne({
    where: {
      email: req.body.email
    }
  })

  if (!user || !user.verifyPassword(req.body.password)) {
    return res.status(403).json([])
  }

  let payload = {
    id: user.id,
    emaill: user.email,
    updated: user.updatedAt.toString()
  }

  let token = jwt.sign(payload, '$dacHDq4itaegfpQV-si21AZL1-!FT^ssPSjU0QP', {
    expiresIn: 36000
  })

  return res.json({
    ...user.toJSON(),
    token: `Bearer ${token}`
  })
}))

router.get('/ping', wrap(async (req, res, next) => {
  let user = await auth.authorize(req, res, next)
  if (!user) {
    return res.status(403).json([])
  }

  return res.json([])
}))

router.get('/config', wrap(async (req, res, next) => {
  res.json(await db.Config.findAll())
}))

router.post('/config', wrap(async (req, res, next) => {
  let user = await auth.authorize(req, res, next)
  if (!user) {
    return res.status(403)
  }

  let retval = []
  for (let key in req.body) {
    let config = await db.Config.findOne({
      where: {
        name: key
      }
    })

    if (!config) {
      config = await db.Config.create({
        name: key,
        value: req.body[key]
      })
    } else {
      config.update({
        value: req.body[key]
      })
    }

    retval.push(config)
  }

  return res.json(retval)
}))

router.put('/config', wrap(async (req, res, next) => {
  let user = await auth.authorize(req, res, next)
  if (!user) {
    return res.status(403)
  }

  for (let key in req.body) {
    await db.Config.update({
      value: req.body[key]
    }, {
      where: {
        name: key
      }
    })
  }

  return res.json(await db.Config.findAll())
}))

router.get('/search', wrap(async (req, res, next) => {
  let retval = {
    media: [],
    albums: []
  }

  let terms = req.query.query.split(' ')

  for (let term of terms) {
    retval.media = retval.media.concat(await db.Media.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${term}%`
            }
          },
          {
            description: {
              [Op.like]: `%${term}%`
            }
          }
        ]
      }
    }))

    let tags = await db.Tag.findAll({
      where: {
        name: {
          [Op.like]: `%${term}%`
        }
      }
    })
    for (let tag of tags) {
      retval.media = retval.media.concat(await tag.getMedia())
    }

    retval.albums = retval.albums.concat(await db.Album.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${term}%`
            }
          },
          {
            description: {
              [Op.like]: `%${term}%`
            }
          }
        ]
      }
    }))
  }

  let direction = (req.query.order || 'desc').toUpperCase()

  let sortField = null
  switch (req.query.sortMode) {
    case 'date_added':
      sortField = 'id'
      break
    case 'name':
      sortField = 'name'
      break
  }

  if (sortField) {
    retval.media.sort((a, b) => {
      let comparison = 0
      switch (direction) {
        case 'ASC':
          if (a[sortField] > b[sortField]) {
            comparison = 1
          } else if (a[sortField] < b[sortField]) {
            comparison = -1
          }
          break
        case 'DESC':
          if (a[sortField] < b[sortField]) {
            comparison = 1
          } else if (a[sortField] > b[sortField]) {
            comparison = -1
          }
          break
      }

      return comparison
    })
  }

  res.json(retval)
}))

module.exports = router
function newFunction (user) {
  console.log(user)
}
