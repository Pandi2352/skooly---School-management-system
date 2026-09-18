import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SessionsModule } from '../auth/sessions/sessions.module'
import { TokensModule } from '../auth/tokens/tokens.module'
import { MailModule } from '../mail/mail.module'
import { RolesModule } from '../roles/roles.module'
import { User, UserSchema } from './schemas/user.schema'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

/**
 * Accounts need roles (what a person may do), sessions (suspending ends them), one-time links and
 * email. It knows nothing about AuthModule, which is what sits on top of it.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SessionsModule,
    TokensModule,
    RolesModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  // AuthModule reads accounts to sign people in; nothing else touches the repository.
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
