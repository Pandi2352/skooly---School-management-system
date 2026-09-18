import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Session, SessionSchema } from './session.schema'
import { SessionsRepository } from './sessions.repository'

/**
 * Sessions stand on their own because both AuthModule (sign in and out) and UsersModule (suspending
 * an account ends its sessions) need them, and neither should depend on the other.
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  providers: [SessionsRepository],
  exports: [SessionsRepository],
})
export class SessionsModule {}
