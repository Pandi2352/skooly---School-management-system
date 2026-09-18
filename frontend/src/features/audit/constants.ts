/** The event types the backend records, with the wording the page shows. Kept in step with backend/src/modules/audit/audit.constants.ts. */
export const AUDIT_ACTIONS = [
  'auth.login',
  'auth.login_failed',
  'auth.locked',
  'auth.logout',
  'auth.password_changed',
  'auth.password_reset_requested',
  'auth.password_set_from_link',
  'auth.setup_completed',
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
] as const

export type AuditAction = (typeof AUDIT_ACTIONS)[number]

/**
 * The same wording the server sends with each event. It is repeated here because the filter has to
 * name events that aren't on screen; each event still shows the label the server gave it.
 */
export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  'auth.login': 'Signed in',
  'auth.login_failed': 'Wrong password',
  'auth.locked': 'Locked after too many wrong passwords',
  'auth.logout': 'Signed out',
  'auth.password_changed': 'Changed their password',
  'auth.password_reset_requested': 'Asked for a password reset',
  'auth.password_set_from_link': 'Set a password from an emailed link',
  'auth.setup_completed': 'Created the first administrator account',
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
}

/** Grouped so the filter reads as a short list rather than eighteen similar lines. */
export const AUDIT_ACTION_GROUPS: { label: string; actions: AuditAction[] }[] = [
  {
    label: 'Signing in',
    actions: ['auth.login', 'auth.login_failed', 'auth.locked', 'auth.logout'],
  },
  {
    label: 'Passwords',
    actions: [
      'auth.password_changed',
      'auth.password_reset_requested',
      'auth.password_set_from_link',
      'user.password_reset_sent',
      'user.temporary_password_set',
    ],
  },
  {
    label: 'Accounts',
    actions: [
      'user.created',
      'user.updated',
      'user.role_changed',
      'user.suspended',
      'user.reactivated',
      'user.archived',
      'user.invitation_sent',
      'user.sessions_revoked',
      'auth.setup_completed',
    ],
  },
]

/** Events worth noticing: a failed sign-in or a lockout is the one people scan for. */
export const AUDIT_ATTENTION_ACTIONS: AuditAction[] = ['auth.login_failed', 'auth.locked']

export const AUDIT_PERIODS = ['day', 'week', 'month', 'all'] as const
export type AuditPeriod = (typeof AUDIT_PERIODS)[number]

export const AUDIT_PERIOD_LABELS: Record<AuditPeriod, string> = {
  day: 'Last 24 hours',
  week: 'Last 7 days',
  month: 'Last 30 days',
  all: 'Everything kept',
}

export const DEFAULT_AUDIT_PAGE_SIZE = 25

export const AUDIT_PERMISSIONS = {
  view: 'settings-and-billing.audit-trail:view',
} as const
