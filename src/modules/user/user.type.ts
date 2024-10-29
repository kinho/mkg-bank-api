export const User = `
  scalar Date

  enum UserRole {
    ADMIN
    DEFAULT
  }

  type User {
    _id: String!
    name: String!
    email: String!
    password: String!
    role: UserRole!
    createdAt: Date!
  }
`
