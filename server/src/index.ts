/* eslint-disable no-path-concat */
import 'reflect-metadata'

import { JWT_SECRET_KEY, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } from 'config/secretkey'
import sequelize, { initDatabase } from './database/database'

import { ApolloServer } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import User from './database/user'
import { accountIdFromToken } from './middlewares/auth/token'
import cors from 'cors'
import { createServer } from 'http'
import express from 'express'
import { findUser } from './userCache'
import { getSchema } from './schema'
import { initApis } from './express'
import { initAwsS3 } from './middlewares/s3'
import publicConfig from 'config/storageConfig.public'
import { setJwtSecretKey } from './middlewares/auth'
import { whitelist } from 'config/serverenv'

const { execute, subscribe } = require('graphql')

async function main() {
  console.log('connect aws..')
  initAwsS3(publicConfig.s3, {
    S3_SECRET_ACCESS_KEY,
    S3_ACCESS_KEY_ID,
  })
  setJwtSecretKey(JWT_SECRET_KEY)

  await initDatabase()
  const app = express()
  const pubsub = new PubSub()
  const port = process.env.PORT || 3030

  const schema = await getSchema()
  const server = new ApolloServer({
    schema,
    context: async ({ req }: any) => {
      const token: any = req?.headers?.token
      const user = await findUser(token)
      return {
        db: sequelize,
        token,
        userId: user?.id,
        user,
        pubsub,
      }
    },
    subscriptions: {
      path: '/subscription',
      onConnect: async (connectionParams: any, socket: any, context: any) => {
        const { token } = connectionParams
        const user = await findUser(token)
        socket.accountId = user?.accountId
        console.log('subscription connected', { user: user?.accountId })
      },
      onDisconnect: async (socket: any, context: any) => {
        try {
          console.log('disconnect', { accountId: socket.accountId })
        } catch (err) {
          throw err
        }
      },
    },
    // plugins: [{
    //   async serverWillStart() {
    //     return {
    //       async drainServer() {
    //         subscriptionServer.close()
    //       },
    //     }
    //   },
    // }],
  })

  await server.start()
  server.applyMiddleware({ app })

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
  })

  const corsOptions = {
    origin: (origin: any, callback: any) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(null, true)
      }
    },
  }
  app.use(cors(corsOptions))

  const httpServer = createServer(app)
  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: '/subscription' },
  )

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
  })

  httpServer.listen(port, () => {
    console.log('server startd on localhost:3000')
  })

  initApis(app)
}

console.log('start')

main().catch((err) => {
  console.error(err)
})
