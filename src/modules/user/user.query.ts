export const UserQuery = `
  type UserResponse {
    count: Int!
    users: [User!]!
  }

  type Query {
    getUsers(
      name: String
      email: String
      role: UserRole
      limit: Int
      offset: Int
    ): UserResponse
  }
`
