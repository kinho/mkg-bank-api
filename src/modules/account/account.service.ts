import {
  Account,
  AccountModel,
  ListAccountsArgs,
  ListAccountsResponse,
  UpdateAccountArgs,
} from '@modules/account'
import { UserPayload } from '@modules/auth'
import { throwError } from '@modules/error'
import { UserRoleEnum, getUser } from '@modules/user'
import { randomNumber } from '@modules/utils/math.tools'

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
  { number, limit, offset }: ListAccountsArgs,
  user: UserPayload,
): Promise<ListAccountsResponse> => {
  limit = limit || 10
  offset = offset || 0

  const options = {}

  if (user.role !== UserRoleEnum.ADMIN) options['owner'] = user._id

  if (number) options['number'] = { number }

  const data = await AccountModel.find(options).skip(offset).limit(limit)
  const count = await AccountModel.countDocuments(options)

  return { count, data }
}

export const createAccount = async (
  user: UserPayload,
): Promise<Account | null> => {
  const owner = await getUser(user._id)
  if (!owner) return throwError('NOT_FOUND')

  const number = `${randomNumber()}`

  const hasExist = await AccountModel.findOne({ number })
  if (hasExist) return throwError('ALREADY_EXISTS')

  try {
    const newAccount = new AccountModel({ number, owner } as Account)

    return newAccount.save()
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}

export const updateAccount = async (
  { _id, number }: UpdateAccountArgs,
  user: UserPayload,
): Promise<Account | null> => {
  const account = await AccountModel.findById(_id).populate('owner')
  if (!account) return throwError('NOT_FOUND')

  if (notAllowed(user, account)) return throwError('FORBIDDEN')

  try {
    if (number) account.number = number

    await account.save()

    return account
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
