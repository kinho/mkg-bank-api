import {
  User,
  UserModel,
  ListUsersArgs,
  ListUsersResponse,
  CreateUserArgs,
  UpdateUserArgs,
} from './'

export const getUser = async (id: string): Promise<User | null> => {
  return UserModel.findById(id)
}

export const listUsers = async ({
  name,
  email,
  role,
  company_id,
  limit,
  offset,
}: ListUsersArgs): Promise<ListUsersResponse> => {
  const options = {}

  if (name) options['name'] = name
  if (email) options['email'] = email
  if (role) options['role'] = role
  if (company_id) options['company'] = company_id.toString()

  limit = limit || 10
  offset = offset || 0

  const data = await UserModel.find(options)
    .skip(offset)
    .limit(limit)

  const count = await UserModel.countDocuments(options)

  return { count, data }
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

export const updateUser = async ({
  _id,
  name,
  email,
  password,
  role,
  company,
}: UpdateUserArgs): Promise<User | null> => {
  try {
    const user = await UserModel.findById(_id)
    if (!user) return null

    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = password
    if (role) user.role = role
    if (company) user.company = company

    await user.save()

    return user

  } catch (error) {
    console.error('updateUser error', error)
    return null
  }
}
