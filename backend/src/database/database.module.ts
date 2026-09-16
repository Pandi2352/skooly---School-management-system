import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { mongooseAsyncConfig } from '../config/database.config'

@Module({
  imports: [MongooseModule.forRootAsync(mongooseAsyncConfig)],
  exports: [MongooseModule],
})
export class DatabaseModule {}
