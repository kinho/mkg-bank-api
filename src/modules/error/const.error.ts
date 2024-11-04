export const ERRORS = {
  UNAUTHENTICATED: {
    code: 'UNAUTHENTICATED',
    message: 'Not authenticated. Invalid or expired token.',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Email or password is incorrect.',
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'You are not allowed to perform this action.',
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found.',
  },
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    message: 'Input is not valid.',
  },
  REQUIRED_FIELD: {
    code: 'REQUIRED_FIELD',
    message: 'A required field is missing.',
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'An internal server error occurred.',
  },
} as const
