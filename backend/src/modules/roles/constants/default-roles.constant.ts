export type SeedRole = {
  _id: string
  name: string
  description: string
  kind: 'system' | 'custom'
  fullAccess: boolean
  permissions: string[]
}

export const DEFAULT_SYSTEM_ROLES: SeedRole[] = [
  {
    _id: 'administrator',
    name: 'Administrator',
    description: 'Runs the school system, including settings, billing and backups.',
    kind: 'system',
    fullAccess: true,
    permissions: [],
  },
  {
    _id: 'teacher',
    name: 'Teacher',
    description: 'Teaches classes: exams, homework, timetables and lesson plans.',
    kind: 'system',
    fullAccess: false,
    permissions: [
      'academic-management:view',
      'academic-management:create',
      'academic-management:edit',
      'student-information:view',
      'library-and-learning:view',
      'communication:view',
    ],
  },
  {
    _id: 'accountant',
    name: 'Accountant',
    description: 'Collects fees, records expenses and runs payroll.',
    kind: 'system',
    fullAccess: false,
    permissions: [
      'fees-and-finance:view',
      'fees-and-finance:create',
      'fees-and-finance:edit',
      'student-information:view',
    ],
  },
  {
    _id: 'receptionist',
    name: 'Receptionist',
    description: 'Handles enquiries, admissions and visitors at the front office.',
    kind: 'system',
    fullAccess: false,
    permissions: [
      'core-setup-and-administration:view',
      'core-setup-and-administration:create',
      'student-information:view',
      'student-information:create',
      'communication:view',
    ],
  },
  {
    _id: 'librarian',
    name: 'Librarian',
    description: 'Manages books, issues and returns, and the digital library.',
    kind: 'system',
    fullAccess: false,
    permissions: [
      'library-and-learning:view',
      'library-and-learning:create',
      'library-and-learning:edit',
      'library-and-learning:delete',
      'student-information:view',
    ],
  },
]
