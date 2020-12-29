const authDirective = require('./authDirective')
const hasRoleDirective = require('./hasRoleDirective')
module.exports = {
  hasRole: hasRoleDirective,
  ...authDirective
}
