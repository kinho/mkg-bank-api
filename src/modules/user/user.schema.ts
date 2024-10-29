const { model, Schema } = require('mongoose')

export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'DEFAULT'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User = model('User', UserSchema)

export default User
