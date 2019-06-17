const express = require('express')
const router = express.Router()
const { Media, Tag } = require('../../models/index')
const wrap = require('../middleware/routeWrapper')
const passport = require('passport')
const fs = require('fs')
const childProcess = require('child_process')
const config = require('../../config/app.json')[process.env.NODE_ENV || 'development']

router.get('/', wrap(async (req, res, next) => {
  let limit = 50
  return res.json(await Media.findAll({
    limit: limit,
    offset: req.query.offset || 0,
    order: Media.buildOrderQuery(req.query.sortMode, req.query.order),
    where: {
      ...!req.user && { public: 1 }
    },
    include: {
      model: Tag,
      as: 'tags',
      attributes: ['id', 'name']
    }
  }))
}))

router.get('/:ids', wrap(async (req, res, next) => {
  let ids = req.params.ids.split(',')

  let media = await Media.findAll({
    where: {
      id: ids,
      ...!req.user && { public: 1 }
    },
    include: [{
      model: Tag,
      as: 'tags',
      attributes: ['id', 'name']
    }]
  })

  if (media.length === 0) {
    return res.status(404).json([])
  }

  if (ids.length === 1 && media.length === 1) {
    return res.json(media[0])
  }

  res.json(media)
}))

router.get('/:id/original', wrap(async (req, res, next) => {
  let media = await Media.findOne({
    where: {
      id: req.params.id
    }
  })

  if (!req.user && !media.public) {
    return res.sendStatus(404)
  }

  return res.sendFile(media.path)
}))

router.get('/:id/playlist.m3u8', wrap(async (req, res, next) => {
  let media = await Media.findOne({
    where: {
      id: req.params.id
    }
  })

  if (!req.user && !media.public) {
    return res.sendStatus(404)
  }

  if (media.mimetype.match(/image\//)) {
    return res.sendFile(media.path)
  }

  let tsDuration = 10

  res.writeHead(200, {
    'Content-Type': 'application/vnd.apple.mpegurl'
  })

  var json = media.probeVideo()
  try {
    var info = JSON.parse(json)
    if (info && info.format && info.format.duration) {
      res.write('#EXTM3U\n')
      res.write('#EXT-X-VERSION:3\n')
      res.write('#EXT-X-MEDIA-SEQUENCE:0\n')
      res.write('#EXT-X-ALLOW-CACHE:YES\n')
      res.write('#EXT-X-PLAYLIST-TYPE:VOD\n')
      res.write('#EXT-X-TARGETDURATION:' + tsDuration + '\n')
      console.log('duration ', info.format.duration)
      for (var t = 0; t < info.format.duration; t += tsDuration) {
        var currDuration = Math.min(tsDuration, info.format.duration - t)
        res.write('#EXTINF:' + currDuration + ',\n')
        res.write(`${config.server.base_url}/media/${media.id}/segment/${t}/${currDuration}\n`)
      }
      res.write('#EXT-X-ENDLIST\n')
    }
  } catch (err) {
    console.log('error')
  }

  res.end()
}))

router.get('/:id/segment/:start/:duration', wrap(async (req, res, next) => {
  console.log('segment request')
  let media = await Media.findOne({
    where: {
      id: req.params.id
    }
  })

  if (!req.user && !media.public) {
    return res.sendStatus(404)
  }

  var audioBitrate = 128
  var targetWidth = 640
  var targetQuality = 23
  var debug = true

  if (fs.existsSync(media.path) && req.params.start && req.params.duration) {
    var startTime = convertSecToTime(req.params.start)
    var durationTime = convertSecToTime(req.params.duration)
    var fps = 30

    var args = [
      '-ss', startTime,
      '-t', durationTime,
      '-i', media.path,
      '-sn',
      '-async', '0',
      '-acodec', 'aac',
      '-b:a', audioBitrate + 'k',
      '-ar', '44100',
      '-ac', '2',
      // '-vf', 'scale=min(' + targetWidth + '\\, iw):-2', /* '-r', fps, */
      '-vf', `scale=${targetWidth}:-1`,
      '-vcodec', 'libx264',
      '-profile:v', 'baseline',
      '-preset:v', 'ultrafast',
      '-tune', 'zerolatency',
      '-crf', targetQuality,
      '-g', fps,
      '-x264opts', 'level=3.0',
      '-pix_fmt', 'yuv420p',
      '-threads', '0',
      '-v', '0',
      '-flags',
      '-global_header', /* '-map', '0', '-v', 'error', */
      '-f', 'mpegts',
      '-muxdelay', '0',
      '-output_ts_offset', req.params.start, // Need this to tell video.js which time the chunk starts at
      '-y',
      'pipe:1'
    ]

    var encoderChild = childProcess.spawn('ffmpeg', args, { env: process.env })

    console.log('Spawned encoder instance')

    if (debug) { console.log('ffmpeg ' + args.join(' ')) }

    if (debug) {
      encoderChild.stderr.on('data', function (data) {
        console.log(data.toString())
      })
    }

    encoderChild.stdout.on('data', function (data) {
      res.write(data)
    })

    encoderChild.on('exit', function (code) {
      if (code === 0) {
        console.log('Encoder completed')
      } else {
        console.log('Encoder exited with code ' + code)
      }
      res.end()
    })

    req.on('close', function () {
      encoderChild.kill()
      setTimeout(function () {
        encoderChild.kill('SIGKILL')
      }, 5000)
    })
  } else {
    res.writeHead(404)
    res.end()
  }
}))

router.get('/:id/thumbnail', wrap(async (req, res, next) => {
  let media = await Media.findOne({
    where: {
      id: req.params.id
    }
  })

  if (!media) {
    return res.status(404).json([])
  }

  if (!req.user && !media.public) {
    return res.status(404).json([])
  }

  res.sendFile(await media.getThumbnail())
}))

router.put('/:ids', passport.authenticate('jwt', { session: false }), wrap(async (req, res, next) => {
  let retval = []

  delete req.body.id
  let ids = req.params.ids.split(',')

  for (let id of ids) {
    await Media.update(req.body, {
      where: {
        id: ids
      }
    })

    let media = await Media.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: Tag,
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

      media = await Media.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: Tag,
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

function convertSecToTime (sec) {
  var date = new Date(null)
  date.setSeconds(sec)
  var result = date.toISOString().substr(11, 8)
  var tmp = (sec + '').split('.')
  if (tmp.length === 2) {
    result += '.' + tmp[1]
  }
  return result
}

module.exports = router
