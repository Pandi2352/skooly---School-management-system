// Public API for other features: they import from here, never from customFields' folders
// (BLUEPRINT.md, dependency rules).
export { useActiveCustomFields, useCustomFields } from './hooks/useCustomFields'
export { pickCustomValues, validateCustomValues } from './utils/customFields'
export { CUSTOM_FIELD_PERMISSIONS } from './constants'
export type { CustomField, CustomValues } from './types/customField.types'
