/**
 * Exporting all resolvers
 * @author Rafael Gonzalez <rafygonzalez089@gmail.com>
 */

const { UserMutation, UserQueries, UserSubscription } = require('@app/module/auth')

const rootResolver = {
  Query: {
    ...UserQueries
    // Add other queries here
  },
  Mutation: {
    ...UserMutation
    // Add other mutations here
  },
  Subscription: {
    ...UserSubscription
    // Add other subscriptions here
  }
}

module.exports = rootResolver
