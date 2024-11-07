import { ObjectId } from 'mongodb'

import {
  Account,
  AccountResponse,
  ListAccountsArgs,
  UpdateAccountArgs,
  createAccount,
  deleteAccount,
  getAccount,
  listAccounts,
  updateAccount,
} from '@modules/account'
import { AccountResolver } from '@modules/account/account.resolver'
import { UserPayload } from '@modules/auth'
import { calculateBalance } from '@modules/transaction'
import { UserRoleEnum } from '@modules/user'

jest.mock('@modules/account/account.service')
jest.mock('@modules/transaction')

const mockAccount: Account = {
  _id: new ObjectId('64601311c4827118278a2d8b'),
  number: '123456',
  createdAt: new Date(),
  owner: new ObjectId('64601311c4827118278a2d8b'),
}

const loggedUserMock: UserPayload = {
  _id: '64601311c4827118278a2d8b',
  role: UserRoleEnum.DEFAULT,
  email: 'test@test.com',
  name: 'Test User',
  createdAt: new Date(),
}

describe('AccountResolver', () => {
  let resolver: AccountResolver

  beforeEach(() => {
    resolver = new AccountResolver()
    ;(getAccount as jest.Mock).mockReset()
    ;(listAccounts as jest.Mock).mockReset()
    ;(createAccount as jest.Mock).mockReset()
    ;(updateAccount as jest.Mock).mockReset()
    ;(deleteAccount as jest.Mock).mockReset()
    ;(calculateBalance as jest.Mock).mockReset()
  })

  it('should calculate balance for an account', async () => {
    ;(calculateBalance as jest.Mock).mockResolvedValue(1000)
    const result = await resolver.amount({
      _id: mockAccount._id,
    } as AccountResponse)
    expect(result).toBe(1000)
    expect(calculateBalance).toHaveBeenCalledWith(mockAccount._id)
  })

  it('should get an account by number', async () => {
    ;(getAccount as jest.Mock).mockResolvedValue(mockAccount)
    const result = await resolver.getAccount(loggedUserMock, '123456')
    expect(result).toEqual(mockAccount)
    expect(getAccount).toHaveBeenCalledWith('123456', loggedUserMock)
  })

  it('should return null if account not found', async () => {
    ;(getAccount as jest.Mock).mockResolvedValue(null)
    const result = await resolver.getAccount(loggedUserMock, 'invalid-number')
    expect(result).toBeNull()
    expect(getAccount).toHaveBeenCalledWith('invalid-number', loggedUserMock)
  })

  it('should list accounts with given arguments', async () => {
    const args: ListAccountsArgs = {
      limit: 10,
      offset: 0,
    }
    ;(listAccounts as jest.Mock).mockResolvedValue({
      count: 1,
      data: [mockAccount],
    })
    const result = await resolver.listAccounts(loggedUserMock, args)
    expect(result).toEqual({ count: 1, data: [mockAccount] })
    expect(listAccounts).toHaveBeenCalledWith(args, loggedUserMock)
  })

  it('should create a new account', async () => {
    ;(createAccount as jest.Mock).mockResolvedValue(mockAccount)
    const result = await resolver.createAccount(loggedUserMock)
    expect(result).toEqual(mockAccount)
    expect(createAccount).toHaveBeenCalledWith(loggedUserMock)
  })

  it('should return null if account creation fails', async () => {
    ;(createAccount as jest.Mock).mockResolvedValue(null)
    const result = await resolver.createAccount(loggedUserMock)
    expect(result).toBeNull()
    expect(createAccount).toHaveBeenCalledWith(loggedUserMock)
  })

  it('should update an existing account', async () => {
    const args: UpdateAccountArgs = {
      _id: new ObjectId('64601311c4827118278a2d8b'),
      number: '654321',
    }

    ;(updateAccount as jest.Mock).mockResolvedValue(mockAccount)
    const result = await resolver.updateAccount(loggedUserMock, args)
    expect(result).toEqual(mockAccount)
    expect(updateAccount).toHaveBeenCalledWith(args, loggedUserMock)
  })

  it('should return null if account update fails', async () => {
    const args: UpdateAccountArgs = {
      _id: new ObjectId(),
      number: '654322',
    }

    ;(updateAccount as jest.Mock).mockResolvedValue(null)
    const result = await resolver.updateAccount(loggedUserMock, args)
    expect(result).toBeNull()
    expect(updateAccount).toHaveBeenCalledWith(args, loggedUserMock)
  })

  it('should delete an account by id', async () => {
    ;(deleteAccount as jest.Mock).mockResolvedValue(mockAccount)
    const result = await resolver.deleteAccount(
      loggedUserMock,
      '64601311c4827118278a2d8b',
    )
    expect(result).toEqual(mockAccount)
    expect(deleteAccount).toHaveBeenCalledWith(
      '64601311c4827118278a2d8b',
      loggedUserMock,
    )
  })

  it('should return null if account deletion fails', async () => {
    ;(deleteAccount as jest.Mock).mockResolvedValue(null)
    const result = await resolver.deleteAccount(loggedUserMock, 'invalid-id')
    expect(result).toBeNull()
    expect(deleteAccount).toHaveBeenCalledWith('invalid-id', loggedUserMock)
  })
})
