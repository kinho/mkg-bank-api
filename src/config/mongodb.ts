import 'dotenv/config'
import { connect } from 'mongoose'

const {
  MONGODB_HOST: HOST,
  MONGODB_PORT: PORT,
  MONGODB_NAME: NAME,
  MONGODB_USER: USER,
  MONGODB_PASS: PASS,
} = process.env

export async function connectToDatabase() {
  try {
    console.info('⏳ Connecting to MongoDB...')

    const URI = `mongodb://${USER}:${PASS}@${HOST}:${PORT}`
    await connect(URI, { dbName: NAME, retryWrites: true, w: 'majority' })

    console.info(`🚀 Successfully connected to MongoDB at ${HOST}:${PORT}`)

  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw new Error(`Error connecting to MongoDB: ${error}`)
  }
}
