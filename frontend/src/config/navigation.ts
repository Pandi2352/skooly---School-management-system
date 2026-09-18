import { paths } from '@/app/paths'
import { slugify } from '@/lib/slugify'

export type Feature = {
  /** Full name, used as the page title. */
  label: string
  /** Short name for the sidebar and breadcrumbs. */
  shortLabel: string
  slug: string
  capabilities: string[]
  /** Set once the feature is built: the sidebar links here instead of the placeholder page. */
  route?: string
  // Set when the same feature is listed under two modules; the link opens the page in the other module.
  alias?: { module: string; feature: string }
}

/** Sidebar group heading a module is listed under. */
export type NavSection = 'Modules' | 'System'

export type Module = {
  label: string
  shortLabel: string
  slug: string
  section: NavSection
  features: Feature[]
}

// Slugs always come from the full label, so shortening a menu name never changes a URL.
const feature = (label: string, capabilities: string[] = [], shortLabel = label): Feature => ({
  label,
  shortLabel,
  slug: slugify(label),
  capabilities,
})

const alias = (label: string, moduleLabel: string, shortLabel = label): Feature => ({
  label,
  shortLabel,
  slug: slugify(label),
  capabilities: [],
  alias: { module: slugify(moduleLabel), feature: slugify(label) },
})

const builtFeature = (label: string, shortLabel: string, route: string): Feature => ({
  label,
  shortLabel,
  slug: slugify(label),
  capabilities: [],
  route,
})

const defineModule = (
  label: string,
  shortLabel: string,
  features: Feature[],
  section: NavSection = 'Modules',
): Module => ({
  label,
  shortLabel,
  slug: slugify(label),
  section,
  features,
})

