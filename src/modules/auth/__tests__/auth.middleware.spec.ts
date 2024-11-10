import 'dotenv/config'

import jwt from 'jsonwebtoken'

import { ERRORS } from '@modules/error'

import { requireAuth } from '../auth.middleware'

const { JWT_TOKEN } = process.env

describe('AuthMiddleware', () => {
  const mockNext = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw UNAUTHENTICATED error if no authorization header is present', async () => {
    const context = {
      token: undefined,
    }

    // @ts-ignore
    await expect(requireAuth({ context }, mockNext)).rejects.toThrowError(
      ERRORS.UNAUTHENTICATED.message,
    )
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should throw UNAUTHENTICATED error if authorization header is invalid', async () => {
    const context = {
      token: 'Bearer invalid-token',
    }

    // @ts-ignore
    await expect(requireAuth({ context }, mockNext)).rejects.toThrowError(
      ERRORS.UNAUTHENTICATED.message,
    )
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should throw UNAUTHENTICATED error if token verification fails', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token')
    })

    const context = {
      token: 'Bearer some-token',
    }

    // @ts-ignore
    await expect(requireAuth({ context }, mockNext)).rejects.toThrowError(
      ERRORS.UNAUTHENTICATED.message,
    )
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should call next middleware and set user context if token is valid', async () => {
    const payload = {
      _id: 'user-id',
      name: 'Test User',
      role: 'ADMIN',
      company: 'company-id',
      createdAt: new Date(),
      email: 'test@example.com',
    }

    // @ts-ignore
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      return payload
    })

    const context = {
      token: `Bearer some-token`,
      user: { ...payload },
    }

    // @ts-ignore
    await requireAuth({ context }, mockNext)

    expect(jwt.verify).toHaveBeenCalledWith('some-token', `${JWT_TOKEN}`)
    expect(context?.user).toEqual(payload)
    expect(mockNext).toHaveBeenCalledTimes(1)
  })
})
