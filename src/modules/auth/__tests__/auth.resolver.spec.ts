import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, disconnect } from 'mongoose'

import { AuthResolver, login } from '@modules/auth'
import { createUser } from '@modules/user'

jest.mock('@modules/auth/auth.service')

describe('AuthResolver', () => {
  let mongoServer: MongoMemoryServer
  let resolver: AuthResolver
  let user: any

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await connect(mongoServer.getUri())
    resolver = new AuthResolver()
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

  it('should log in a user with correct credentials', async () => {
    ;(login as jest.Mock).mockResolvedValue({
      user,
      token: 'mocked-token',
    })

    const result = await resolver.login({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result).toEqual({
      user: expect.objectContaining({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      }) as any,
      token: 'mocked-token',
    })
  })

  it('should return null for invalid credentials', async () => {
    ;(login as jest.Mock).mockResolvedValue(null)

    const result = await resolver.login({
      email: 'test@example.com',
      password: 'wrong-password',
    })

    expect(result).toBeNull()
  })
})
