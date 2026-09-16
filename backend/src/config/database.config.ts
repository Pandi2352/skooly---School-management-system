import { ConfigService } from '@nestjs/config'
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose'
import { Logger } from '@nestjs/common'

const logger = new Logger('DatabaseConfig')

/**
 * Returns asynchronous Mongoose connection options configured from ConfigService.
 */
export const mongooseAsyncConfig: MongooseModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const uri = configService.get<string>('app.mongodbUri') || 'mongodb://127.0.0.1:27017/skooly_erp'
    const dbName = configService.get<string>('app.mongodbDbName') || 'skooly_erp'

    logger.log(`Connecting to MongoDB at: ${uri} (db: ${dbName})`)

    return {
      uri,
      dbName,
      autoIndex: process.env.NODE_ENV !== 'production',
    }
  },
}
