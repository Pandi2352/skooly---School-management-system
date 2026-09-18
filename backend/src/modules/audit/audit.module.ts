import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuditController } from './audit.controller'
import { AuditRepository } from './audit.repository'
import { AuditService } from './audit.service'
import { AuditEvent, AuditEventSchema } from './schemas/audit-event.schema'

/**
 * Global, because anything that touches accounts or access should be able to record it without
 * every module having to import this one first.
 */
@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: AuditEvent.name, schema: AuditEventSchema }])],
  controllers: [AuditController],
  providers: [AuditRepository, AuditService],
  exports: [AuditService],
})
export class AuditModule {}
