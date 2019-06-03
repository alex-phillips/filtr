const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../../models/index')
const wrap = require('../middleware/routeWrapper')
const { Op } = require('sequelize')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendfile(path.join(__dirname, '../../dist/spa/index.html'))
})

router.get('/config', wrap(async (req, res, next) => {
  res.json(await db.Config.findAll())
}))

router.post('/config', wrap(async (req, res, next) => {
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

  res.json(retval)
}))

module.exports = router
