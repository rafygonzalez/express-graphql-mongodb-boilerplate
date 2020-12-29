const { gql } = require('apollo-server-express')

const typeDefs = gql`
  directive @isAuthenticated on FIELD_DEFINITION
  directive @isGuest on FIELD_DEFINITION

  type Query {
    user: User @isAuthenticated
  }
  type Mutation {
    signIn(email: String!, password: String!): AccessToken! @isGuest
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

module.exports = typeDefs
