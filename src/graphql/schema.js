/* eslint-disable no-console */
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const schemaDirectives = require('./directives')

const schema = {
  context: async ({ req }) => {
    return {
      user: req.user,
      headers: req.headers,
      accessToken: req.accessToken,
      i18n: req.i18n
    }
  },
  schemaDirectives,
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
}

module.exports = schema
