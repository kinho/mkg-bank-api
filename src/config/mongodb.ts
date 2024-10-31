import 'dotenv/config'
import { Mongoose, connect, disconnect } from 'mongoose'

type connectToDatabaseOption = {
  testEnv?: boolean
}

const {
  MONGODB_HOST: ENV_HOST,
  MONGODB_PORT: PORT,
  MONGODB_NAME: NAME,
  MONGODB_USER: USER,
  MONGODB_PASS: PASS,
} = process.env

class MongoDBConnection {
  private static connection: Mongoose | null = null

  public static async connect(
    option?: connectToDatabaseOption,
  ): Promise<Mongoose> {
    if (this.connection) {
      return this.connection
    }

    try {
      if (!option?.testEnv) console.info('⏳  Connecting to MongoDB...')

      const HOST = option?.testEnv ? '0.0.0.0' : ENV_HOST
      const URI = `mongodb://${USER}:${PASS}@${HOST}:${PORT}`
      this.connection = await connect(URI, {
        dbName: NAME,
        retryWrites: true,
        w: 'majority',
      })

      if (!option?.testEnv) {
        console.info(`🚀  Successfully connected to MongoDB at ${HOST}:${PORT}`)
      }

      return this.connection
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw new Error(`Error connecting to MongoDB: ${error}`)
    }
  }

  public static async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await disconnect()
      } catch (error) {
        console.error('Error disconnecting from MongoDB:', error)
        throw new Error(`Error disconnecting from MongoDB: ${error}`)
      } finally {
        this.connection = null
      }
    }
  }
}

export default MongoDBConnection
