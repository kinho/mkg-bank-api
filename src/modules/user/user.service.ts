import {
  User,
  UserModel,
  GetUsersArgs,
  CreateUserArgs,
  GetUsersResponse
} from './'

export const getUsers = async ({
  name,
  email,
  role,
  limit,
  offset,
}: GetUsersArgs): Promise<GetUsersResponse> => {
  const options = {}

  if (name) options['name'] = name
  if (email) options['email'] = email
  if (role) options['role'] = role

  limit = limit || 10
  offset = offset || 0

  const users = await UserModel.find(options)
    .skip(offset)
    .limit(limit)

  const count = await UserModel.countDocuments(options)

  return { count, users }
}

export const getUser = async (id: string): Promise<User | null> => {
  return UserModel.findById(id)
}

export const createUser = async ({
  name,
  email,
  password,
  role,
}: CreateUserArgs): Promise<User | null> => {
  try {
    const newUser = new UserModel({
      name,
      email,
      password,
      role: role || 'DEFAULT'
    } as User)
    const createdUser = await newUser.save()
    return createdUser

  } catch (error) {
    console.error('createUser error', error)
    return null
  }
}
