import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SchoolSettings, SchoolSettingsSchema } from './schemas/school-settings.schema'
import { SchoolSettingsController } from './school-settings.controller'
import { SchoolSettingsRepository } from './school-settings.repository'
import { SchoolSettingsService } from './school-settings.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: SchoolSettings.name, schema: SchoolSettingsSchema }])],
  controllers: [SchoolSettingsController],
  providers: [SchoolSettingsRepository, SchoolSettingsService],
  exports: [SchoolSettingsService, SchoolSettingsRepository],
})
export class SchoolSettingsModule {}
