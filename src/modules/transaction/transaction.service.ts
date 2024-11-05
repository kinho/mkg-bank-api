import { ObjectId } from 'mongodb'
import { Types } from 'mongoose'

import { getAccount } from '@modules/account'
import { UserPayload } from '@modules/auth'
import { throwError } from '@modules/error'
import {
  CreateTransactionArgs,
  ListTransactionsArgs,
  ListTransactionsResponse,
  Transaction,
  TransactionModel,
} from '@modules/transaction'
import { randomNumber } from '@modules/utils/math.tools'

export const getTransaction = async (
  id: string,
): Promise<Transaction | null> => {
  return TransactionModel.findById(id)
}

export const listTransactions = async ({
  number,
  limit,
  offset,
}: ListTransactionsArgs): Promise<ListTransactionsResponse> => {
  limit = limit || 10
  offset = offset || 0

  const options = {}
  if (number) options['number'] = { number }

  const data = await TransactionModel.find(options).skip(offset).limit(limit)
  const count = await TransactionModel.countDocuments(options)

  return { count, data }
}

export const createTransaction = async (
  { amount, fromAccountNumber, toAccountNumber }: CreateTransactionArgs,
  user: UserPayload,
): Promise<Transaction | null> => {
  try {
    const fromAccount = await getAccount(fromAccountNumber, user)
    if (!fromAccount) return throwError('NOT_FOUND')

    const toAccount = await getAccount(toAccountNumber, user)
    if (!toAccount) return throwError('NOT_FOUND')

    const number = `${randomNumber()}`

    const hasExist = await TransactionModel.findOne({ number })
    if (hasExist) return throwError('ALREADY_EXISTS')

    const newTransaction = new TransactionModel({
      number,
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

export async function calculateBalance(accountNumber: string): Promise<number> {
  const account = await getAccount(accountNumber)
  if (!account?._id) throw new Error('NOT_FOUND')

  const accountId = new Types.ObjectId(account._id)

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
