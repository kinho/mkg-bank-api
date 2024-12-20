import { GraphQLError } from 'graphql'

import { ERRORS } from './error.const'

type ErrorCode = keyof typeof ERRORS

export const throwError = (code: ErrorCode): never => {
  throw new GraphQLError(ERRORS[code].message, {
    extensions: { code: ERRORS[code].code },
  })
}
