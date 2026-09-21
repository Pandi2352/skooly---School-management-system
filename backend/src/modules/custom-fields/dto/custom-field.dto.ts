import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator'
import {
  CUSTOM_FIELD_FORMS,
  CUSTOM_FIELD_LIMITS,
  CUSTOM_FIELD_TYPES,
  type CustomFieldForm,
  type CustomFieldType,
} from '../constants/custom-field.constants'
import { cleanLabel } from '../utils/custom-field.util'

const trimmed = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

export class ListCustomFieldsQueryDto {
  @ApiPropertyOptional({ enum: CUSTOM_FIELD_FORMS, default: 'admission', description: 'Which form’s questions to list' })
  @IsOptional()
  @IsIn(CUSTOM_FIELD_FORMS, { message: `form must be one of: ${CUSTOM_FIELD_FORMS.join(', ')}.` })
  form: CustomFieldForm = 'admission'
}

/** Adding a question. The key is derived from the label by the server, never sent by the client. */
export class CreateCustomFieldDto {
  @ApiPropertyOptional({ enum: CUSTOM_FIELD_FORMS, default: 'admission' })
  @IsOptional()
  @IsIn(CUSTOM_FIELD_FORMS)
  form: CustomFieldForm = 'admission'

  @ApiProperty({ example: 'Birth marks', maxLength: CUSTOM_FIELD_LIMITS.labelMax })
  @Transform(({ value }) => (typeof value === 'string' ? cleanLabel(value) : value))
  @IsString()
  @MinLength(CUSTOM_FIELD_LIMITS.labelMin, { message: 'Enter what to ask, like Birth marks.' })
  @MaxLength(CUSTOM_FIELD_LIMITS.labelMax)
  label: string

  @ApiProperty({ enum: CUSTOM_FIELD_TYPES, example: 'text' })
  @IsIn(CUSTOM_FIELD_TYPES, { message: `type must be one of: ${CUSTOM_FIELD_TYPES.join(', ')}.` })
  type: CustomFieldType

  @ApiPropertyOptional({ type: [String], description: 'Dropdown choices; ignored for other types' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(CUSTOM_FIELD_LIMITS.optionsMax, {
    message: `A dropdown can hold ${CUSTOM_FIELD_LIMITS.optionsMax} choices at most.`,
  })
  @IsString({ each: true })
  @MaxLength(CUSTOM_FIELD_LIMITS.optionMax, { each: true })
  @Type(() => String)
  options?: string[]

  @ApiPropertyOptional({ example: 'e.g. scar on left hand', maxLength: CUSTOM_FIELD_LIMITS.placeholderMax })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(CUSTOM_FIELD_LIMITS.placeholderMax)
  placeholder?: string

  @ApiPropertyOptional({ example: 'Anything that helps identify the child.', maxLength: CUSTOM_FIELD_LIMITS.helpTextMax })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(CUSTOM_FIELD_LIMITS.helpTextMax)
  helpText?: string

  @ApiPropertyOptional({ default: false, description: 'The form can’t be submitted without an answer' })
  @IsOptional()
  @IsBoolean()
  required?: boolean

  @ApiPropertyOptional({ default: true, description: 'Whether the form asks it' })
  @IsOptional()
  @IsBoolean()
  active?: boolean
}

/** Editing a question. Everything except the key and the form can change. */
export class UpdateCustomFieldDto {
  @ApiPropertyOptional({ example: 'Identification marks' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? cleanLabel(value) : value))
  @IsString()
  @MinLength(CUSTOM_FIELD_LIMITS.labelMin, { message: 'Enter what to ask, like Birth marks.' })
  @MaxLength(CUSTOM_FIELD_LIMITS.labelMax)
  label?: string

  @ApiPropertyOptional({ enum: CUSTOM_FIELD_TYPES })
  @IsOptional()
  @IsIn(CUSTOM_FIELD_TYPES)
  type?: CustomFieldType

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(CUSTOM_FIELD_LIMITS.optionsMax)
  @IsString({ each: true })
  @MaxLength(CUSTOM_FIELD_LIMITS.optionMax, { each: true })
  options?: string[]

  @ApiPropertyOptional({ description: 'An empty string clears it' })
  @IsOptional()
  @ValidateIf((dto: UpdateCustomFieldDto) => dto.placeholder !== '')
  @Transform(trimmed)
  @IsString()
  @MaxLength(CUSTOM_FIELD_LIMITS.placeholderMax)
  placeholder?: string

  @ApiPropertyOptional({ description: 'An empty string clears it' })
  @IsOptional()
  @ValidateIf((dto: UpdateCustomFieldDto) => dto.helpText !== '')
  @Transform(trimmed)
  @IsString()
  @MaxLength(CUSTOM_FIELD_LIMITS.helpTextMax)
  helpText?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  required?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean
}

export class MoveCustomFieldDto {
  @ApiProperty({ enum: ['up', 'down'], description: 'One place earlier or later on the form' })
  @IsIn(['up', 'down'], { message: 'direction must be up or down.' })
  direction: 'up' | 'down'
}

export class ReorderCustomFieldsDto {
  @ApiProperty({ type: [String], format: 'uuid', description: 'Every field id on the form, in the order to ask them' })
  @IsArray()
  @ArrayMaxSize(CUSTOM_FIELD_LIMITS.fieldsPerForm)
  @IsUUID('4', { each: true, message: 'Each id must be a field id (UUID v4).' })
  ids: string[]
}

export class CustomFieldResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string

  @ApiProperty({ enum: CUSTOM_FIELD_FORMS, example: 'admission' })
  form: CustomFieldForm

  @ApiProperty({ example: 'birth_marks', description: 'Where answers are saved; fixed for the life of the field' })
  key: string

  @ApiProperty({ example: 'Birth marks' })
  label: string

  @ApiProperty({ enum: CUSTOM_FIELD_TYPES, example: 'text' })
  type: CustomFieldType

  @ApiProperty({ type: [String] })
  options: string[]

  @ApiProperty({ example: 'e.g. scar on left hand' })
  placeholder: string

  @ApiProperty({ example: '' })
  helpText: string

  @ApiProperty({ example: false })
  required: boolean

  @ApiProperty({ example: true })
  active: boolean

  @ApiProperty({ example: 0, description: 'Where it sits on the form, counting from 0' })
  position: number

  @ApiProperty({ example: '2026-09-21T12:00:00.000Z' })
  createdAt: string

  @ApiProperty({ example: '2026-09-21T12:00:00.000Z' })
  updatedAt: string
}

export class CustomFieldListMetaDto {
  @ApiProperty({ example: 6, description: 'Questions on this form' })
  total: number

  @ApiProperty({ example: 5, description: 'Questions the form actually asks' })
  active: number

  @ApiProperty({ example: 2, description: 'Questions that must be answered' })
  required: number

  @ApiProperty({ example: 60, description: 'How many questions one form can carry' })
  limit: number
}

export class DeletedCustomFieldDto {
  @ApiProperty({ format: 'uuid' })
  id: string

  @ApiProperty({ example: 'Birth marks' })
  label: string
}
