import type { DemoCredential } from './types/auth.types'

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: 'admin',
    label: 'Administrator',
    subtitle: 'Principal / Management',
    email: 'admin@skooly.edu',
    name: 'Principal Sharma',
    avatar: 'SA',
  },
  {
    role: 'teacher',
    label: 'Academic Staff',
    subtitle: 'Senior Faculty',
    email: 'faculty@skooly.edu',
    name: 'Prof. Ramesh Rao',
    avatar: 'RR',
  },
  {
    role: 'accountant',
    label: 'Bursar & Accounts',
    subtitle: 'Finance Desk',
    email: 'accounts@skooly.edu',
    name: 'Mrs. Sunita Verma',
    avatar: 'SV',
  },
  {
    role: 'registrar',
    label: 'Front Desk',
    subtitle: 'Admissions Office',
    email: 'registrar@skooly.edu',
    name: 'Mr. Arvind Iyer',
    avatar: 'AI',
  },
]
