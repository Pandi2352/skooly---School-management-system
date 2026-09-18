import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { CsrfGuard } from '../../common/guards/csrf.guard'
import { PermissionsGuard } from '../../common/guards/permissions.guard'
import { MailModule } from '../mail/mail.module'
import { RolesModule } from '../roles/roles.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthenticatedGuard } from './guards/authenticated.guard'
import { SessionGuard } from './guards/session.guard'
import { SessionRequiredGuard } from './guards/session-required.guard'
import { SessionsModule } from './sessions/sessions.module'
import { TokensModule } from './tokens/tokens.module'

/**
 * Sign-in sits on top of accounts, roles, sessions, one-time links and email.
 *
 * The app-wide guards run in this order, and every endpoint passes through all four:
 *   1. ThrottlerGuard   — too many requests from one address stop here
 *   2. CsrfGuard        — a write that another site started stops here
 *   3. SessionGuard     — reads the cookie and says who is asking (it never refuses)
 *   4. AuthenticatedGuard — a signed-in person is required unless the route is @Public()
 *   5. PermissionsGuard — their role must allow what @RequirePermissions asks for
 *
 * Closed by default is the point: a new controller that forgets its decorators is refused, not
 * quietly opened.
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
    SessionRequiredGuard,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: CsrfGuard },
    { provide: APP_GUARD, useClass: SessionGuard },
    { provide: APP_GUARD, useClass: AuthenticatedGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
