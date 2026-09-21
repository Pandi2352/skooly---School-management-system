import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CustomFieldsController } from './custom-fields.controller'
import { CustomFieldsRepository } from './custom-fields.repository'
import { CustomFieldsService } from './custom-fields.service'
import { CustomField, CustomFieldSchema } from './schemas/custom-field.schema'

/** Audit is global, so nothing else needs importing here. */
@Module({
  imports: [MongooseModule.forFeature([{ name: CustomField.name, schema: CustomFieldSchema }])],
  controllers: [CustomFieldsController],
  providers: [CustomFieldsRepository, CustomFieldsService],
  // The admission module will read the active questions through the service.
  exports: [CustomFieldsService],
})
export class CustomFieldsModule {}
