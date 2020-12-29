const verifyAndDecodeToken = require('@app/utils/verifyAndDecodeToken')

const authMiddleware = {
  isAuth: async (resolve, result, args, context, info) => {
    await verifyAndDecodeToken(context)
    return resolve(result, args, context, info)
  },
  isGuest: async (resolve, source, args, context, info) => {
    const { user } = context
    if (user) throw new Error('You have already authorized.')
    return resolve(source, args, context, info)
  },
  isVerified: async (resolve, source, args, context, info) => {
    const {
      user: {
        account: {
          verification: { verified }
        }
      }
    } = context

    if (!verified) {
      throw new Error('You must be verified.')
    }

    return resolve(source, args, context, info)
  },

  isUnverfied: async (resolve, source, args, context, info) => {
    const {
      user: {
        account: {
          verification: { verified }
        }
      }
    } = context

    if (verified) {
      throw new Error('You have already verified.')
    }

    return resolve(source, args, context, info)
  }
}

module.exports = authMiddleware
