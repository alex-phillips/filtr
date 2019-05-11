const mmmagic = require('mmmagic')
const Magic = require('mmmagic').Magic

class Utils {
  static async getMIMEType (file) {
    return new Promise((resolve, reject) => {
      let detector = new Magic(mmmagic.MAGIC_MIME_TYPE)
      detector.detectFile(file, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  }
}

module.exports = Utils
