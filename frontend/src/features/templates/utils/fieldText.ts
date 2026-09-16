import { IMAGE_FIELDS, TEXT_FIELDS } from '../constants'
import type { ImageFieldKey, RenderMode, TemplateAudience } from '../types/template.types'

const FIELD_TOKEN = /\{\{(\w+)\}\}/g

export const fieldToken = (key: string) => `{{${key}}}`

/**
 * Replaces {{field}} tokens: design mode shows "[Student Name]", preview shows the labelled
 * sample value. Unknown tokens stay exactly as typed.
 */
export function resolveFieldText(text: string, mode: RenderMode) {
  return text.replace(FIELD_TOKEN, (token: string, key: string) => {
    const field = TEXT_FIELDS.find((item) => item.key === key)
    if (!field) return token
    return mode === 'preview' ? field.sample : `[${field.label}]`
  })
}

export const imageFieldLabel = (key: ImageFieldKey) =>
  IMAGE_FIELDS.find((field) => field.key === key)?.label ?? 'Image'

const belongsTo = (group: string, audience: TemplateAudience) =>
  group === audience || group === 'person'

/** Person fields for a student or staff design (school fields are listed separately). */
export const textFieldsFor = (audience: TemplateAudience) =>
  TEXT_FIELDS.filter((field) => belongsTo(field.group, audience))

export const schoolTextFields = TEXT_FIELDS.filter((field) => field.group === 'school')

export const imageFieldsFor = (audience: TemplateAudience) =>
  IMAGE_FIELDS.filter((field) => field.group === 'school' || belongsTo(field.group, audience))
