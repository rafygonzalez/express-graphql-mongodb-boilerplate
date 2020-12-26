/* eslint-disable no-console */
const { gql } = require('apollo-server-express')
const resolvers = require('./resolvers')

const typeDefs = gql`
  type Query {
    user: User!
  }
  type Mutation {
    signIn(email: String!, password: String!): AccessToken!
    signUp(email: String!, password: String!): AccessToken!
    logout: Succeed!
    verifyRequest: Succeed!
    verify(token: String!): AccessToken!
    resetPassword(email: String!): Succeed!
    newPassword(token: String!, newPassword: String!): AccessToken!
    changePassword(currentPassword: String!, newPassword: String!): Succeed!
    updateUser(email: String!, firstName: String!, lastName: String!): User!
    switchLocale(locale: Locale!): User!
  }
  type Subscription {
    userAdded: User
  }
  type User {
    email: String
    password: String
    firstName: String
    lastName: String
    locale: String
  }
  type AccessToken {
    accessToken: String!
  }
  type Succeed {
    succeed: Boolean!
  }
  enum Locale {
    en
    ge
  }
`

const schema = {
  typeDefs,
  resolvers,
  introspection: true,
  context: async ({ req, connection, payload }) => {
    if (connection) {
      return { isAuth: payload.accessToken }
    }
    return { isAuth: req.accessToken }
  },
  playground: true
}

module.exports = schema
