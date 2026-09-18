/**
 * What happened, as a stable code. The list is deliberately short and about people and access:
 * who signed in, who was let in, who was shut out, and who changed someone else's access.
 */
export const AUDIT_ACTIONS = [
  'auth.login',
  'auth.login_failed',
  'auth.locked',
  'auth.logout',
  'auth.password_changed',
  'auth.password_reset_requested',
  'auth.password_set_from_link',
  'auth.setup_completed',
  'auth.two_factor_challenged',
  'auth.two_factor_enabled',
  'auth.two_factor_disabled',
  'user.created',
  'user.updated',
  'user.role_changed',
  'user.suspended',
  'user.reactivated',
  'user.archived',
  'user.invitation_sent',
  'user.password_reset_sent',
  'user.temporary_password_set',
  'user.sessions_revoked',
  'user.two_factor_disabled',
] as const

export type AuditAction = (typeof AUDIT_ACTIONS)[number]

/** Plain wording for each event, shown as-is in the UI. */
export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  'auth.login': 'Signed in',
  'auth.login_failed': 'Wrong password',
  'auth.locked': 'Locked after too many wrong passwords',
  'auth.logout': 'Signed out',
  'auth.password_changed': 'Changed their password',
  'auth.password_reset_requested': 'Asked for a password reset',
  'auth.password_set_from_link': 'Set a password from an emailed link',
  'auth.setup_completed': 'Created the first administrator account',
  'auth.two_factor_challenged': 'Password accepted, code requested',
  'auth.two_factor_enabled': 'Turned on two-step sign-in',
  'auth.two_factor_disabled': 'Turned off two-step sign-in',
  'user.created': 'Account created',
  'user.updated': 'Details changed',
  'user.role_changed': 'Role changed',
  'user.suspended': 'Account suspended',
  'user.reactivated': 'Account switched back on',
  'user.archived': 'Account archived',
  'user.invitation_sent': 'Invitation sent',
  'user.password_reset_sent': 'Password reset link sent',
  'user.temporary_password_set': 'Temporary password set',
  'user.sessions_revoked': 'Signed out of every device',
  'user.two_factor_disabled': 'Two-step sign-in switched off by an administrator',
}

/** Permission key for reading the trail: Settings & Billing → Audit Trail in the menu. */
export const AUDIT_PERMISSIONS = {
  view: 'settings-and-billing.audit-trail:view',
} as const

/** How long events are kept. Long enough to investigate, short enough not to hoard personal data. */
export const AUDIT_RETENTION_DAYS = 400
