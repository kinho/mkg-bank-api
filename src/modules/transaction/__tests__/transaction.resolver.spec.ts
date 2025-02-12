import { ObjectId } from 'mongodb'

import { UserPayload } from '@modules/auth'
import {
  CreateTransactionArgs,
  ListTransactionsArgs,
  Transaction,
  createTransaction,
  listTransactions,
} from '@modules/transaction'
import { TransactionResolver } from '@modules/transaction/transaction.resolver'
import { UserRoleEnum } from '@modules/user'

jest.mock('@modules/transaction/transaction.service')

const mockTransaction: Transaction = {
  _id: new ObjectId('64601311c4827118278a2d8b'),
  number: '1234567890',
  amount: 100,
  fromAccount: new ObjectId('64601311c4827118278a2d8c'),
  toAccount: new ObjectId('64601311c4827118278a2d8d'),
  createdAt: new Date(),
  createdBy: new ObjectId('64601311c4827118278a2d8e'),
}

const mockTransactions = [
  {
    _id: new ObjectId('64601311c4827118278a2d8b'),
    number: '1234567890',
    amount: 100,
    fromAccount: new ObjectId('64601311c4827118278a2d8c'),
    toAccount: new ObjectId('64601311c4827118278a2d8d'),
    createdAt: new Date(),
    createdBy: new ObjectId('64601311c4827118278a2d8e'),
  },
  {
    _id: new ObjectId('64601311c4827118278a2d8f'),
    number: '9876543210',
    amount: 50,
    fromAccount: new ObjectId('64601311c4827118278a2d8d'),
    toAccount: new ObjectId('64601311c4827118278a2d8c'),
    createdAt: new Date(),
    createdBy: new ObjectId('64601311c4827118278a2d8e'),
  },
]

const loggedUserMock: UserPayload = {
  _id: '64601311c4827118278a2d8b',
  role: UserRoleEnum.DEFAULT,
  email: 'test@test.com',
  name: 'Test User',
  createdAt: new Date(),
}

describe('TransactionResolver', () => {
  let resolver: TransactionResolver

  beforeEach(() => {
    resolver = new TransactionResolver()
    ;(listTransactions as jest.Mock).mockReset()
    ;(createTransaction as jest.Mock).mockReset()
  })

  it('should list transactions with given arguments', async () => {
    const args: ListTransactionsArgs = {
      first: 10,
    }
    ;(listTransactions as jest.Mock).mockResolvedValue({
      edges: mockTransactions.map((transaction) => ({
        node: transaction,
        cursor: transaction._id.toHexString(),
      })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: mockTransactions[0]._id.toHexString(),
        endCursor:
          mockTransactions[mockTransactions.length - 1]._id.toHexString(),
      },
      totalCount: mockTransactions.length,
    })

    const result = await resolver.listTransactions(args)
    expect(result).toEqual({
      edges: mockTransactions.map((transaction) => ({
        node: transaction,
        cursor: transaction._id.toHexString(),
      })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: mockTransactions[0]._id.toHexString(),
        endCursor:
          mockTransactions[mockTransactions.length - 1]._id.toHexString(),
      },
      totalCount: mockTransactions.length,
    })
    expect(listTransactions).toHaveBeenCalledWith(args)
  })

  it('should create a new transaction', async () => {
    const args: CreateTransactionArgs = {
      amount: 100,
      fromAccountNumber: '123456',
      toAccountNumber: '654321',
    }
    ;(createTransaction as jest.Mock).mockResolvedValue(mockTransaction)

    const result = await resolver.createTransaction(loggedUserMock, args)
    expect(result).toEqual(mockTransaction)
    expect(createTransaction).toHaveBeenCalledWith(args, loggedUserMock)
  })

  it('should return null if transaction creation fails', async () => {
    const args: CreateTransactionArgs = {
      amount: 100,
      fromAccountNumber: '123456',
      toAccountNumber: '654321',
    }
    ;(createTransaction as jest.Mock).mockResolvedValue(null)

    const result = await resolver.createTransaction(loggedUserMock, args)
    expect(result).toBeNull()
    expect(createTransaction).toHaveBeenCalledWith(args, loggedUserMock)
  })
})