export const modules: Module[] = [
  defineModule('Core Setup & Administration', 'Administration', [
    feature(
      'Admissions & Enrollment',
      ['Online Admission Forms', 'Document Uploads', 'Admission Approval Workflows'],
      'Admissions',
    ),
    builtFeature('User Accounts', 'User Accounts', paths.users),
    builtFeature('Role & Permission Management', 'Roles & Permissions', paths.settingsRoles),
    feature('Data Import & Export', ['Bulk CSV/Excel Import'], 'Import & Export'),
    feature(
      'Certificate Generator',
      ['Character Certificate Generation', 'Leaving Letter Generation'],
      'Certificates',
    ),
    feature(
      'Front Office Management',
      ['Admission Inquiry Management', 'Postal Dispatch Management', 'Call Log Management'],
      'Front Office',
    ),
    feature(
      'Alumni Management',
      ['Alumni Database', 'Alumni Networking Events', 'Alumni Donation Tracking'],
      'Alumni',
    ),
    feature(
      'Student Promotion & Transfer',
      ['Academic Session Promotion', 'Student Promotion History'],
      'Promotions',
    ),
    feature(
      'Disciplinary Records',
      ['Student Complaints', 'Behavioral Incident Tracking', 'Disciplinary Action Tracking'],
      'Discipline',
    ),
  ]),
  defineModule('Academic Management', 'Academics', [
    feature(
      'Online Exams',
      ['MCQ Exams', 'Subjective Exams', 'Descriptive Exams', 'Auto-Grading'],
      'Exams',
    ),
    feature(
      'Homework & Assignments',
      ['Assignment Submission', 'Assignment Grading', 'File Attachments'],
      'Homework',
    ),
    feature(
      'Timetable & Scheduling',
      [
        'Class Timetable',
        'Teacher Timetable',
        'Automatic Timetable Generation',
        'Timetable Conflict Detection',
      ],
      'Timetable',
    ),
    feature('Report Cards', ['Custom Report Card Templates', 'Marks & Grades', 'Student Rankings']),
    feature(
      'Lesson Planning',
      ['Topic-Wise Lesson Plans', 'Daily Lesson Plans', 'Syllabus Completion Tracking'],
      'Lesson Plans',
    ),
    feature('Question Bank', [
      'Subject-Wise Questions',
      'Difficulty-Based Question Categorization',
    ]),
  ]),
  defineModule('Student Information', 'Student Information', [
    feature('Student Dashboard', ['Student Demographics Overview', 'Enrollment Metrics']),
    builtFeature('Student Admission', 'Student Admission', paths.studentNew),
    builtFeature('Student List', 'Student List', paths.students),
    feature('Search by Photo', ['Facial Directory Index', 'Photo Search']),
    feature(
      'Parents & Guardians',
      ['Guardian Directory', 'Parent Contacts', 'Sibling Mapping'],
      'Parents & Guardians',
    ),
    feature(
      'Student Attendance',
      [
        'Daily Period Attendance',
        'Biometric Attendance Sync',
        'App-Based Attendance',
        'Absence Tracking',
      ],
      'Student Attendance',
    ),
    feature(
      'Behavior Records',
      ['Student Complaints', 'Behavioral Incident Tracking', 'Disciplinary Actions'],
      'Behavior Records',
    ),
    feature('Student Houses', ['House System Setup', 'House Points', 'Competitions']),
    feature('Student Categories', ['Category Classification', 'Quota Management']),
    feature(
      'TC & Exit',
      ['Transfer Certificate Generation', 'Leaving Records', 'Exit Clearance'],
      'TC & Exit',
    ),
    feature(
      'Health Records',
      ['Medical History', 'Immunization Charts', 'Physical Checkups'],
      'Health Records',
    ),
    feature('Deleted Students', ['Archived Student Records', 'Restore Student Data']),
  ]),
  defineModule('Library & Learning', 'Library', [
    feature(
      'Library Management',
      [
        'Book Inventory',
        'Book Issue & Return',
        'Overdue Fine Management',
        'Book Serial Number Tracking',
      ],
      'Books',
    ),
    feature(
      'Virtual Library',
      ['Digital Ebooks', 'Digital Journals', 'Video Content Access'],
      'Digital Library',
    ),
    feature(
      'Study Materials Center',
      [
        'Syllabus Upload',
        'Assignment Materials',
        'Study Document Upload',
        'Student Study Material Access',
      ],
      'Study Materials',
    ),
    feature('E-Learning', ['Live Online Classes', 'Zoom Integration', 'Google Meet Integration']),
  ]),
  defineModule('Fees & Finance', 'Finance', [
    feature('Fee Collection', [
      'Online Fee Payments',
      'Automatic Fee Receipts',
      'Fee Due Reminders',
    ]),
    feature('Expense Management', ['Expense Categories', 'Financial Reports'], 'Expenses'),
    feature(
      'Payroll System',
      ['Staff Salary Management', 'Allowances & Deductions', 'Payslip Generation'],
      'Payroll',
    ),
    feature('Tally ERP Integration', ['Fee & Expense Synchronization'], 'Tally Sync'),
    feature(
      'Scholarship & Discounts',
      ['Fee Waivers', 'Scholarship Management', 'Sibling Discounts'],
      'Scholarships',
    ),
    feature(
      'Miscellaneous Income',
      ['Event Income Tracking', 'Uniform Sales Income', 'Donation Income Tracking'],
      'Other Income',
    ),
    feature('Fee Defaulter Predictor', [], 'Defaulter Predictor'),
    feature('Accounts & Finance', [], 'Accounts'),
  ]),
  defineModule('Communication', 'Communication', [
    feature(
      'WhatsApp Notifications',
      ['Fee Reminder Notifications', 'Attendance Alerts', 'Notice Notifications'],
      'WhatsApp',
    ),
    feature(
      'SMS & Email Alerts',
      [
        'SMS Alerts',
        'Email Alerts',
        'Bulk SMS',
        'Email Campaigns',
        'Event-Triggered Notifications',
      ],
      'SMS & Email',
    ),
    feature('Notice Board', ['Digital Notice Board']),
    feature('Live Chat', ['Parent-Teacher Messaging']),
    feature('Parent Helpdesk', ['Parent Query Tickets', 'Ticket Resolution Tracking'], 'Helpdesk'),
    feature(
      'Event Calendar',
      ['School Events', 'Holiday Calendar', 'Exam Schedule Publishing', 'Parent-Teacher Meetings'],
      'Calendar',
    ),
  ]),
  defineModule('HR & Staff Management', 'HR & Staff', [
    feature(
      'Staff Management',
      ['Staff Profiles', 'Staff Qualifications', 'Staff Document Storage'],
      'Staff',
    ),
    feature(
      'Staff Leave Management',
      ['Leave Application', 'Leave Approval', 'Leave Balance Calculation'],
      'Leave',
    ),
    feature(
      'Teacher Evaluations',
      ['Anonymous Teacher Ratings', 'Parent Feedback', 'Teacher Feedback'],
      'Evaluations',
    ),
    feature(
      'Recruitment & Hiring',
      ['Job Postings', 'Applicant Resume Management', 'Interview Scheduling'],
      'Recruitment',
    ),
    alias('Staff ID Cards', 'ID Cards', 'ID Cards'),
  ]),
  defineModule('ID Cards', 'ID Cards', [
    feature('Student ID Cards', ['Barcode ID Cards', 'QR Code ID Cards']),
    feature('Staff ID Cards', ['Barcode ID Cards', 'QR Code ID Cards']),
    builtFeature('Card Designs', 'Card Designs', paths.cardDesigns),
  ]),
  defineModule('Transport Management', 'Transport', [
    feature('Bus Tracking GPS', ['Real-Time School Bus Tracking'], 'Bus Tracking'),
    feature(
      'Bus Route Management',
      ['Vehicle Route Management', 'Transport Stops', 'Driver Allocation'],
      'Routes',
    ),
    feature('Transport Fees'),
    feature('Driver Mobile App', ['Live GPS Tracking'], 'Driver App'),
    feature('Route Optimizer'),
  ]),
  defineModule('Inventory & Assets', 'Inventory', [
    feature(
      'Inventory Management',
      ['School Asset Management', 'Item Issue Tracking', 'Stock Management'],
      'Stock',
    ),
    feature(
      'Vendor Management',
      ['Supplier Management', 'Vendor Registry', 'Purchase Orders'],
      'Vendors',
    ),
    feature('Asset Management', [], 'Assets'),
  ]),
  defineModule('Hostel / Dormitory', 'Hostel', [
    feature(
      'Hostel Management',
      ['Hostel Block Management', 'Room Allocation', 'Bed Availability Tracking', 'Hostel Fees'],
      'Rooms & Beds',
    ),
    feature('Dormitory Management', [], 'Dormitories'),
  ]),
  defineModule('Mobile Apps & Portals', 'Apps & Portals', [
    feature('School Web Portal', [], 'School Portal'),
    feature(
      'Parent Student Mobile App',
      [
        'Parent Fees Access',
        'Parent Attendance Access',
        'Parent Homework Access',
        'Parent Report Card Access',
      ],
      'Parent App',
    ),
    feature(
      'Staff Mobile App',
      ['Staff Attendance Management', 'Staff Marks Entry', 'Staff Timetable Access'],
      'Staff App',
    ),
    alias('Driver Mobile App', 'Transport Management', 'Driver App'),
    feature('Real-Time Mobile Updates', [], 'Live Updates'),
    feature('Apps Center'),
  ]),
  defineModule('AI Tools', 'AI Tools', [
    feature('AI Assistant', [], 'Assistant'),
    feature('AI Timetable Builder', [], 'Timetable Builder'),
    feature('Lesson Plan Generator', [], 'Lesson Plan Writer'),
    alias('Fee Defaulter Predictor', 'Fees & Finance', 'Defaulter Predictor'),
    feature('MIS Smart Reports', [], 'MIS Reports'),
    alias('Route Optimizer', 'Transport Management'),
    feature('Admission Lead Scoring', [], 'Lead Scoring'),
    feature(
      'Student Risk Analytics',
      ['Attendance Dropout Risk', 'Academic Warning Indicators'],
      'Risk Analytics',
    ),
    feature('Smart Alert Engine', [], 'Smart Alerts'),
    feature('AI Insights', [], 'Insights'),
  ]),
  defineModule('Integrations & Technical', 'Integrations', [
    feature('REST API', ['Third-Party System Integration']),
    feature(
      'Biometric Agent',
      ['Windows Biometric Desktop Agent', 'ZKTeco ADMS Synchronization'],
      'Biometrics',
    ),
    feature('Google SSO'),
    feature('Microsoft SSO'),
    feature('Automated Cloud Database Backups', [], 'Backups'),
    feature('One-Click Database Restoration', [], 'Restore'),
    feature('Knowledge Base', ['Knowledge Base Chatbot']),
    feature('Barcode & RFID Integration', [], 'Barcode & RFID'),
    feature('AWS Cloud Storage', [], 'Cloud Storage'),
  ]),
  defineModule(
    'Settings & Billing',
    'Settings & Billing',
    // Menu items from the owner's reference. Sub-features stay empty until the owner lists them,
    // so the "Not built yet" pages don't describe features nobody has specified.
    [
      builtFeature('School Settings', 'School Settings', paths.settingsSchool),
      builtFeature('Branding', 'Branding', paths.settingsBranding),
      builtFeature('Custom Fields', 'Custom Fields', paths.settingsCustomFields),
      // Same page as Administration → Roles & Permissions; listed in both menus.
      builtFeature('Roles & Permissions', 'Roles & Permissions', paths.settingsRoles),
      feature('Payment Gateway'),
      feature('Notification Settings'),
      feature('Admission Settings'),
      feature('Admission Form Fields'),
      builtFeature('Audit Trail', 'Audit Trail', paths.settingsAuditTrail),
      feature('Subscription'),
      feature('Subscription History'),
      feature('Module Settings'),
      feature('Content Safety'),
    ],
    'System',
  ),
  // Single pages with no sub-menu: the sidebar shows them as direct links.
  defineModule('Template Gallery', 'Template Gallery', [], 'System'),
  defineModule('Backup Management', 'Backup Management', [], 'System'),
]

/** Sidebar groups, in order: school modules first, then system settings. */
export const navSections: { label: NavSection; modules: Module[] }[] = (
  ['Modules', 'System'] as const
).map((label) => ({ label, modules: modules.filter((module) => module.section === label) }))

export function findModule(slug: string) {
  return modules.find((m) => m.slug === slug)
}

export function findFeature(module: Module, slug: string) {
  return module.features.find((f) => f.slug === slug)
}

export function featurePath(module: Module, item: Feature) {
  if (item.route) return item.route
  return item.alias
    ? paths.feature(item.alias.module, item.alias.feature)
    : paths.feature(module.slug, item.slug)
}

export const pageCount = modules.reduce(
  (total, m) => total + m.features.filter((f) => !f.alias).length,
  0,
)
