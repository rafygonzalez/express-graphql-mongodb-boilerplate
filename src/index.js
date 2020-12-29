/* eslint-disable no-console */
require('module-alias').addAlias('@app', `${__dirname}/`)

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

require('@app/service/logger')

const Express = require('./config/express')

const ExpressServer = new Express()
ExpressServer.init()
const { APP_URL, APP_PORT } = process.env
ExpressServer.httpServer.listen(APP_PORT, () => {
  console.log(`🚀 Server ready at ${APP_PORT}`)
  console.log(`🚀 Server ready at ${APP_URL}:${APP_PORT}${ExpressServer.server.graphqlPath}`)
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${APP_PORT}${ExpressServer.server.subscriptionsPath}`
  )
})
