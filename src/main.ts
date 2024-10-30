import 'dotenv/config'
import 'reflect-metadata'
import * as http from 'http'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { koaMiddleware } from '@as-integrations/koa'
import { buildSchema } from 'type-graphql'

import { connectToDatabase } from './config/mongodb'

import { UserResolver } from './modules/user'

const { NODE_ENV, PORT: ENV_PORT } = process.env
const PORT: number = parseInt(`${ENV_PORT}`) || 4000;

(async () => {
  console.info()
  console.info('⏳ Starting server...')

  await connectToDatabase()

  const app = new Koa()
  const httpServer = http.createServer(app.callback())

  const resolvers = [UserResolver] as const

  const server = new ApolloServer({
    schema: await buildSchema({ resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(cors())
  app.use(bodyParser())

  app.use(
    koaMiddleware(server, {
      context: async ({ ctx }) => ({ token: ctx.headers?.token }),
    })
  )

  httpServer.listen(PORT, () =>
    console.info(`🚀 Server ready at http://localhost:${PORT}/graphql on ${NODE_ENV}`)
  )
})()
