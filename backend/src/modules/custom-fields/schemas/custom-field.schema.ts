import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import { BaseSchema } from '../../../common/schemas/base.schema'
import {
  CUSTOM_FIELD_FORMS,
  CUSTOM_FIELD_LIMITS,
  CUSTOM_FIELD_TYPES,
  type CustomFieldForm,
  type CustomFieldType,
} from '../constants/custom-field.constants'

export type CustomFieldDocument = HydratedDocument<CustomField>

/**
 * A question a school added to one of its forms. `_id` is a UUID v4 from BaseSchema.
 *
 * `key` is the important one: every answer is stored under it, so it is derived from the first
 * label and then left alone. Renaming "Birth marks" to "Identification marks" changes what staff
 * read, never where past answers live.
 */
@Schema({ collection: 'custom_fields', timestamps: true, versionKey: false })
export class CustomField extends BaseSchema {
  @ApiProperty({ description: 'Which form asks this question', enum: CUSTOM_FIELD_FORMS, example: 'admission' })
  @Prop({ type: String, required: true, enum: CUSTOM_FIELD_FORMS, default: 'admission' })
  form: CustomFieldForm

  @ApiProperty({
    description: 'Stable name answers are saved under. Set once from the first label and never changed.',
    example: 'birth_marks',
    maxLength: CUSTOM_FIELD_LIMITS.keyMax,
  })
  @Prop({ type: String, required: true, maxlength: CUSTOM_FIELD_LIMITS.keyMax })
  key: string

  @ApiProperty({ description: 'What staff and parents read on the form', example: 'Birth marks', maxLength: CUSTOM_FIELD_LIMITS.labelMax })
  @Prop({ type: String, required: true, trim: true, maxlength: CUSTOM_FIELD_LIMITS.labelMax })
  label: string

  @ApiProperty({ description: 'Lower-cased label, so two questions can’t be asked twice (internal)', example: 'birth marks' })
  @Prop({ type: String, required: true })
  labelKey: string

  @ApiProperty({ description: 'Which control the form shows', enum: CUSTOM_FIELD_TYPES, example: 'text' })
  @Prop({ type: String, required: true, enum: CUSTOM_FIELD_TYPES })
  type: CustomFieldType

  @ApiProperty({ description: 'Choices for a dropdown; empty for every other type', type: [String], example: ['Own transport', 'School bus'] })
  @Prop({ type: [String], default: [] })
  options: string[]

  @ApiProperty({ description: 'Grey example text inside the field', example: 'e.g. scar on left hand', maxLength: CUSTOM_FIELD_LIMITS.placeholderMax })
  @Prop({ type: String, default: '', trim: true, maxlength: CUSTOM_FIELD_LIMITS.placeholderMax })
  placeholder: string

  @ApiProperty({ description: 'A line under the field explaining what to write', maxLength: CUSTOM_FIELD_LIMITS.helpTextMax })
  @Prop({ type: String, default: '', trim: true, maxlength: CUSTOM_FIELD_LIMITS.helpTextMax })
  helpText: string

  @ApiProperty({ description: 'The form can’t be submitted without an answer', example: false })
  @Prop({ type: Boolean, default: false })
  required: boolean

  @ApiProperty({
    description: 'Hidden fields stay here with their past answers but are no longer asked',
    example: true,
  })
  @Prop({ type: Boolean, default: true })
  active: boolean

  @ApiProperty({ description: 'Where it sits on the form, counting from 0', example: 0 })
  @Prop({ type: Number, required: true })
  position: number

  @ApiProperty({ description: 'Who added it', nullable: true, type: String })
  @Prop({ type: String, default: null })
  createdBy: string | null

  @ApiProperty({ description: 'Who last changed it', nullable: true, type: String })
  @Prop({ type: String, default: null })
  updatedBy: string | null
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomField)

// A key identifies answers within one form, so it must be unique there — and a unique index, not a
// pre-check, is what holds when two people add a question at the same moment.
CustomFieldSchema.index({ form: 1, key: 1 }, { unique: true, name: 'uniq_custom_field_key' })
CustomFieldSchema.index({ form: 1, labelKey: 1 }, { unique: true, name: 'uniq_custom_field_label' })
CustomFieldSchema.index({ form: 1, position: 1 }, { name: 'custom_field_order' })
