import { GraphQLError } from 'graphql'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, disconnect } from 'mongoose'

import { login } from '@modules/auth'
import { User, createUser } from '@modules/user'

describe('AuthService', () => {
  let mongoServer: MongoMemoryServer
  let user: User | null

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await connect(mongoServer.getUri())
    user = await createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })
  })

  afterAll(async () => {
    await disconnect()
    await mongoServer.stop()
  })

  it('should successfully log in a user with correct credentials', async () => {
    const result = await login({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('token')

    if (result && result.user) {
      expect(result.user._id.toString()).toBe(user?._id.toString())
      expect(result.user.name).toBe(user?.name)
      expect(result.user.email).toBe(user?.email)
      expect(result.user.role).toBe(user?.role)
      expect(typeof result.token).toBe('string')
    }
  })

  it('should throw GraphQLError for a user with incorrect password', async () => {
    await expect(
      login({
        email: 'test@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrowError(GraphQLError)
  })

  it('should throw GraphQLError for a non-existent user', async () => {
    await expect(
      login({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    ).rejects.toThrowError(GraphQLError)
  })
})
