import 'dotenv/config'
import { Mongoose, connect } from 'mongoose'

const {
  MONGODB_HOST: HOST,
  MONGODB_PORT: PORT,
  MONGODB_NAME: NAME,
  MONGODB_USER: USER,
  MONGODB_PASS: PASS,
} = process.env

class MongoDBConnection {
  private static connection: Mongoose | null = null

  public static async connect(): Promise<Mongoose> {
    if (this.connection) return this.connection

    try {
      console.info('⏳  Connecting to MongoDB...')

      const URI: string = `mongodb://${USER}:${PASS}@${HOST}:${PORT}`
      this.connection = await connect(URI, { dbName: NAME })

      console.info(`🚀  Successfully connected to MongoDB at ${HOST}:${PORT}`)

      return this.connection
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw new Error(`Error connecting to MongoDB: ${error}`)
    }
  }

  public static async disconnect(): Promise<void> {
    if (!this.connection) return

    try {
      await this.connection?.disconnect()
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error)
      throw new Error(`Error disconnecting from MongoDB: ${error}`)
    } finally {
      this.connection = null
    }
  }
}

export default MongoDBConnection
