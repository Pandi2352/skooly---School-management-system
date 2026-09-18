import type {
  CommitImportResponse,
  EntityType,
  ExportDataResponse,
  ExportDatasetType,
  ImportPreviewResponse,
  TemplateResponse,
} from '../../schemas/dataTransfer.schema'

export const sampleTemplates: Record<EntityType, TemplateResponse> = {
  students: {
    entityType: 'students',
    columns: [
      { key: 'name', label: 'Student Full Name', required: true, description: 'First and last name', example: 'Aarav Sharma' },
      { key: 'grade', label: 'Grade / Class', required: true, description: 'Grade number 1-12', example: '5' },
      { key: 'section', label: 'Section', required: true, description: 'Section letter A-Z', example: 'A' },
      { key: 'admissionNo', label: 'Admission Number', required: false, description: 'Optional unique admission ID', example: 'ADM-2026-1001' },
      { key: 'rollNo', label: 'Roll Number', required: false, description: 'Class roll number', example: '5A-01' },
      { key: 'phone', label: 'Contact Phone', required: false, description: 'Parent / guardian primary contact phone', example: '+91 98765 43210' },
      { key: 'status', label: 'Status', required: false, description: 'studying, pending, or left', example: 'studying' },
    ],
    sampleRows: [
      { name: 'Aarav Sharma', grade: '5', section: 'A', admissionNo: 'ADM-2026-1001', rollNo: '5A-01', phone: '+91 98765 43210', status: 'studying' },
    ],
  },
  parents: {
    entityType: 'parents',
    columns: [
      { key: 'studentAdmissionNo', label: 'Student Admission No', required: true, description: 'Target student admission number', example: 'ADM-2026-1001' },
      { key: 'name', label: 'Parent / Guardian Name', required: true, description: 'Full name of guardian', example: 'Rajesh Sharma' },
      { key: 'guardianType', label: 'Relationship', required: true, description: 'father, mother, or guardian', example: 'father' },
      { key: 'email', label: 'Email Address', required: true, description: 'Contact email', example: 'rajesh.sharma@example.com' },
      { key: 'phone', label: 'Phone Number', required: true, description: 'Primary phone', example: '+91 98765 43210' },
    ],
    sampleRows: [
      { studentAdmissionNo: 'ADM-2026-1001', name: 'Rajesh Sharma', guardianType: 'father', email: 'rajesh.sharma@example.com', phone: '+91 98765 43210' },
    ],
  },
  staff: {
    entityType: 'staff',
    columns: [
      { key: 'fullName', label: 'Full Name', required: true, description: 'Staff member name', example: 'Priya Sundaram' },
      { key: 'email', label: 'Email Address', required: true, description: 'Unique school login email', example: 'priya.sundaram@school.in' },
      { key: 'roleName', label: 'Role', required: true, description: 'Teacher, Staff, Accountant, or Administrator', example: 'Teacher' },
      { key: 'designation', label: 'Designation', required: false, description: 'Official designation', example: 'Senior Science Teacher' },
      { key: 'phone', label: 'Phone Number', required: false, description: 'Contact phone', example: '+91 98450 67890' },
    ],
    sampleRows: [
      { fullName: 'Priya Sundaram', email: 'priya.sundaram@school.in', roleName: 'Teacher', designation: 'Senior Science Teacher', phone: '+91 98450 67890' },
    ],
  },
}

export function getSampleTemplate(entityType: EntityType): TemplateResponse {
  return sampleTemplates[entityType]
}

export function samplePreviewImport(
  entityType: EntityType,
  records: Record<string, unknown>[],
): ImportPreviewResponse {
  const errors: { rowNumber: number; field?: string; message: string }[] = []
  for (let i = 0; i < records.length; i++) {
    const r = records[i] ?? {}
    if (entityType === 'students' && !r.name) {
      errors.push({ rowNumber: i + 1, field: 'name', message: 'Student name is required.' })
    }
  }

  const validCount = records.length - errors.length
  return {
    totalCount: records.length,
    validCount,
    invalidCount: errors.length,
    errors,
    previewItems: records.map((r, idx) => ({ ...r, _rowNumber: idx + 1, _isValid: true })),
  }
}

export function sampleCommitImport(
  entityType: EntityType,
  records: Record<string, unknown>[],
): CommitImportResponse {
  return {
    success: true,
    insertedCount: records.length,
    failedCount: 0,
    errors: [],
    message: `Successfully imported ${records.length} ${entityType} record(s).`,
  }
}

export function getSampleExportData(datasetType: ExportDatasetType): ExportDataResponse {
  if (datasetType === 'students') {
    return {
      filename: 'students-roster-sample',
      headers: ['Admission No', 'Roll No', 'Full Name', 'Grade', 'Section', 'Phone', 'Status'],
      rows: [
        ['ADM-2026-0001', '101', 'Aarav Sharma', '5', 'A', '+91 98765 43210', 'studying'],
        ['ADM-2026-0002', '102', 'Diya Patel', '5', 'A', '+91 98765 43211', 'studying'],
        ['ADM-2026-0003', '103', 'Rohan Verma', '6', 'B', '+91 98765 43212', 'studying'],
      ],
    }
  }

  if (datasetType === 'fees') {
    return {
      filename: 'fee-status-summary-sample',
      headers: ['Admission No', 'Student Name', 'Grade', 'Section', 'Fee Group', 'Assigned', 'Paid', 'Due', 'Status'],
      rows: [
        ['ADM-2026-0001', 'Aarav Sharma', '5', 'A', 'Standard Tuition Grade 5', '₹ 45,000', '₹ 45,000', '₹ 0', 'Fully Paid'],
        ['ADM-2026-0002', 'Diya Patel', '5', 'A', 'Standard Tuition Grade 5', '₹ 45,000', '₹ 25,000', '₹ 20,000', 'Partial'],
      ],
    }
  }

  return {
    filename: `${datasetType}-export-sample`,
    headers: ['Name', 'Email', 'Role', 'Status'],
    rows: [
      ['Asha Menon', 'asha.menon@school.in', 'Administrator', 'active'],
      ['Rajesh Verma', 'rajesh.verma@school.in', 'Teacher', 'active'],
    ],
  }
}
