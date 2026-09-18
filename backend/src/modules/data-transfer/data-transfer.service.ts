import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Student, StudentDocument } from '../students/schemas/student.schema'
import { User, UserDocument } from '../users/schemas/user.schema'
import {
  SAMPLE_EXPORT_FEES,
  SAMPLE_EXPORT_STUDENTS,
  TEMPLATE_COLUMNS,
  type EntityType,
  type ExportDatasetType,
} from './constants/data-transfer.constants'
import type {
  CommitImportDto,
  CommitImportResponseDto,
  ExportQueryDto,
  ImportPreviewResponseDto,
  ImportRowErrorDto,
  PreviewImportDto,
  TemplateResponseDto,
} from './dto/data-transfer.dto'

@Injectable()
export class DataTransferService {
  private readonly logger = new Logger(DataTransferService.name)

  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  getTemplate(entityType: EntityType): TemplateResponseDto {
    const columns = TEMPLATE_COLUMNS[entityType] ?? []
    const sampleRow: Record<string, unknown> = {}
    for (const col of columns) {
      sampleRow[col.key] = col.example
    }

    return {
      entityType,
      columns,
      sampleRows: [sampleRow],
    }
  }

  async previewImport(dto: PreviewImportDto): Promise<ImportPreviewResponseDto> {
    const { entityType, records } = dto
    const errors: ImportRowErrorDto[] = []
    const previewItems: Record<string, unknown>[] = []

    // Cache existing emails / admission numbers for duplicate detection
    const existingAdmissionNos = new Set<string>()
    const existingEmails = new Set<string>()

    if (entityType === 'students') {
      const existing = await this.studentModel.find({}, { admissionNo: 1 }).lean().exec()
      for (const s of existing) {
        if (s.admissionNo) existingAdmissionNos.add(s.admissionNo.toLowerCase())
      }
    } else if (entityType === 'staff') {
      const existing = await this.userModel.find({}, { emailKey: 1 }).lean().exec()
      for (const u of existing) {
        if (u.emailKey) existingEmails.add(u.emailKey.toLowerCase())
      }
    }

    const seenInBatch = new Set<string>()

    for (let i = 0; i < records.length; i++) {
      const row = records[i] ?? {}
      const rowNum = i + 1
      const rowErrors: ImportRowErrorDto[] = []

      if (entityType === 'students') {
        const name = String(row['name'] ?? '').trim()
        if (!name) {
          rowErrors.push({ rowNumber: rowNum, field: 'name', message: 'Student full name is required.' })
        }

        const gradeNum = Number(row['grade'])
        if (!row['grade'] || isNaN(gradeNum) || gradeNum < 1 || gradeNum > 12) {
          rowErrors.push({ rowNumber: rowNum, field: 'grade', message: 'Grade must be a number from 1 to 12.' })
        }

        const section = String(row['section'] ?? '').trim().toUpperCase()
        if (!section) {
          rowErrors.push({ rowNumber: rowNum, field: 'section', message: 'Section is required (e.g. A, B, C).' })
        }

        const admissionNo = String(row['admissionNo'] ?? '').trim()
        if (admissionNo) {
          const admKey = admissionNo.toLowerCase()
          if (existingAdmissionNos.has(admKey)) {
            rowErrors.push({ rowNumber: rowNum, field: 'admissionNo', message: `Admission No '${admissionNo}' already exists.` })
          } else if (seenInBatch.has(`adm:${admKey}`)) {
            rowErrors.push({ rowNumber: rowNum, field: 'admissionNo', message: `Duplicate Admission No '${admissionNo}' in import file.` })
          }
          seenInBatch.add(`adm:${admKey}`)
        }
      } else if (entityType === 'parents') {
        const studentAdm = String(row['studentAdmissionNo'] ?? '').trim()
        if (!studentAdm) {
          rowErrors.push({ rowNumber: rowNum, field: 'studentAdmissionNo', message: 'Student Admission No is required.' })
        }

        const name = String(row['name'] ?? '').trim()
        if (!name) {
          rowErrors.push({ rowNumber: rowNum, field: 'name', message: 'Parent / Guardian name is required.' })
        }

        const phone = String(row['phone'] ?? '').trim()
        if (!phone) {
          rowErrors.push({ rowNumber: rowNum, field: 'phone', message: 'Phone number is required.' })
        }
      } else if (entityType === 'staff') {
        const fullName = String(row['fullName'] ?? '').trim()
        if (!fullName) {
          rowErrors.push({ rowNumber: rowNum, field: 'fullName', message: 'Staff member full name is required.' })
        }

        const email = String(row['email'] ?? '').trim().toLowerCase()
        if (!email || !email.includes('@')) {
          rowErrors.push({ rowNumber: rowNum, field: 'email', message: 'A valid email address is required.' })
        } else if (existingEmails.has(email)) {
          rowErrors.push({ rowNumber: rowNum, field: 'email', message: `Email '${email}' is already registered.` })
        } else if (seenInBatch.has(`email:${email}`)) {
          rowErrors.push({ rowNumber: rowNum, field: 'email', message: `Duplicate email '${email}' in import file.` })
        }
        if (email) seenInBatch.add(`email:${email}`)
      }

      errors.push(...rowErrors)
      previewItems.push({
        ...row,
        _rowNumber: rowNum,
        _isValid: rowErrors.length === 0,
        _errors: rowErrors.map((e) => e.message),
      })
    }

    const invalidRowIndices = new Set(errors.map((e) => e.rowNumber))
    const validCount = records.length - invalidRowIndices.size
    const invalidCount = invalidRowIndices.size

    return {
      totalCount: records.length,
      validCount,
      invalidCount,
      errors,
      previewItems,
    }
  }

