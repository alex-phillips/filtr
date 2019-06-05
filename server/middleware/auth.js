const passport = require('passport')

module.exports = {
  authorize: function (req, res, next) {
    passport.authorize('jwt', { session: false }, (err, user) => {
      if (err) {
        req.user = null
      }

      req.user = user
      next()
    })(req, res, next)
  }
}
