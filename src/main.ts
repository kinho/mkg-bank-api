import 'dotenv/config'
import 'reflect-metadata'
import * as http from 'http'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { koaMiddleware } from '@as-integrations/koa'
import cors from '@koa/cors'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { buildSchema } from 'type-graphql'

import MongoDBConnection from '@config/mongodb'
import { AuthResolver } from '@modules/auth'
import { Context } from '@modules/auth'
import { CompanyResolver } from '@modules/company'
import { UserResolver } from '@modules/user'

const resolvers = [UserResolver, CompanyResolver, AuthResolver] as const

const { NODE_ENV, PORT: ENV_PORT } = process.env
const PORT: number = parseInt(`${ENV_PORT}`) || 4000

;(async () => {
  console.info()
  await MongoDBConnection.connect()

  console.info('⏳  Starting server...')

  const app = new Koa()
  const httpServer = http.createServer(app.callback())

  const server = new ApolloServer({
    schema: await buildSchema({ resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error) => {
      console.error(error)
      return { message: error.message, status: error.extensions?.code }
    },
  })

  await server.start()

  app.use(cors())
  app.use(bodyParser())

  app.use(
    koaMiddleware(server, {
      context: async ({ ctx }) =>
        ({
          ...ctx,
          user: ctx.state?.user,
          token: ctx.headers?.authorization,
        }) as Context,
    }),
  )

  await httpServer.listen(PORT)

  console.info(
    `🚀  Server ready at http://localhost:${PORT}/graphql on ${NODE_ENV}`,
  )
})()
