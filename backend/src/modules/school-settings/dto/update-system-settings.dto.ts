import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'
import {
  CURRENCIES,
  DATE_FORMATS,
  RECEIPT_TEMPLATES,
  SEQUENCE_PADDINGS,
  SEQUENCE_SEPARATORS,
  SESSION_FORMATS,
  type Currency,
  type DateFormat,
  type ReceiptTemplate,
  type SequencePadding,
  type SequenceSeparator,
  type SessionFormat,
} from '../constants/school-settings.constants'

export class SequenceRuleDto {
  @ApiProperty({ description: 'Prefix letters/numbers/characters', example: 'ROLL' })
  @IsString()
  @MaxLength(12, { message: 'Use 12 characters or fewer' })
  @Matches(/^[A-Za-z0-9/_-]*$/, { message: 'Use letters, numbers, - / or _ only' })
  prefix: string

  @ApiProperty({ description: 'Separator character', enum: SEQUENCE_SEPARATORS, example: 'slash' })
  @IsEnum(SEQUENCE_SEPARATORS)
  separator: SequenceSeparator

  @ApiProperty({ description: 'Digit zero-padding width', enum: SEQUENCE_PADDINGS, example: '3' })
  @IsEnum(SEQUENCE_PADDINGS)
  padding: SequencePadding

  @ApiProperty({ description: 'Include academic session in running numbers', example: true })
  @IsBoolean()
  includeSession: boolean

  @ApiProperty({ description: 'Session format token', enum: SESSION_FORMATS, example: 'short' })
  @IsEnum(SESSION_FORMATS)
  sessionFormat: SessionFormat
}

export class DatedSequenceRuleDto extends SequenceRuleDto {
  @ApiProperty({ description: 'Include date token in running numbers', example: true })
  @IsBoolean()
  includeDate: boolean

  @ApiProperty({ description: 'Date token format', enum: DATE_FORMATS, example: 'yy' })
  @IsEnum(DATE_FORMATS)
  dateFormat: DateFormat

  @ApiProperty({ description: 'Next counter number to issue', example: 1 })
  @IsInt({ message: 'Use a whole number' })
  @Min(1, { message: 'Use 1 or higher' })
  @Max(999999, { message: 'Use 999999 or lower' })
  nextNumber: number
}

export class UpdateSystemSettingsDto {
  @ApiProperty({ description: 'Institutional school code', example: 'SIA-KA-001' })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Use 20 characters or fewer' })
  schoolCode?: string

  @ApiProperty({ description: 'Affiliating authority or board', example: 'Central Board of Secondary Education' })
  @IsString()
  @IsOptional()
  @MaxLength(60, { message: 'Use 60 characters or fewer' })
  affiliatedBy?: string

  @ApiProperty({ description: 'Operating currency', enum: CURRENCIES, example: 'INR' })
  @IsEnum(CURRENCIES, { message: 'Choose a valid currency' })
  currency: Currency

  @ApiProperty({ description: 'Receipt print template', enum: RECEIPT_TEMPLATES, example: 'standard-a4' })
  @IsEnum(RECEIPT_TEMPLATES)
  receiptTemplate: ReceiptTemplate

  @ApiProperty({ type: DatedSequenceRuleDto, description: 'Fee receipt sequence rule' })
  @ValidateNested()
  @Type(() => DatedSequenceRuleDto)
  feeReceipt: DatedSequenceRuleDto

  @ApiProperty({ type: DatedSequenceRuleDto, description: 'Admission sequence rule' })
  @ValidateNested()
  @Type(() => DatedSequenceRuleDto)
  admission: DatedSequenceRuleDto

  @ApiProperty({ type: SequenceRuleDto, description: 'Roll sequence rule' })
  @ValidateNested()
  @Type(() => SequenceRuleDto)
  roll: SequenceRuleDto
}
