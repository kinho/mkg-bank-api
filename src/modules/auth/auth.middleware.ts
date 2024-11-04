import 'dotenv/config'
import { GraphQLError } from 'graphql'
import { verify } from 'jsonwebtoken'
import { MiddlewareFn } from 'type-graphql'

import { Context } from '@modules/auth'
import { throwError } from '@modules/error/throw.error'

const { JWT_TOKEN } = process.env

export const requireAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  const authorization = context?.token

  if (!authorization) throwError('UNAUTHENTICATED')

  try {
    const token = authorization?.split(' ')[1]
    const payload: any = verify(token, `${JWT_TOKEN}`)

    context.user = payload
  } catch (err) {
    throwError('INTERNAL_ERROR')
  }

  return next()
}
