/* eslint-disable no-console */
/**
 * File containing all user queries, mutations and subscriptions
 * @author Rafael Gonzalez <rafygonzalez089@gmail.com>
 */

const { PubSub } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto-random-string')
const moment = require('moment')
const redis = require('@app/redis')
const { userMail } = require('@app/module/auth/mail')
const { userService } = require('@app/module/auth/service')
const UserModel = require('@app/module/auth/user')
const pubsub = new PubSub()
const ACCOUNT_ADDED = 'ACCOUNT_ADDED'
/**
 * User Queries
 */
const UserQueries = {
  user: async (parent, args, context) => context.user
}
/**
 * User Mutations
 */
const UserMutation = {
  signIn: async (parent, { email, password }) => {
    try {
      const user = await UserModel.emailExist(email)
      if (!user) {
        return Promise.reject(new Error('User not found.'))
      }
      const comparePassword = await user.comparePassword(password)
      if (!comparePassword) {
        return Promise.reject(new Error('Password is incorrect.'))
      }
      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      })
      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  signUp: async (parent, { email, password }, { i18n }) => {
    try {
      let user = await UserModel.emailExist(email)
      if (user) {
        return Promise.reject(new Error('Email has already been taken.'))
      }

      const hash = bcrypt.hashSync(password, 10)
      
      user = await new UserModel({
        email,
        password: hash,
        locale: i18n.language
      }).save()

      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      })

      const token = await userService.verifyRequest(user)

      userMail.verifyRequest(user, token)

      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  logout: async (parent, args, { user, accessToken }) => {
    try {
      await redis.set(`expiredToken:${accessToken}`, user._id, 'EX', process.env.REDIS_TOKEN_EXPIRY)
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  verifyRequest: async (parent, args, { user }) => {
    try {
      const token = await userService.verifyRequest(user)
      userMail.verifyRequest(user, token)
      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  verify: async (parent, { token }) => {
    try {
      const user = await UserModel.findOne({
        'account.verification.token': token
      })
      if (!user) {
        return Promise.reject(new Error('Access Token is not valid or has expired.'))
      }

      user.set({
        account: {
          verification: {
            verified: true,
            token: null,
            expiresIn: null
          }
        }
      })

      await user.save()
      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      })
      userMail.verify(user)
      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  resetPassword: async (parent, { email }) => {
    try {
      const user = await UserModel.findOne({ email })
      if (!user) {
        return Promise.reject(new Error('User not found.'))
      }

      const token = crypto({ length: 48, type: 'url-safe' })
      const expiresIn = moment().add(7, 'days')

      user.set({
        account: {
          resetPassword: {
            token,
            expiresIn
          }
        }
      })

      await user.save()

      userMail.resetPassword(user, token)

      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  newPassword: async (parent, { token, newPassword }) => {
    try {
      const user = await UserModel.findOne({
        'account.resetPassword.token': token
      })
      if (!user) {
        return Promise.reject(new Error('Access Token is not valid or has expired.'))
      }
      const hash = bcrypt.hashSync(newPassword, 10)
      user.set({
        password: hash,
        account: {
          resetPassword: {
            token: null,
            expiresIn: null
          }
        }
      })
      await user.save()
      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      })
      return { accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  changePassword: async (parent, { currentPassword, newPassword }, { user }) => {
    try {
      const comparePassword = await user.comparePassword(currentPassword)
      if (!comparePassword) {
        return Promise.reject(new Error('Current password is incorrect.'))
      }

      const hash = bcrypt.hashSync(newPassword, 10)

      user.set({ password: hash })

      await user.save()

      return { succeed: true }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  updateUser: async (parent, { email, firstName, lastName }, { user }) => {
    try {
      let {
          account: {
            verification: { verified }
          }
        } = user,
        verifyRequest = false

      if (user.email !== email) {
        const userExist = await UserModel.findOne({ email })
        if (userExist) {
          return Promise.reject(new Error('Email has already been taken.'))
        }
        verified = false
        verifyRequest = true
      }

      user.set({
        email,
        firstName,
        lastName,
        account: {
          verification: {
            verified
          }
        }
      })

      await user.save()

      if (verifyRequest) {
        const token = await userService.verifyRequest(user)

        userMail.verifyRequest(user, token)
      }

      return user
    } catch (error) {
      return Promise.reject(error)
    }
  },
  switchLocale: async (parent, { locale }, { user }) => {
    try {
      user.set({ locale })
      await user.save()
      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
/**
 * User Subscriptions
 */
const UserSubscription = {
  userAdded: {
    subscribe: () => pubsub.asyncIterator([ACCOUNT_ADDED])
  }
}

module.exports = { UserQueries, UserMutation, UserSubscription }
