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
