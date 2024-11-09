import { connectionFromArraySlice } from 'graphql-relay'
import { ObjectId } from 'mongodb'

import { getAccount } from '@modules/account'
import { UserPayload } from '@modules/auth'
import { throwError } from '@modules/error'
import { calculatePagination, mapToEdges } from '@modules/relay'
import {
  CreateTransactionArgs,
  ListTransactionsArgs,
  Transaction,
  TransactionConnection,
  TransactionModel,
} from '@modules/transaction'

export const getTransaction = async (
  id: string,
): Promise<Transaction | null> => {
  return TransactionModel.findById(id)
}

export const listTransactions = async (
  args: ListTransactionsArgs,
): Promise<TransactionConnection> => {
  const { number, first, after, last, before } = args

  const filter: Record<string, any> = {}

  if (number) filter['number'] = { $eq: number }

  const totalCount = await TransactionModel.countDocuments(filter)

  const { offset, limit } = calculatePagination(
    { first, last, after, before },
    totalCount,
  )

  const companies = await TransactionModel.find(filter)
    .skip(offset)
    .limit(limit)
  const edges = mapToEdges(companies, offset)

  const connection = connectionFromArraySlice(companies, args, {
    sliceStart: offset,
    arrayLength: totalCount,
  })

  return { ...connection, edges, totalCount }
}

export const createTransaction = async (
  { amount, fromAccountNumber, toAccountNumber }: CreateTransactionArgs,
  user: UserPayload,
): Promise<Transaction | null> => {
  const fromAccount = await getAccount(fromAccountNumber, user)
  if (!fromAccount) return throwError('NOT_FOUND')

  const toAccount = await getAccount(toAccountNumber)
  if (!toAccount) return throwError('NOT_FOUND')

  try {
    const newTransaction = new TransactionModel({
      amount,
      fromAccount: fromAccount._id,
      toAccount: toAccount._id,
      createdBy: new ObjectId(user._id),
    } as Transaction)

    return newTransaction.save()
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}

export async function calculateBalance(accountId: ObjectId): Promise<number> {
  const result = await TransactionModel.aggregate([
    {
      $match: {
        $or: [{ fromAccount: accountId }, { toAccount: accountId }],
      },
    },
    {
      $project: {
        fromAccount: 1,
        toAccount: 1,
        amount: 1,
        adjustment: {
          $cond: [
            { $eq: ['$fromAccount', accountId] },
            { $multiply: ['$amount', -1] },
            '$amount',
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        balance: { $sum: '$adjustment' },
      },
    },
  ])

  return result[0]?.balance ?? 0
}
