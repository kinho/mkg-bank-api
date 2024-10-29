export const UserMutation = `
  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      role: UserRole
    ): User!
  }
`
