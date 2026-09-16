import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import envConfig from './config/env.config'
import { DatabaseModule } from './database/database.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath: ['.env', '.env.local'],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
