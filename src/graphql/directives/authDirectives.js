const { SchemaDirectiveVisitor } = require('apollo-server-express')
const { isAuth, isGuest, isVerified, isUnverified } = require('@app/middleware/authMiddleware')

class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const next = field.resolve
    field.resolve = async (result, args, context, info) => isAuth(next, result, args, context, info)
  }
}

class IsGuestDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const next = field.resolve
    field.resolve = async (result, args, context, info) =>
      isGuest(next, result, args, context, info)
  }
}

class IsVerifiedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const next = field.resolve
    field.resolve = async (result, args, context, info) =>
      isVerified(next, result, args, context, info)
  }
}

class isUnverifiedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const next = field.resolve
    field.resolve = async (result, args, context, info) =>
      isUnverified(next, result, args, context, info)
  }
}

module.exports = {
  isAuthenticated: IsAuthenticatedDirective,
  isGuest: IsGuestDirective,
  isVerified: IsVerifiedDirective,
  isUnverified: isUnverifiedDirective
}
