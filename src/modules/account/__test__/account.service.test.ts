import { GraphQLError } from 'graphql'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, disconnect } from 'mongoose'

import {
  AccountModel,
  createAccount,
  deleteAccount,
  getAccount,
  listAccounts,
  updateAccount,
} from '@modules/account'
import { createUser } from '@modules/user'
import { UserRoleEnum } from '@modules/user/user.enum'

describe('AccountService Tests', () => {
  let mongoServer: MongoMemoryServer
  let adminUser: any
  let regularUser: any
  let account: any

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

    account = await AccountModel.create({
      number: '1234567890',
      owner: regularUser._id,
    })
  })

  afterAll(async () => {
    await disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await AccountModel.deleteMany({ _id: { $nin: [account._id] } })
  })

  it('should retrieve an account by number', async () => {
    const foundAccount = await getAccount(account.number, regularUser)

    expect(foundAccount).not.toBeNull()
    expect(foundAccount?.number).toBe(account.number)
  })

  it('should return null if account not found', async () => {
    await expect(
      getAccount('invalid-number', regularUser),
    ).rejects.toThrowError(GraphQLError)
  })

  it('should list accounts with default filters', async () => {
    const result = await listAccounts({ limit: 10, offset: 0 }, adminUser)

    expect(result).toHaveProperty('count')
    expect(result.count).toBeGreaterThanOrEqual(1)
    expect(result.data.length).toBe(1)
  })

  it('should only list accounts owned by the user if not an admin', async () => {
    const otherAccount = await AccountModel.create({
      number: '0987654321',
      owner: adminUser._id,
    })

    const result = await listAccounts({ limit: 10, offset: 0 }, regularUser)

    expect(result.count).toBe(1)
    expect(result.data[0].number).toBe(account.number)
  })

  it('should create a new account', async () => {
    const newAccount = await createAccount(regularUser)

    expect(newAccount).not.toBeNull()
    expect(newAccount).toHaveProperty('_id')
    expect(newAccount?.owner?._id?.toString()).toBe(regularUser._id.toString())
  })

  it('should throw an error when account with number already exists', async () => {
    await AccountModel.create({
      number: 'unique-number',
      owner: regularUser._id,
    })

    await expect(
      createAccount({ ...regularUser, number: 'unique-number' }),
    ).rejects.toThrowError(GraphQLError)
  })

  it('should update an account for authorized user', async () => {
    const updatedAccount = await updateAccount(
      { _id: account._id, number: '1111111111' },
      regularUser,
    )

    expect(updatedAccount).not.toBeNull()
    expect(updatedAccount?.number).toBe('1111111111')
  })

  it('should throw an error if unauthorized user tries to update account', async () => {
    await expect(
      updateAccount(
        { _id: account._id, number: '2222222222' },
        { ...adminUser, role: UserRoleEnum.DEFAULT },
      ),
    ).rejects.toThrowError(GraphQLError)
  })

  it('should delete an account for authorized user', async () => {
    const newAccount = await AccountModel.create({
      number: '3333333333',
      owner: regularUser._id,
    })

    const deletedAccount = await deleteAccount(
      newAccount._id.toString(),
      regularUser,
    )
    const foundAccount = await AccountModel.findById(newAccount._id)

    expect(deletedAccount).not.toBeNull()
    expect(foundAccount).toBeNull()
  })

  it('should throw an error if unauthorized user tries to delete account', async () => {
    const newAccount = await AccountModel.create({
      number: '4444444444',
      owner: regularUser._id,
    })

    await expect(
      deleteAccount(newAccount._id.toString(), {
        ...adminUser,
        role: UserRoleEnum.DEFAULT,
      }),
    ).rejects.toThrowError(GraphQLError)
  })
})
