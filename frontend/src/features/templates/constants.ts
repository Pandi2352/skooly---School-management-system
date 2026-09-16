export const TEMPLATE_CATEGORIES = [
  'id-card',
  'certificate',
  'fee-receipt',
  'admit-card',
  'general',
] as const

export const TEMPLATE_CATEGORY_LABELS = {
  'id-card': 'ID Card',
  certificate: 'Certificate',
  'fee-receipt': 'Fee Receipt',
  'admit-card': 'Admit Card',
  general: 'General',
} as const satisfies Record<(typeof TEMPLATE_CATEGORIES)[number], string>

export const TEMPLATE_AUDIENCES = ['student', 'staff'] as const

export const AUDIENCE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'staff', label: 'Staff' },
]

/** Starter templates ship with the app and are never overwritten; saving one creates a custom copy. */
export const TEMPLATE_SOURCES = ['starter', 'custom'] as const

export const SIZE_IDS = [
  'cr80-portrait',
  'cr80-landscape',
  'a4-portrait',
  'a4-landscape',
  'a5-landscape',
  'custom',
] as const

export const CARD_SIZES = [
  { id: 'cr80-portrait', label: 'CR80 Portrait — 54 × 85.6', widthMm: 54, heightMm: 85.6 },
  { id: 'cr80-landscape', label: 'CR80 Landscape — 85.6 × 54', widthMm: 85.6, heightMm: 54 },
  { id: 'a4-portrait', label: 'A4 Portrait — 210 × 297', widthMm: 210, heightMm: 297 },
  { id: 'a4-landscape', label: 'A4 Landscape — 297 × 210', widthMm: 297, heightMm: 210 },
  { id: 'a5-landscape', label: 'A5 Landscape — 210 × 148', widthMm: 210, heightMm: 148 },
] as const satisfies readonly {
  id: Exclude<(typeof SIZE_IDS)[number], 'custom'>
  label: string
  widthMm: number
  heightMm: number
}[]

export const CARD_SIDES = ['front', 'back'] as const

export const FONT_FAMILIES = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
] as const
export const FONT_STYLES = ['normal', 'bold', 'italic', 'bold italic'] as const
export const TEXT_ALIGNS = ['left', 'center', 'right'] as const
export const TEXT_LINE_HEIGHT = 1.2

/**
 * Fields a design can show. Text fields go into text as {{key}} tokens.
 * `sample` values are labelled placeholders for Preview, not real people (antislop R-38).
 * `group`: student or staff only, `person` for both, `school` for the school's own details.
 */
export const TEXT_FIELDS = [
  { key: 'studentName', label: 'Student Name', sample: 'Sample Student', group: 'student' },
  { key: 'admissionNo', label: 'Admission No.', sample: 'ADM-0001', group: 'student' },
  { key: 'rollNo', label: 'Roll No.', sample: 'ROLL-01', group: 'student' },
  { key: 'classSection', label: 'Class & Section', sample: 'Class X - A', group: 'student' },
  { key: 'dateOfBirth', label: 'Date of Birth', sample: 'dd-mm-yyyy', group: 'student' },
  {
    key: 'fatherName',
    label: 'Father / Guardian Name',
    sample: 'Sample Guardian',
    group: 'student',
  },
  { key: 'house', label: 'House', sample: 'Sample House', group: 'student' },
  {
    key: 'classTeacherName',
    label: 'Class Teacher Name',
    sample: 'Sample Teacher',
    group: 'student',
  },
  { key: 'staffName', label: 'Staff Name', sample: 'Sample Staff', group: 'staff' },
  { key: 'employeeId', label: 'Employee ID', sample: 'EMP-0001', group: 'staff' },
  { key: 'designation', label: 'Designation', sample: 'Designation', group: 'staff' },
  { key: 'department', label: 'Department', sample: 'Department', group: 'staff' },
  { key: 'dateOfJoining', label: 'Date of Joining', sample: 'dd-mm-yyyy', group: 'staff' },
  { key: 'bloodGroup', label: 'Blood Group', sample: 'O+', group: 'person' },
  { key: 'phone', label: 'Phone', sample: '+91 00000 00000', group: 'person' },
  { key: 'address', label: 'Address', sample: 'Sample address, City', group: 'person' },
  { key: 'schoolName', label: 'School Name', sample: 'Your School Name', group: 'school' },
  {
    key: 'schoolAddress',
    label: 'School Address',
    sample: 'School address, City',
    group: 'school',
  },
  { key: 'schoolPhone', label: 'School Phone', sample: '+91 00000 00000', group: 'school' },
  { key: 'academicSession', label: 'Academic Session', sample: '2026-2027', group: 'school' },
] as const

export const IMAGE_FIELD_KEYS = [
  'studentPhoto',
  'staffPhoto',
  'schoolLogo',
  'qrCode',
  'principalSignature',
] as const

export const IMAGE_FIELDS = [
  { key: 'studentPhoto', label: 'Student Photo', group: 'student' },
  { key: 'staffPhoto', label: 'Staff Photo', group: 'staff' },
  { key: 'schoolLogo', label: 'School Logo', group: 'school' },
  { key: 'qrCode', label: 'QR Code', group: 'person' },
  { key: 'principalSignature', label: 'Principal Signature', group: 'school' },
] as const

export const CARD_SWATCHES = [
  '#ffffff',
  '#f1f5f9',
  '#e0f2fe',
  '#e0e7ff',
  '#fef3c7',
  '#fee2e2',
  '#0f172a',
  '#1f3a5f',
  '#4338ca',
  '#0284c7',
  '#047857',
  '#7c3aed',
]

/** 100% zoom shows the design at real size on a 96 dpi screen. */
export const MM_TO_PX = 96 / 25.4
export const ZOOM_MIN = 0.25
export const ZOOM_MAX = 8
export const ZOOM_FACTOR = 1.25

export const HISTORY_LIMIT = 60
export const MIN_ELEMENT_MM = 0.2

export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
export const IMAGE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024
