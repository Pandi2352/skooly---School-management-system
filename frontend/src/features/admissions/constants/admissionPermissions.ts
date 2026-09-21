/**
 * Permission keys for the admissions pipeline, matching what the Roles & Permissions page shows for
 * Admissions → Applications. The API checks the same keys on every request; these
 * exist so a control nobody may use isn't offered in the first place.
 */
export const ADMISSION_PERMISSIONS = {
  view: 'admissions.applications:view',
  create: 'admissions.applications:create',
  edit: 'admissions.applications:edit',
  delete: 'admissions.applications:delete',
} as const
