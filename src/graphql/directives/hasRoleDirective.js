const { SchemaDirectiveVisitor } = require('apollo-server-express')
const verifyAndDecodeToken = require('@app/utils/verifyAndDecodeToken')

class HasRoleDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const expectedRoles = this.args.roles
    const next = field.resolve
    field.resolve = function (result, args, context, info) {
      const decoded = verifyAndDecodeToken(context)
      const roles = decoded['roles']
      if (expectedRoles.some(role => roles.indexOf(role) !== -1))
        return next(result, args, context, info)

      throw new Error('You are not authorized for this resource')
    }
  }

  visitObject(obj) {
    const fields = obj.getFields()
    const expectedRoles = this.args.roles

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName]
      const next = field.resolve
      field.resolve = function (result, args, context, info) {
        const decoded = verifyAndDecodeToken(context)
        const roles = decoded['roles']
        if (expectedRoles.some(role => roles.indexOf(role) !== -1))
          return next(result, args, context, info)
        throw new Error('You are not authorized for this resource')
      }
    })
  }
}

module.exports = HasRoleDirective
