import * as bcrypt from 'bcrypt'

import { UserPayload } from '@modules/auth'
import { throwError } from '@modules/error'
import {
  CreateUserArgs,
  ListUsersArgs,
  ListUsersResponse,
  UpdateUserArgs,
  User,
  UserModel,
  UserRoleEnum,
} from '@modules/user'

const SALT = 10

export const getUser = async (id: string): Promise<User | null> => {
  return UserModel.findById(id)
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return UserModel.findOne({ email })
}

export const listUsers = async ({
  name,
  email,
  role,
  company_id,
  limit,
  offset,
}: ListUsersArgs): Promise<ListUsersResponse> => {
  limit = limit || 10
  offset = offset || 0

  const options = {}
  if (name) options['name'] = { $eq: name }
  if (email) options['email'] = { $eq: email }
  if (role) options['role'] = role
  if (company_id) options['company'] = company_id.toString()

  const data = await UserModel.find(options).skip(offset).limit(limit)
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
    const user = new UserModel({
      name,
      email,
      password: await hashPassword(password),
      role: role || 'DEFAULT',
    } as User)

    return user.save()
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}

export const updateUser = async (
  { _id, name, email, password, role, company }: UpdateUserArgs,
  loggedUser?: UserPayload,
): Promise<User | null> => {
  try {
    const user = await UserModel.findById(_id)
    if (!user) return throwError('NOT_FOUND')

    if (!loggedUser || notAllowed(loggedUser, user))
      return throwError('FORBIDDEN')

    if (name) user.name = name
    if (email) user.email = email
    if (role) user.role = role
    if (company) user.company = company

    if (password) user.password = await hashPassword(password)

    return user.save()
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}

const notAllowed = (loggedUser: UserPayload, user?: User) => {
  return (
    loggedUser?.role !== UserRoleEnum.ADMIN &&
    loggedUser?._id?.toString() !== user?._id?.toString()
  )
}

const hashPassword = async (password: string): Promise<string> => {
  try {
    return bcrypt.hash(password, await bcrypt.genSalt(SALT))
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}