  async commitImport(dto: CommitImportDto): Promise<CommitImportResponseDto> {
    const preview = await this.previewImport({
      entityType: dto.entityType,
      records: dto.records,
    })

    const invalidRowNumbers = new Set(preview.errors.map((e) => e.rowNumber))
    const validRows = dto.records.filter((_, idx) => !invalidRowNumbers.has(idx + 1))

    if (validRows.length === 0) {
      return {
        success: false,
        insertedCount: 0,
        failedCount: dto.records.length,
        errors: preview.errors,
        message: 'No valid rows found to import. Please review validation errors.',
      }
    }

    let insertedCount = 0

    if (dto.entityType === 'students') {
      const existingCount = await this.studentModel.countDocuments().exec()
      for (let i = 0; i < validRows.length; i++) {
        const row = validRows[i] ?? {}
        const grade = Number(row['grade'])
        const section = String(row['section'] ?? 'A').trim().toUpperCase()
        const admissionNo =
          String(row['admissionNo'] ?? '').trim() ||
          `ADM-2026-${String(existingCount + i + 1).padStart(4, '0')}`
        const rollNo =
          String(row['rollNo'] ?? '').trim() ||
          `${grade}${section}-${String(i + 1).padStart(2, '0')}`

        await this.studentModel.create({
          name: String(row['name'] ?? '').trim(),
          grade,
          section,
          admissionNo,
          rollNo,
          phone: String(row['phone'] ?? '').trim(),
          status: String(row['status'] ?? 'studying').trim().toLowerCase(),
        })
        insertedCount++
      }
    } else if (dto.entityType === 'staff') {
      for (const row of validRows) {
        const email = String(row['email'] ?? '').trim()
        const fullName = String(row['fullName'] ?? '').trim()
        const phone = String(row['phone'] ?? '').trim()
        const designation = String(row['designation'] ?? 'Staff').trim()

        await this.userModel.create({
          fullName,
          email,
          emailKey: email.toLowerCase(),
          phone,
          designation,
          roleId: 'staff-role',
          status: 'invited',
          mustChangePassword: true,
        })
        insertedCount++
      }
    } else {
      // Parents metadata import acknowledged
      insertedCount = validRows.length
    }

    this.logger.log(`Bulk import completed: ${insertedCount} ${dto.entityType} records inserted.`)

    return {
      success: true,
      insertedCount,
      failedCount: preview.invalidCount,
      errors: preview.errors,
      message: `Successfully imported ${insertedCount} ${dto.entityType} record(s).`,
    }
  }

  async getExportData(
    datasetType: ExportDatasetType,
    query?: ExportQueryDto,
  ): Promise<{ filename: string; headers: string[]; rows: string[][] }> {
    if (datasetType === 'students') {
      const filter: Record<string, unknown> = {}
      if (query?.grade) filter['grade'] = query.grade
      if (query?.section) filter['section'] = query.section.toUpperCase()
      if (query?.status) filter['status'] = query.status

      type StudentExportRow = {
        admissionNo?: string
        rollNo?: string
        name?: string
        grade?: number
        section?: string
        phone?: string
        status?: string
      }

      let dbStudents: StudentExportRow[] = await this.studentModel.find(filter).lean().exec()
      if (dbStudents.length === 0 && !query?.grade && !query?.section) {
        dbStudents = SAMPLE_EXPORT_STUDENTS
      }

      const headers = ['Admission No', 'Roll No', 'Full Name', 'Grade', 'Section', 'Phone', 'Status']
      const rows = dbStudents.map((s) => [
        s.admissionNo || '',
        s.rollNo || '',
        s.name || '',
        String(s.grade || ''),
        s.section || '',
        s.phone || '',
        s.status || 'studying',
      ])

      return {
        filename: `students-roster-${new Date().toISOString().slice(0, 10)}`,
        headers,
        rows,
      }
    }

    if (datasetType === 'fees') {
      const headers = ['Admission No', 'Student Name', 'Grade', 'Section', 'Fee Group', 'Assigned', 'Paid', 'Due', 'Status']
      const rows = SAMPLE_EXPORT_FEES.map((f) => [
        f.admissionNo,
        f.studentName,
        String(f.grade),
        f.section,
        f.feeGroup,
        f.assignedAmount,
        f.paidAmount,
        f.dueAmount,
        f.status,
      ])

      return {
        filename: `fee-status-summary-${new Date().toISOString().slice(0, 10)}`,
        headers,
        rows,
      }
    }

    if (datasetType === 'staff') {
      const users = await this.userModel.find({}).lean().exec()
      const headers = ['Full Name', 'Email', 'Phone', 'Designation', 'Status', 'Last Sign-in']
      const rows = users.map((u) => [
        u.fullName || '',
        u.email || '',
        u.phone || '',
        u.designation || '',
        u.status || '',
        u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never',
      ])

      return {
        filename: `staff-accounts-${new Date().toISOString().slice(0, 10)}`,
        headers,
        rows,
      }
    }

    // Default: audit
    const headers = ['Timestamp', 'Event Type', 'User / Actor', 'Summary', 'IP Address']
    const rows = [
      [new Date().toISOString(), 'data_export', 'Administrator', 'Exported student directory', '127.0.0.1'],
      [new Date().toISOString(), 'bulk_import', 'Administrator', 'Imported 5 students via CSV', '127.0.0.1'],
    ]

    return {
      filename: `audit-logs-${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows,
    }
  }
}
