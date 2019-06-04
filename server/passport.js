/**
 * Passport for authentication
 */
const { Strategy, ExtractJwt } = require('passport-jwt')
const db = require('../models/index')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = '$dacHDq4itaegfpQV-si21AZL1-!FT^ssPSjU0QP'

module.exports = passport => {
  passport.use(new Strategy(opts, async (payload, done) => {
    try {
      let user = await db.User.findOne({
        where: {
          id: payload.id
        }
      })

      return done(null, user)
    } catch (err) {
      return done(null, false)
    }
  }))
}
