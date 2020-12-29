const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('@app/mongoose')

const { Schema } = mongoose

const userSchema = new Schema(
  {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    locale: String,
    roles: {
      type: Array,
      default: ['user']
    },
    account: {
      verification: {
        verified: {
          type: Boolean,
          default: false
        },
        token: String,
        expiresIn: Date
      },
      resetPassword: {
        token: String,
        expiresIn: Date
      }
    }
  },
  { timestamps: true }
)

userSchema.statics.emailExist = function (email) {
  return this.findOne({ email })
}

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateToken = function () {
  return jwt.sign({ userId: this._id, roles: this.roles }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  })
}

const User = mongoose.model('User', userSchema)

module.exports = User
