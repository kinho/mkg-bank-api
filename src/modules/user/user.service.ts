import * as bcrypt from 'bcrypt'
import { connectionFromArraySlice } from 'graphql-relay'

import { UserPayload } from '@modules/auth'
import { throwError } from '@modules/error'
import { calculatePagination, mapToEdges } from '@modules/relay'
import {
  CreateUserArgs,
  ListUsersArgs,
  UpdateUserArgs,
  User,
  UserConnection,
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

export const listUsers = async (
  args: ListUsersArgs,
): Promise<UserConnection> => {
  const { name, email, role, company_id, first, after, last, before } = args

  const filter: Record<string, any> = {}

  if (name) filter['name'] = { $eq: name }
  if (email) filter['email'] = { $eq: email }
  if (role) filter['role'] = role
  if (company_id) filter['company'] = company_id.toString()

  const totalCount = await UserModel.countDocuments(filter)

  const { offset, limit } = calculatePagination(
    { first, last, after, before },
    totalCount,
  )

  const companies = await UserModel.find(filter).skip(offset).limit(limit)
  const edges = mapToEdges(companies, offset)

  const connection = connectionFromArraySlice(companies, args, {
    sliceStart: offset,
    arrayLength: totalCount,
  })

  return { ...connection, edges, totalCount }
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
  const user = await UserModel.findById(_id)
  if (!user) return throwError('NOT_FOUND')

  if (!loggedUser || notAllowed(loggedUser, user))
    return throwError('FORBIDDEN')

  try {
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
