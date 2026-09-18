export type EntityType = 'students' | 'parents' | 'staff'

export type ExportDatasetType = 'students' | 'fees' | 'staff' | 'audit'

export type TemplateColumn = {
  key: string
  label: string
  required: boolean
  description: string
  example: string
}

export const TEMPLATE_COLUMNS: Record<EntityType, TemplateColumn[]> = {
  students: [
    { key: 'name', label: 'Student Full Name', required: true, description: 'First and last name', example: 'Aarav Sharma' },
    { key: 'grade', label: 'Grade / Class', required: true, description: 'Grade number 1-12', example: '5' },
    { key: 'section', label: 'Section', required: true, description: 'Section letter A-Z', example: 'A' },
    { key: 'admissionNo', label: 'Admission Number', required: false, description: 'Optional unique admission ID (auto-generated if omitted)', example: 'ADM-2026-1001' },
    { key: 'rollNo', label: 'Roll Number', required: false, description: 'Class roll number (auto-assigned if omitted)', example: '5A-01' },
    { key: 'phone', label: 'Contact Phone', required: false, description: 'Parent / guardian primary contact phone', example: '+91 98765 43210' },
    { key: 'status', label: 'Status', required: false, description: 'studying, pending, or left (default: studying)', example: 'studying' },
  ],
  parents: [
    { key: 'studentAdmissionNo', label: 'Student Admission No', required: true, description: 'Target student admission number', example: 'ADM-2026-1001' },
    { key: 'name', label: 'Parent / Guardian Name', required: true, description: 'Full name of guardian', example: 'Rajesh Sharma' },
    { key: 'guardianType', label: 'Relationship', required: true, description: 'father, mother, or guardian', example: 'father' },
    { key: 'email', label: 'Email Address', required: true, description: 'Contact email', example: 'rajesh.sharma@example.com' },
    { key: 'phone', label: 'Phone Number', required: true, description: 'Primary phone', example: '+91 98765 43210' },
    { key: 'occupation', label: 'Occupation', required: false, description: 'Parent profession', example: 'Civil Engineer' },
    { key: 'address', label: 'Residential Address', required: false, description: 'Home address', example: '42 Orchid Residency, Bengaluru' },
  ],
  staff: [
    { key: 'fullName', label: 'Full Name', required: true, description: 'Staff member name', example: 'Priya Sundaram' },
    { key: 'email', label: 'Email Address', required: true, description: 'Unique school login email', example: 'priya.sundaram@school.in' },
    { key: 'roleName', label: 'Role', required: true, description: 'Teacher, Staff, Accountant, or Administrator', example: 'Teacher' },
    { key: 'designation', label: 'Designation', required: false, description: 'Official designation', example: 'Senior Science Teacher' },
    { key: 'phone', label: 'Phone Number', required: false, description: 'Contact phone', example: '+91 98450 67890' },
  ],
}

export const SAMPLE_EXPORT_STUDENTS = [
  { admissionNo: 'ADM-2026-0001', rollNo: '101', name: 'Aarav Sharma', grade: 5, section: 'A', phone: '+91 98765 43210', status: 'studying' },
  { admissionNo: 'ADM-2026-0002', rollNo: '102', name: 'Diya Patel', grade: 5, section: 'A', phone: '+91 98765 43211', status: 'studying' },
  { admissionNo: 'ADM-2026-0003', rollNo: '103', name: 'Rohan Verma', grade: 6, section: 'B', phone: '+91 98765 43212', status: 'studying' },
  { admissionNo: 'ADM-2026-0004', rollNo: '104', name: 'Ananya Iyer', grade: 4, section: 'A', phone: '+91 98765 43213', status: 'studying' },
  { admissionNo: 'ADM-2026-0005', rollNo: '105', name: 'Kabir Khan', grade: 7, section: 'C', phone: '+91 98765 43214', status: 'studying' },
]

export const SAMPLE_EXPORT_FEES = [
  { admissionNo: 'ADM-2026-0001', studentName: 'Aarav Sharma', grade: 5, section: 'A', feeGroup: 'Standard Tuition Grade 5', assignedAmount: '₹ 45,000', paidAmount: '₹ 45,000', dueAmount: '₹ 0', status: 'Fully Paid' },
  { admissionNo: 'ADM-2026-0002', studentName: 'Diya Patel', grade: 5, section: 'A', feeGroup: 'Standard Tuition Grade 5', assignedAmount: '₹ 45,000', paidAmount: '₹ 25,000', dueAmount: '₹ 20,000', status: 'Partial' },
  { admissionNo: 'ADM-2026-0003', studentName: 'Rohan Verma', grade: 6, section: 'B', feeGroup: 'Standard Tuition Grade 6', assignedAmount: '₹ 48,000', paidAmount: '₹ 48,000', dueAmount: '₹ 0', status: 'Fully Paid' },
  { admissionNo: 'ADM-2026-0004', studentName: 'Ananya Iyer', grade: 4, section: 'A', feeGroup: 'Standard Tuition Grade 4', assignedAmount: '₹ 42,000', paidAmount: '₹ 0', dueAmount: '₹ 42,000', status: 'Overdue' },
]
