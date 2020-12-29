const jwt = require('jsonwebtoken')
module.exports = function verifyAndDecodeToken(context) {
  const req = context
  if (!req.headers.authorization && !req.headers.Authorization) {
    throw new Error('No authorization token.')
  }
  const token = req.headers.authorization || req.headers.Authorization
  try {
    const accessToken = token.split(' ')[1]
    return jwt.verify(accessToken, process.env.JWT_SECRET)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Your token is expired')
    } else {
      throw new Error('You are not authorized')
    }
  }
}
