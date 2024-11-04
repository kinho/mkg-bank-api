import 'dotenv/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { LoginArgs, LoginResponse } from '@modules/auth'
import { throwError } from '@modules/error'
import { User, getUserByEmail } from '@modules/user'

const { JWT_TOKEN } = process.env

export const login = async ({
  email,
  password,
}: LoginArgs): Promise<LoginResponse> => {
  try {
    const user: User | null = await getUserByEmail(email)

    if (!user) return throwError('UNAUTHORIZED')

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) return throwError('UNAUTHORIZED')

    const payload = {
      _id: user._id.toString(),
      name: user.name,
      role: user.role,
      company: user.company?.toString(),
      createdAt: user.createdAt,
      email: user.email,
    }
    const token = jwt.sign(payload, `${JWT_TOKEN}`, { expiresIn: '7d' })

    return { user, token }
  } catch (error) {
    return throwError('INTERNAL_ERROR')
  }
}
