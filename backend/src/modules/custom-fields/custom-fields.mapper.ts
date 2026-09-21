import { CUSTOM_FIELD_LIMITS } from './constants/custom-field.constants'
import type { CustomFieldListMetaDto, CustomFieldResponseDto } from './dto/custom-field.dto'
import type { CustomFieldRecord } from './custom-fields.repository'

/** The public shape: `id` instead of `_id`, ISO dates, without the internal `labelKey`. */
export function toCustomFieldResponse(field: CustomFieldRecord): CustomFieldResponseDto {
  return {
    id: field._id,
    form: field.form,
    key: field.key,
    label: field.label,
    type: field.type,
    options: [...field.options],
    placeholder: field.placeholder,
    helpText: field.helpText,
    required: field.required,
    active: field.active,
    position: field.position,
    createdAt: new Date(field.createdAt).toISOString(),
    updatedAt: new Date(field.updatedAt).toISOString(),
  }
}

export function summarizeFields(fields: CustomFieldRecord[]): CustomFieldListMetaDto {
  return {
    total: fields.length,
    active: fields.filter((field) => field.active).length,
    required: fields.filter((field) => field.active && field.required).length,
    limit: CUSTOM_FIELD_LIMITS.fieldsPerForm,
  }
}
