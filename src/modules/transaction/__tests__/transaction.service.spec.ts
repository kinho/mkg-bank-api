import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, disconnect } from 'mongoose'

import { createAccount } from '@modules/account'
import {
  TransactionModel,
  calculateBalance,
  createTransaction,
  getTransaction,
  listTransactions,
} from '@modules/transaction'
import { createUser } from '@modules/user'
import { UserRoleEnum } from '@modules/user/user.enum'

describe('TransactionService Tests', () => {
  let mongoServer: MongoMemoryServer
  let user: any
  let fromAccount: any
  let toAccount: any

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await connect(mongoServer.getUri())

    user = await createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRoleEnum.DEFAULT,
    })

    fromAccount = await createAccount(user)
    toAccount = await createAccount(user)
  })

  afterAll(async () => {
    await disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await TransactionModel.deleteMany({})
  })

  it('should create a new transaction', async () => {
    const transaction = await createTransaction(
      {
        amount: 100,
        fromAccountNumber: fromAccount.number,
        toAccountNumber: toAccount.number,
      },
      user,
    )

    expect(transaction).not.toBeNull()
    expect(transaction).toHaveProperty('_id')
    expect(transaction?.amount).toBe(100)
    expect(transaction?.fromAccount.toString()).toBe(fromAccount._id.toString())
    expect(transaction?.toAccount.toString()).toBe(toAccount._id.toString())
  })

  it('should throw an error when creating a transaction with non-existing fromAccount', async () => {
    await expect(
      createTransaction(
        {
          amount: 100,
          fromAccountNumber: 'non-existing-number',
          toAccountNumber: toAccount.number,
        },
        user,
      ),
    ).rejects.toThrowError(GraphQLError)
  })

  it('should throw an error when creating a transaction with non-existing toAccount', async () => {
    await expect(
      createTransaction(
        {
          amount: 100,
          fromAccountNumber: fromAccount.number,
          toAccountNumber: 'non-existing-number',
        },
        user,
      ),
    ).rejects.toThrowError(GraphQLError)
  })

  it('should retrieve a transaction by ID', async () => {
    const transaction = await createTransaction(
      {
        amount: 50,
        fromAccountNumber: fromAccount.number,
        toAccountNumber: toAccount.number,
      },
      user,
    )

    if (!transaction) return

    const foundTransaction = await getTransaction(transaction._id.toString())

    expect(foundTransaction).not.toBeNull()
    expect(foundTransaction?._id.toString()).toBe(transaction?._id.toString())
  })

  it('should list transactions with optional filters', async () => {
    await createTransaction(
      {
        amount: 100,
        fromAccountNumber: fromAccount.number,
        toAccountNumber: toAccount.number,
      },
      user,
    )
    await createTransaction(
      {
        amount: 150,
        fromAccountNumber: toAccount.number,
        toAccountNumber: fromAccount.number,
      },
      user,
    )

    const result = await listTransactions({ first: 10 })
    expect(result).toHaveProperty('totalCount')
    expect(result.totalCount).toBe(2)
    expect(result.edges.length).toBe(2)
  })

  it('should calculate balance for an account', async () => {
    await createTransaction(
      {
        amount: 200,
        fromAccountNumber: fromAccount.number,
        toAccountNumber: toAccount.number,
      },
      user,
    )
    await createTransaction(
      {
        amount: 150,
        fromAccountNumber: toAccount.number,
        toAccountNumber: fromAccount.number,
      },
      user,
    )

    const balance = await calculateBalance(fromAccount._id)

    expect(balance).toBe(-50)
  })
})
