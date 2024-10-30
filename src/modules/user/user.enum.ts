import { registerEnumType } from 'type-graphql'

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  DEFAULT = 'DEFAULT',
}

registerEnumType(UserRoleEnum, {
  name: 'UserRoleEnum',
  description: 'Roles of the user',
})
