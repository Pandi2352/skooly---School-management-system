import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { BrandingController } from './branding.controller'
import { BrandingRepository } from './branding.repository'
import { BrandingService } from './branding.service'
import { Branding, BrandingSchema } from './schemas/branding.schema'

/** Needs FILE_STORAGE, provided app-wide by StorageModule. */
@Module({
  imports: [MongooseModule.forFeature([{ name: Branding.name, schema: BrandingSchema }])],
  controllers: [BrandingController],
  providers: [BrandingRepository, BrandingService],
  // Documents, ID cards and emails will read branding through the service.
  exports: [BrandingService],
})
export class BrandingModule {}
