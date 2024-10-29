import User from './user.schema'

export const getUsers = async ({
  name,
  email,
  role,
  limit,
  offset,
}) => {
  const options = {}

  if (name) options['name'] = name
  if (email) options['email'] = email
  if (role) options['role'] = role

  limit = limit || 10
  offset = offset || 0

  const users = await User.find(options)
    .skip(offset)
    .limit(limit)

  const count = await User.countDocuments(options)

  return { count, users: users || [] }
}

export const createUser = async ({ 
  name,
  email,
  password,
  role,
}) => {
  try {
    const newUser = new User({ 
      name,
      email,
      password,
      role: role || 'DEFAULT'
    })
    const createdUser = await newUser.save()
    return createdUser

  } catch (error) {
    console.error('error', error)
    return {}
  }
}
