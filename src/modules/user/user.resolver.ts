import { getUsers, createUser } from './user.service'

export const UserResolvers = {
  Query: {
    getUsers(_, params) {
      return getUsers(params)
    },
  },

  Mutation: {
    createUser(_, params) {
      return createUser(params)
    },
  },
}
