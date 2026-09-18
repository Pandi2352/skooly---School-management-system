import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { MailModule } from '../mail/mail.module'
import { RolesModule } from '../roles/roles.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthenticatedGuard } from './guards/authenticated.guard'
import { SessionGuard } from './guards/session.guard'
import { SessionsModule } from './sessions/sessions.module'
import { TokensModule } from './tokens/tokens.module'

/**
 * Sign-in sits on top of accounts, roles, sessions, one-time links and email.
 *
 * SessionGuard is registered app-wide so every request knows who is making it; it never refuses one
 * on its own. The throttler limits how often the same address can hit any endpoint, which is what
 * stops password guessing spread across many accounts.
 */
@Module({
  imports: [
    // A wide limit for ordinary use; the sign-in routes set a much tighter one of their own.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    UsersModule,
    SessionsModule,
    TokensModule,
    RolesModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthenticatedGuard,
    { provide: APP_GUARD, useClass: SessionGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
