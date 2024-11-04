import { ParameterizedContext } from 'koa'

import { UserRoleEnum } from '@modules/user'

export interface UserPayload {
  _id: string
  name: string
  role: UserRoleEnum
  company?: string
  createdAt: Date
  email: string
}

export interface Context extends ParameterizedContext {
  user?: UserPayload
}
