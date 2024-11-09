import { connectionFromArraySlice } from 'graphql-relay'

import {
  Account,
  AccountConnection,
  AccountModel,
  ListAccountsArgs,
} from '@modules/account'
import { UserPayload } from '@modules/auth'
import { throwError } from '@modules/error'
import { calculatePagination, mapToEdges } from '@modules/relay'
import { UserRoleEnum, getUser } from '@modules/user'

export const getAccount = async (
  number: string,
  user?: UserPayload,
): Promise<Account | null> => {
  const account = await AccountModel.findOne({ number }).populate('owner')
  if (!account) return throwError('NOT_FOUND')

  if (user && notAllowed(user, account)) return throwError('FORBIDDEN')

  return account
}

export const listAccounts = async (
  args: ListAccountsArgs,
  user: UserPayload,
): Promise<AccountConnection> => {
  const { number, first, after, last, before } = args

  const filter: Record<string, any> = {}

  if (user.role !== UserRoleEnum.ADMIN) filter['owner'] = user._id

  if (number) filter['number'] = { $eq: number }

  const totalCount = await AccountModel.countDocuments(filter)

  const { offset, limit } = calculatePagination(
    { first, last, after, before },
    totalCount,
  )

  const companies = await AccountModel.find(filter).skip(offset).limit(limit)
  const edges = mapToEdges(companies, offset)

  const connection = connectionFromArraySlice(companies, args, {
    sliceStart: offset,
    arrayLength: totalCount,
  })

  return { ...connection, edges, totalCount }
}

export const createAccount = async (
  user: UserPayload,
): Promise<Account | null> => {
  const owner = await getUser(user._id)
  if (!owner) return throwError('NOT_FOUND')

  try {
    const newAccount = new AccountModel({ owner } as Account)

    return newAccount.save()
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}

export const deleteAccount = async (
  id: string,
  user: UserPayload,
): Promise<Account | null> => {
  const account = await AccountModel.findById(id)
  if (!account) return throwError('NOT_FOUND')

  if (notAllowed(user, account)) return throwError('FORBIDDEN')

  try {
    await account.deleteOne()

    return account
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}

const notAllowed = (loggedUser: UserPayload, account?: Account) =>
  loggedUser?.role !== UserRoleEnum.ADMIN &&
  loggedUser?._id?.toString() !== account?.owner?._id?.toString()
