/**
 * File containing Express Configuration
 * @author Rafael Gonzalez <rafygonzalez089@gmail.com>
 */

const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
const express = require('express')
const http = require('http')
const schema = require('../graphql/schema')
// import auth from '../server/middleware/auth';
const { i18next, i18nextMiddleware } = require('@app/i18next')
const authentication = require('@app/middleware/authentication')

class Express {
  constructor() {
    this.server = new ApolloServer(schema)
  }
  init() {
    /**
     * Creating an express application
     */
    this.express = express()
    /**
     * Middlerware for using CORS
     */
    this.express.use(
      express.json(),
      express.urlencoded({ extended: false }),
      cors({
        origin: process.env.CLIENT_URL,
        optionsSuccessStatus: 200
      }),
      i18nextMiddleware.handle(i18next),
      authentication
    )
    this.server.applyMiddleware({ app: this.express })
    this.httpServer = http.createServer(this.express)
    /**
     * Installing subscription handlers
     */
    this.server.installSubscriptionHandlers(this.httpServer)
  }
}

module.exports = Express
