import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RolesController } from './roles.controller'
import { RolesRepository } from './roles.repository'
import { RolesService } from './roles.service'
import { Role, RoleSchema } from './schemas/role.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [RolesRepository, RolesService],
  // Other modules (e.g. staff, auth) use the service, never the repository directly.
  exports: [RolesService],
})
export class RolesModule {}
