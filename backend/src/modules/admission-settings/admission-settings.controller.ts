import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiErrors, ApiSuccess } from '../../common/decorators/api-envelope.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { ADMISSION_SETTINGS_PERMISSIONS, PAYMENT_QR_RULE } from './constants/admission-settings.constants'
import { AdmissionSettingsResponseDto, UpdateAdmissionSettingsDto } from './dto/admission-settings.dto'
import { AdmissionSettingsService, type UploadedImageFile } from './admission-settings.service'

/** HTTP only: validation, status codes and messages. Every rule is in AdmissionSettingsService. */
@ApiTags('Admission Settings')
@Controller('admission-settings')
export class AdmissionSettingsController {
  constructor(private readonly settingsService: AdmissionSettingsService) {}

  @Get()
  @RequirePermissions(ADMISSION_SETTINGS_PERMISSIONS.view)
  @ResponseMessage('Admission settings fetched successfully.')
  @ApiOperation({
    summary: 'Get the admission settings',
    description: 'The fee, how families pay it, and the address the public application page will use.',
  })
  @ApiSuccess(AdmissionSettingsResponseDto, { description: 'The school’s admission settings' })
  @ApiErrors(HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN)
  get(): Promise<AdmissionSettingsResponseDto> {
    return this.settingsService.get()
  }

  @Patch()
  @RequirePermissions(ADMISSION_SETTINGS_PERMISSIONS.edit)
  @ResponseMessage('Admission settings saved successfully.')
  @ApiOperation({
    summary: 'Change the admission settings',
    description: 'Charging a fee needs both an amount and an uploaded QR code, or families have nowhere to pay.',
  })
  @ApiSuccess(AdmissionSettingsResponseDto, { description: 'The settings as saved' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  update(
    @Body() dto: UpdateAdmissionSettingsDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<AdmissionSettingsResponseDto> {
    return this.settingsService.update(dto, actor)
  }

  @Put('payment-qr')
  @RequirePermissions(ADMISSION_SETTINGS_PERMISSIONS.edit)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: PAYMENT_QR_RULE.maxBytes } }))
  @ResponseMessage('Payment QR code uploaded successfully.')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({
    summary: 'Upload the payment QR code',
    description:
      'A screenshot from the school’s payment app is fine. It is checked by its contents, not its name, and must be large enough to scan.',
  })
  @ApiSuccess(AdmissionSettingsResponseDto, { description: 'The settings, now with a QR code' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.PAYLOAD_TOO_LARGE)
  uploadPaymentQr(
    @UploadedFile() file: UploadedImageFile | undefined,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<AdmissionSettingsResponseDto> {
    return this.settingsService.uploadPaymentQr(file, actor)
  }

  @Delete('payment-qr')
  @RequirePermissions(ADMISSION_SETTINGS_PERMISSIONS.edit)
  @ResponseMessage('Payment QR code removed successfully.')
  @ApiOperation({
    summary: 'Remove the payment QR code',
    description: 'This also switches the fee off: a fee with no way to pay it would stop families applying.',
  })
  @ApiSuccess(AdmissionSettingsResponseDto, { description: 'The settings without a QR code' })
  @ApiErrors(HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN)
  removePaymentQr(@CurrentUser() actor?: AuthenticatedUserContext): Promise<AdmissionSettingsResponseDto> {
    return this.settingsService.removePaymentQr(actor)
  }
}
