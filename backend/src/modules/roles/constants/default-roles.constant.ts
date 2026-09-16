import type { PermissionAction } from './role.constants'

export type SystemRoleSeed = {
  /** Stable identifier for code to find a system role; the record id is a generated UUID. */
  code: string
  name: string
  description: string
  fullAccess: boolean
  permissions: string[]
}

// Page slugs per module, copied from the frontend menu (frontend/src/config/navigation.ts) so the
// default permissions use the same keys the Roles & Permissions page shows.
const MODULE_PAGES: Record<string, string[]> = {
  'core-setup-and-administration': [
    'admissions-and-enrollment',
    'role-and-permission-management',
    'data-import-and-export',
    'certificate-generator',
    'front-office-management',
    'alumni-management',
    'student-promotion-and-transfer',
    'disciplinary-records',
  ],
  'academic-management': [
    'online-exams',
    'homework-and-assignments',
    'timetable-and-scheduling',
    'report-cards',
    'lesson-planning',
    'question-bank',
  ],
  'student-information': [
    'student-dashboard',
    'student-admission',
    'student-list',
    'search-by-photo',
    'parents-and-guardians',
    'student-attendance',
    'behavior-records',
    'student-houses',
    'student-categories',
    'tc-and-exit',
    'health-records',
    'deleted-students',
  ],
  'library-and-learning': ['library-management', 'virtual-library', 'study-materials-center', 'e-learning'],
  'fees-and-finance': [
    'fee-collection',
    'expense-management',
    'payroll-system',
    'tally-erp-integration',
    'scholarship-and-discounts',
    'miscellaneous-income',
    'fee-defaulter-predictor',
    'accounts-and-finance',
  ],
  communication: [
    'whatsapp-notifications',
    'sms-and-email-alerts',
    'notice-board',
    'live-chat',
    'parent-helpdesk',
    'event-calendar',
  ],
}

/** Every page of the given modules, with the given actions. */
export function grantModules(moduleSlugs: string[], actions: PermissionAction[]): string[] {
  return moduleSlugs.flatMap((module) =>
    (MODULE_PAGES[module] ?? []).flatMap((page) => actions.map((action) => `${module}.${page}:${action}`)),
  )
}

/**
 * Roles every school starts with. Inserted once each (matched by `code`); after that, schools own
 * their permissions and restarts never overwrite them.
 */
export const SYSTEM_ROLE_SEEDS: SystemRoleSeed[] = [
  {
    code: 'administrator',
    name: 'Administrator',
    description: 'Runs the school system, including settings, billing and backups.',
    fullAccess: true,
    permissions: [],
  },
  {
    code: 'teacher',
    name: 'Teacher',
    description: 'Teaches classes: exams, homework, timetables and lesson plans.',
    fullAccess: false,
    permissions: [
      ...grantModules(['academic-management'], ['view', 'create', 'edit']),
      ...grantModules(['student-information', 'library-and-learning', 'communication'], ['view']),
    ],
  },
  {
    code: 'accountant',
    name: 'Accountant',
    description: 'Collects fees, records expenses and runs payroll.',
    fullAccess: false,
    permissions: [
      ...grantModules(['fees-and-finance'], ['view', 'create', 'edit']),
      ...grantModules(['student-information'], ['view']),
    ],
  },
  {
    code: 'receptionist',
    name: 'Receptionist',
    description: 'Handles enquiries, admissions and visitors at the front office.',
    fullAccess: false,
    permissions: [
      ...grantModules(['core-setup-and-administration', 'student-information'], ['view', 'create']),
      ...grantModules(['communication'], ['view']),
    ],
  },
  {
    code: 'librarian',
    name: 'Librarian',
    description: 'Manages books, issues and returns, and the digital library.',
    fullAccess: false,
    permissions: [
      ...grantModules(['library-and-learning'], ['view', 'create', 'edit', 'delete']),
      ...grantModules(['student-information'], ['view']),
    ],
  },
]
