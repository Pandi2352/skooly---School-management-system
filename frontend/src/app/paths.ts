// Every URL in the app. Links use these, never hand-typed strings.
export const paths = {
  root: '/',
  login: '/login',
  /** First run only: creates the school's first administrator when no account exists yet. */
  setup: '/setup',
  forgotPassword: '/forgot-password',
  /** Opened from an invitation email. */
  setPassword: '/set-password',
  /** Opened from a password reset email. */
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  navigator: '/navigator',
  contactSupport: '/contact-support',
  students: '/students',
  studentNew: '/students/new',
  student: (studentId: string) => `/students/${studentId}`,
  studentEdit: (studentId: string) => `/students/${studentId}/edit`,
  // Staff logins: who can sign in, with which role.
  users: '/users',
  user: (userId: string) => `/users/${userId}`,
  /** The signed-in person's own account. */
  account: '/account',
  accountPassword: '/account/password',
  settings: '/settings',
  settingsGeneral: '/settings/general',
  settingsSchool: '/settings/school',
  settingsBranding: '/settings/school?tab=branding',
  settingsCustomFields: '/settings/custom-fields',
  settingsRoles: '/settings/roles',
  settingsAuditTrail: '/settings/audit-trail',
  // Matches the navigation slug of "Backup Management", so the sidebar link lands here.
  backups: '/backup-management',
  templateGallery: '/template-gallery',
  /** Opens a saved or starter design; with no id, a blank ID card. */
  canvasDesigner: (templateId?: string) =>
    templateId === undefined
      ? '/template-gallery/designer'
      : `/template-gallery/designer?template=${encodeURIComponent(templateId)}`,
  canvasDesignerBlank: (sizeId: string) =>
    `/template-gallery/designer?size=${encodeURIComponent(sizeId)}`,
  cardDesigns: '/id-cards/card-designs',
  module: (moduleSlug: string) => `/${moduleSlug}`,
  feature: (moduleSlug: string, featureSlug: string) => `/${moduleSlug}/${featureSlug}`,
} as const
