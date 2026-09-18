import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserToken, UserTokenSchema } from './user-token.schema'
import { UserTokensRepository } from './user-tokens.repository'

/** Shared by UsersModule (sends invitations) and AuthModule (accepts the links). */
@Module({
  imports: [MongooseModule.forFeature([{ name: UserToken.name, schema: UserTokenSchema }])],
  providers: [UserTokensRepository],
  exports: [UserTokensRepository],
})
export class TokensModule {}
