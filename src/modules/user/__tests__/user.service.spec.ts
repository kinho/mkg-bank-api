import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, disconnect } from 'mongoose'

import {
  UserModel,
  createUser,
  getUser,
  listUsers,
  updateUser,
} from '@modules/user'
import { UserRoleEnum } from '@modules/user/user.enum'

describe('UserService Tests', () => {
  let mongoServer: MongoMemoryServer
  let adminUser: any
  let regularUser: any

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await connect(mongoServer.getUri())

    adminUser = await createUser({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: UserRoleEnum.ADMIN,
    })

    regularUser = await createUser({
      name: 'Regular User',
      email: 'regular@example.com',
      password: 'password123',
    })
  })

  afterAll(async () => {
    await disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await UserModel.deleteMany({
      _id: { $nin: [adminUser._id, regularUser._id] },
    })
  })

  it('should create a new user', async () => {
    const user = await createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    expect(user).not.toBeNull()
    expect(user).toHaveProperty('_id')
    expect(user?.name).toBe('Test User')
    expect(user?.email).toBe('test@example.com')
    expect(user?.role).toBe('DEFAULT')
  })

  it('should retrieve a user by ID', async () => {
    const foundUser = await getUser(regularUser._id.toString())

    expect(foundUser).not.toBeNull()
    expect(foundUser?._id.toString()).toBe(regularUser._id.toString())
  })

  it('should return null if user not found', async () => {
    const foundUser = await getUser(new ObjectId().toString())

    expect(foundUser).toBeNull()
  })

  it('should list users with optional filters', async () => {
    const result = await listUsers({ first: 10 })
    expect(result).toHaveProperty('totalCount')
    expect(result.totalCount).toBeGreaterThanOrEqual(2)
    expect(result.edges.length).toBe(2)
  })

  it('should list users with empty filters', async () => {
    const result = await listUsers({})
    expect(result).toHaveProperty('totalCount')
    expect(result.totalCount).toBeGreaterThanOrEqual(2)
    expect(result.edges.length).toBe(2)
  })

  it('should allow admin to update any user', async () => {
    const updatedUser = await updateUser(
      { _id: regularUser._id, name: 'Updated Name 1' },
      { ...adminUser, role: UserRoleEnum.ADMIN, _id: adminUser._id.toString() },
    )

    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.name).toBe('Updated Name 1')
  })

  it('should allow user to update their own profile', async () => {
    const updatedUser = await updateUser(
      { _id: regularUser._id, name: 'Updated Name 2' },
      { ...regularUser, _id: regularUser._id.toString() },
    )

    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.name).toBe('Updated Name 2')
  })

  it('should throw an error when regular user tries to update another user', async () => {
    await expect(
      updateUser(
        { _id: adminUser._id, name: 'Updated Name 3' },
        { ...regularUser, _id: regularUser._id.toString() },
      ),
    ).rejects.toThrowError(GraphQLError)
  })

  it('should throw an error when updating a non-existing user', async () => {
    const nonExistingId = new ObjectId('507f191e810c19729de860ea')
    await expect(
      updateUser(
        { _id: nonExistingId, name: 'Non-existing User' },
        { ...adminUser, _id: adminUser._id.toString() },
      ),
    ).rejects.toThrowError(GraphQLError)
  })
})
