const { gql } = require('apollo-server-express')

const typeDefs = gql`
  directive @isAuthenticated on FIELD_DEFINITION
  directive @isGuest on FIELD_DEFINITION
  directive @hasRole(roles: [Role]) on OBJECT | FIELD_DEFINITION

  enum Role {
    reader
    user
    admin
  }

  type Query {
    me: User @isAuthenticated
    users: [User] @isAuthenticated @hasRole(roles: admin)
  }

  type Mutation {
    signIn(email: String!, password: String!): AccessToken! @isGuest
    signUp(email: String!, password: String!): AccessToken! @isGuest
    logout: Succeed! @isAuthenticated
    verifyRequest: Succeed!
    verify(token: String!): AccessToken!
    resetPassword(email: String!): Succeed!
    newPassword(token: String!, newPassword: String!): AccessToken!
    changePassword(currentPassword: String!, newPassword: String!): Succeed!
    updateUser(email: String!, firstName: String!, lastName: String!): User! @isAuthenticated
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
    roles: [Role]
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
