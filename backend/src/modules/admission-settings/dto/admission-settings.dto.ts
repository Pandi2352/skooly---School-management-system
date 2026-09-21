import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator'
import { ADMISSION_SETTINGS_LIMITS, ADMISSION_SLUG_PATTERN } from '../constants/admission-settings.constants'

const trimmed = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

export class UpdateAdmissionSettingsDto {
  @ApiPropertyOptional({ description: 'Whether the school is taking applications' })
  @IsOptional()
  @IsBoolean()
  admissionsOpen?: boolean

  @ApiPropertyOptional({ example: '2026-27', description: 'Shown on the shareable card' })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(ADMISSION_SETTINGS_LIMITS.sessionLabelMax)
  sessionLabel?: string

  @ApiPropertyOptional({
    example: 'green-valley',
    description: 'The last part of the public address. Lower case letters, numbers and dashes.',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @MinLength(ADMISSION_SETTINGS_LIMITS.slugMin, {
    message: `Use at least ${ADMISSION_SETTINGS_LIMITS.slugMin} characters.`,
  })
  @MaxLength(ADMISSION_SETTINGS_LIMITS.slugMax)
  @Matches(ADMISSION_SLUG_PATTERN, {
    message: 'Use lower case letters, numbers and dashes only, like green-valley.',
  })
  publicSlug?: string

  @ApiPropertyOptional({ description: 'Whether applying costs money' })
  @IsOptional()
  @IsBoolean()
  feeEnabled?: boolean

  @ApiPropertyOptional({ example: 100, description: 'Whole units of the school’s currency' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Enter the fee as a whole number.' })
  @Min(0)
  @Max(ADMISSION_SETTINGS_LIMITS.feeMax, {
    message: `A fee above ${ADMISSION_SETTINGS_LIMITS.feeMax} is almost certainly a mistake.`,
  })
  feeAmount?: number

  @ApiPropertyOptional({ example: 'Non-refundable', description: 'A line families read next to the fee' })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(ADMISSION_SETTINGS_LIMITS.noteMax)
  feeNote?: string
}

export class UploadedAssetDto {
  @ApiProperty({ example: 'https://api.school.in/uploads/6f1d2c3b.png' })
  url: string

  @ApiProperty({ example: 'upi-qr.png' })
  originalName: string

  @ApiProperty({ example: 48213 })
  sizeInBytes: number

  @ApiProperty({ example: '2026-09-21T12:00:00.000Z' })
  uploadedAt: string
}

export class AdmissionSettingsResponseDto {
  @ApiProperty({ example: false })
  admissionsOpen: boolean

  @ApiProperty({ example: '2026-27' })
  sessionLabel: string

  @ApiProperty({ example: 'green-valley' })
  publicSlug: string

  @ApiProperty({
    description: 'The full address families would use. Empty until a slug is set.',
    example: 'https://school.example/admission/green-valley',
  })
  publicUrl: string

  @ApiProperty({
    description:
      'The public application page isn’t built yet, so the link and its QR code are held back until it is.',
    example: false,
  })
  publicPageLive: boolean

  @ApiProperty({ example: false })
  feeEnabled: boolean

  @ApiProperty({ example: 100 })
  feeAmount: number

  @ApiProperty({ example: 'Non-refundable' })
  feeNote: string

  @ApiProperty({ type: UploadedAssetDto, nullable: true })
  paymentQr: UploadedAssetDto | null

  @ApiProperty({ example: '2026-09-21T12:00:00.000Z' })
  updatedAt: string
}
