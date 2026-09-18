import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import envConfig from './config/env.config'
import { DatabaseModule } from './database/database.module'
import { StorageModule } from './common/storage/storage.module'
import { AuditModule } from './modules/audit/audit.module'
import { AuthModule } from './modules/auth/auth.module'
import { BrandingModule } from './modules/branding/branding.module'
import { MailModule } from './modules/mail/mail.module'
import { RolesModule } from './modules/roles/roles.module'
import { UsersModule } from './modules/users/users.module'
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
    StorageModule,
    AuditModule,
    RolesModule,
    BrandingModule,
    MailModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
