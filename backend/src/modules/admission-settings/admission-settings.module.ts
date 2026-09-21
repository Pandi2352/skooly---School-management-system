import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AdmissionSettingsController } from './admission-settings.controller'
import { AdmissionSettingsRepository } from './admission-settings.repository'
import { AdmissionSettingsService } from './admission-settings.service'
import { AdmissionSettings, AdmissionSettingsSchema } from './schemas/admission-settings.schema'

/** Needs FILE_STORAGE for the payment QR, provided app-wide by StorageModule. */
@Module({
  imports: [MongooseModule.forFeature([{ name: AdmissionSettings.name, schema: AdmissionSettingsSchema }])],
  controllers: [AdmissionSettingsController],
  providers: [AdmissionSettingsRepository, AdmissionSettingsService],
  // The public application page will read these settings when it is built.
  exports: [AdmissionSettingsService],
})
export class AdmissionSettingsModule {}
