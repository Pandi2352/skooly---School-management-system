/**
 * Which form a question belongs to. Only the admission form has them today; the field carries the
 * form so adding another (staff, transport) needs no new collection.
 */
export const CUSTOM_FIELD_FORMS = ['admission'] as const
export type CustomFieldForm = (typeof CUSTOM_FIELD_FORMS)[number]

/** The kinds of question a school can add. Each one maps to a control on the form. */
export const CUSTOM_FIELD_TYPES = ['text', 'textarea', 'number', 'date', 'select', 'checkbox'] as const
export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number]

export const CUSTOM_FIELD_LIMITS = {
  labelMin: 1,
  labelMax: 60,
  placeholderMax: 80,
  helpTextMax: 160,
  optionMax: 60,
  /** Enough for a long list of castes or bus routes, low enough to stay a dropdown. */
  optionsMax: 50,
  /** A dropdown with one choice is a label, not a question. */
  optionsMin: 2,
  /** Far above any real admission form, low enough to keep the form usable. */
  fieldsPerForm: 60,
  keyMax: 40,
} as const

/** Letters, numbers and underscores: answers are saved under this, so it never changes. */
export const CUSTOM_FIELD_KEY_PATTERN = /^[a-z][a-z0-9_]*$/

/**
 * Permission keys for the Custom Fields page, matching what the Roles & Permissions page shows for
 * Admissions → Admission Form Fields.
 */
export const CUSTOM_FIELD_PERMISSIONS = {
  view: 'admissions.admission-form-fields:view',
  create: 'admissions.admission-form-fields:create',
  edit: 'admissions.admission-form-fields:edit',
  delete: 'admissions.admission-form-fields:delete',
} as const

/** Codes for field failures; general ones live in common/constants/error-codes.constant.ts. */
export enum CustomFieldErrorCode {
  NOT_FOUND = 'CUSTOM_FIELD_NOT_FOUND',
  LABEL_TAKEN = 'CUSTOM_FIELD_LABEL_TAKEN',
  OPTIONS_REQUIRED = 'CUSTOM_FIELD_OPTIONS_REQUIRED',
  TOO_MANY_FIELDS = 'CUSTOM_FIELD_LIMIT_REACHED',
  NO_CHANGES = 'CUSTOM_FIELD_NO_CHANGES',
  ALREADY_AT_EDGE = 'CUSTOM_FIELD_ALREADY_AT_EDGE',
}
