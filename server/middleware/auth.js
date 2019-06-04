const passport = require('passport')

module.exports = {
  async authorize (req, res, next) {
    return new Promise((resolve, reject) => {
      passport.authorize('jwt', { session: false }, (err, user) => {
        if (err) {
          return reject(err)
        }

        return resolve(user)
      })(req, res, next)
    })
  }
}
