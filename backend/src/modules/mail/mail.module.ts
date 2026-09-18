import { Module } from '@nestjs/common'
import { BrandingModule } from '../branding/branding.module'
import { MailService } from './mail.service'

/** Emails are branded with the school's name, so this needs BrandingService. */
@Module({
  imports: [BrandingModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
