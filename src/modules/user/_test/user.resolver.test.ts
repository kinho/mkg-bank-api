import { ObjectId } from 'mongodb'

import { UserPayload } from '@modules/auth'
import {
  CreateUserArgs,
  ListUsersArgs,
  UpdateUserArgs,
  User,
  UserResolver,
  UserRoleEnum,
  createUser,
  getUser,
  listUsers,
  updateUser,
} from '@modules/user'

jest.mock('@modules/user/user.service')

const mockUser: User = {
  _id: new ObjectId('64601311c4827118278a2d8b'),
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'hashedPassword',
  createdAt: new Date(),
}

const loggedUserMock: UserPayload = {
  _id: '64601311c4827118278a2d8b',
  role: UserRoleEnum.ADMIN,
  email: 'test@test.com',
  name: 'Test User',
  createdAt: new Date(),
}

describe('UserResolver', () => {
  let resolver: UserResolver

  beforeEach(() => {
    resolver = new UserResolver()
    ;(getUser as jest.Mock).mockReset()
    ;(listUsers as jest.Mock).mockReset()
    ;(createUser as jest.Mock).mockReset()
    ;(updateUser as jest.Mock).mockReset()
  })

  it('should get a user by ID', async () => {
    ;(getUser as jest.Mock).mockResolvedValue(mockUser)
    const result = await resolver.getUser('64601311c4827118278a2d8b')
    expect(result).toEqual(mockUser)
    expect(getUser).toHaveBeenCalledWith('64601311c4827118278a2d8b')
  })

  it('should return null if user not found', async () => {
    ;(getUser as jest.Mock).mockResolvedValue(null)
    const result = await resolver.getUser('invalid-id')
    expect(result).toBeNull()
    expect(getUser).toHaveBeenCalledWith('invalid-id')
  })

  it('should list users with given arguments', async () => {
    const args: ListUsersArgs = {
      name: 'John',
      email: 'john@example.com',
      limit: 10,
      offset: 0,
    }
    ;(listUsers as jest.Mock).mockResolvedValue({
      count: 1,
      data: [mockUser],
    })
    const result = await resolver.listUsers(args)
    expect(result).toEqual({ count: 1, data: [mockUser] })
    expect(listUsers).toHaveBeenCalledWith(args)
  })

  it('should create a new user', async () => {
    const args: CreateUserArgs = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'hashedPassword',
    }
    ;(createUser as jest.Mock).mockResolvedValue(mockUser)
    const result = await resolver.createUser(args)
    expect(result).toEqual(mockUser)
    expect(createUser).toHaveBeenCalledWith(args)
  })

  it('should return null if user creation fails', async () => {
    const args: CreateUserArgs = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'hashedPassword',
    }
    ;(createUser as jest.Mock).mockResolvedValue(null)
    const result = await resolver.createUser(args)
    expect(result).toBeNull()
    expect(createUser).toHaveBeenCalledWith(args)
  })

  it('should update an existing user', async () => {
    const args: UpdateUserArgs = {
      _id: new ObjectId('64601311c4827118278a2d8b'),
      name: 'Updated Name',
    }

    ;(updateUser as jest.Mock).mockResolvedValue(mockUser)
    const result = await resolver.updateUser(
      { user: loggedUserMock } as any,
      args,
    )
    expect(result).toEqual(mockUser)
    expect(updateUser).toHaveBeenCalledWith(args, { user: loggedUserMock })
  })

  it('should return null if user update fails', async () => {
    const args: UpdateUserArgs = {
      _id: new ObjectId(),
      name: 'Updated Name',
    }

    ;(updateUser as jest.Mock).mockResolvedValue(null)
    const result = await resolver.updateUser(
      { user: loggedUserMock } as any,
      args,
    )
    expect(result).toBeNull()
    expect(updateUser).toHaveBeenCalledWith(args, { user: loggedUserMock })
  })
})
