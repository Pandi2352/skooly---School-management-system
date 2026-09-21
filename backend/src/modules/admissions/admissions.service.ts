import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { AuditService } from '../audit/audit.service'
import { InjectModel } from '@nestjs/mongoose'
import type { FilterQuery, Model } from 'mongoose'
import { generateUuid } from '../../common/utils/uuid.util'
import { Student, StudentDocument } from '../students/schemas/student.schema'
import { AdmissionsRepository } from './admissions.repository'
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto'
import {
  AdmissionApplicationResponseDto,
  AdmissionStatsResponseDto,
  PaginatedAdmissionsResponseDto,
} from './dto/admissions-response.dto'
import { QueryAdmissionsDto, type AdmissionSort } from './dto/query-admissions.dto'
import { UpdateAdmissionApplicationDto } from './dto/update-admission-application.dto'
import { applicationNotFound, cannotDeleteEnrolled, noApplicationChanges } from './admissions.errors'
import { EnrollApplicantDto, UpdateAdmissionStatusDto } from './dto/update-admission-status.dto'
import {
  AdmissionApplicationDocument,
} from './schemas/admission-application.schema'

/** How far back the overview's trend looks. A month reads as a month at a glance. */
const TREND_WINDOW_DAYS = 30

/**
 * A quiet day is a real answer, so the gaps are filled with zeroes: without them a line chart
 * joins two busy days and invents applications that never arrived.
 */
function fillMissingDays(
  days: { day: string; count: number }[],
  since: Date,
  windowDays: number,
): { day: string; count: number }[] {
  const counts = new Map(days.map((entry) => [entry.day, entry.count]))
  return Array.from({ length: windowDays }, (_, offset) => {
    const date = new Date(since)
    date.setUTCDate(date.getUTCDate() + offset)
    const day = date.toISOString().slice(0, 10)
    return { day, count: counts.get(day) ?? 0 }
  })
}

/** How the list is ordered. A second key keeps rows from swapping places between pages. */
const SORT_ORDERS: Record<AdmissionSort, Record<string, 1 | -1>> = {
  newest: { appliedAt: -1, createdAt: -1 },
  oldest: { appliedAt: 1, createdAt: 1 },
  name: { 'student.firstName': 1, 'student.lastName': 1 },
  grade: { 'student.gradeApplied': 1, appliedAt: -1 },
}

@Injectable()
export class AdmissionsService implements OnModuleInit {
  private readonly logger = new Logger(AdmissionsService.name)

  constructor(
    private readonly repository: AdmissionsRepository,
    private readonly auditService: AuditService,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.repository.ensureSeedData()
    } catch (error) {
      this.logger.error('Failed to seed admission applications', error instanceof Error ? error.stack : String(error))
    }
  }

  async list(query: QueryAdmissionsDto): Promise<PaginatedAdmissionsResponseDto> {
    const filter: FilterQuery<AdmissionApplicationDocument> = {}

    if (query.status) {
      filter.status = query.status
    }

    if (query.grade !== undefined) {
      filter['student.gradeApplied'] = query.grade
    }

    if (query.documents === 'verified') {
      // Every document checked: no document is still waiting.
      filter.documents = { $not: { $elemMatch: { status: { $ne: 'verified' } } } }
    } else if (query.documents === 'pending') {
      filter.documents = { $elemMatch: { status: { $ne: 'verified' } } }
    }

    if (query.appliedFrom || query.appliedTo) {
      const appliedAt: Record<string, Date> = {}
      if (query.appliedFrom) appliedAt.$gte = new Date(query.appliedFrom)
      // The "to" date is inclusive: someone picking 31 March means the whole of that day.
      if (query.appliedTo) appliedAt.$lte = new Date(`${query.appliedTo}T23:59:59.999Z`)
      filter.appliedAt = appliedAt
    }

    if (query.search && query.search.trim().length > 0) {
      const term = query.search.trim()
      const regex = new RegExp(term, 'i')
      filter.$or = [
        { applicationNo: regex },
        { 'student.firstName': regex },
        { 'student.lastName': regex },
        { 'parent.name': regex },
        { 'parent.phone': regex },
      ]
    }

    const page = Math.max(1, query.page ?? 1)
    const limit = Math.min(100, Math.max(1, query.limit ?? 20))
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      this.repository.find(filter, skip, limit, SORT_ORDERS[query.sort ?? 'newest']),
      this.repository.count(filter),
    ])

    return {
      items: items.map((doc) => this.toResponse(doc)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    }
  }

  /**
   * Edits the applicant's own details. Status, documents and enrolment each have their own path, so
   * a correction to a spelling can't quietly approve someone.
   */
  async updateDetails(
    id: string,
    dto: UpdateAdmissionApplicationDto,
    actor?: AuthenticatedUserContext,
  ): Promise<AdmissionApplicationResponseDto> {
    const existing = await this.repository.findById(id)
    if (!existing) throw applicationNotFound(id)

    const changes: Record<string, unknown> = {}
    if (dto.firstName !== undefined) changes['student.firstName'] = dto.firstName
    if (dto.lastName !== undefined) changes['student.lastName'] = dto.lastName
    if (dto.gradeApplied !== undefined) changes['student.gradeApplied'] = dto.gradeApplied
    if (dto.previousSchool !== undefined) changes['student.previousSchool'] = dto.previousSchool
    if (dto.parentName !== undefined) changes['parent.name'] = dto.parentName
    if (dto.parentPhone !== undefined) changes['parent.phone'] = dto.parentPhone
    if (dto.parentEmail !== undefined) changes['parent.email'] = dto.parentEmail
    if (Object.keys(changes).length === 0) throw noApplicationChanges()

    const updated = await this.repository.updateDetails(id, changes)
    if (!updated) throw applicationNotFound(id)

    await this.auditService.record('admission.updated', {
      actor,
      summary: `${updated.applicationNo}: ${Object.keys(changes).length} detail(s) corrected`,
    })
    return this.toResponse(updated)
  }

  /**
   * Removes an application for good. Enrolled ones are kept: the student record points back here,
   * and deleting would leave that student with no admission to explain it.
   */
  async remove(id: string, actor?: AuthenticatedUserContext): Promise<{ id: string; applicationNo: string }> {
    const existing = await this.repository.findById(id)
    if (!existing) throw applicationNotFound(id)
    if (existing.status === 'enrolled') throw cannotDeleteEnrolled(existing.applicationNo)

    const deleted = await this.repository.deleteById(id)
    if (!deleted) throw applicationNotFound(id)

    await this.auditService.record('admission.deleted', {
      actor,
      summary: `${deleted.applicationNo} (${deleted.student.firstName} ${deleted.student.lastName}) deleted`,
    })
    return { id: deleted._id, applicationNo: deleted.applicationNo }
  }

  async getStats(): Promise<AdmissionStatsResponseDto> {
    const since = new Date(Date.now() - (TREND_WINDOW_DAYS - 1) * 24 * 60 * 60 * 1000)
    since.setUTCHours(0, 0, 0, 0)

    const [counts, byGrade, days] = await Promise.all([
      this.repository.getStats(),
      this.repository.countByGrade(),
      this.repository.countByDay(since),
    ])

    return { ...counts, byGrade, byDay: fillMissingDays(days, since, TREND_WINDOW_DAYS), windowDays: TREND_WINDOW_DAYS }
  }

  async getById(id: string): Promise<AdmissionApplicationResponseDto> {
    const doc = await this.repository.findById(id)
    if (!doc) {
      throw new NotFoundException(`Admission application not found: ${id}`)
    }
    return this.toResponse(doc)
  }

  async create(dto: CreateAdmissionApplicationDto): Promise<AdmissionApplicationResponseDto> {
    const count = await this.repository.count({})
    const applicationNo = `APP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const doc = await this.repository.create({
      applicationNo,
      student: dto.student,
      parent: dto.parent,
      academic: dto.academic ?? {},
      health: dto.health ?? {},
      bank: dto.bank ?? {},
      feeGroupIds: dto.feeGroupIds ?? [],
      customFields: dto.customFields ?? {},
      documents: dto.documents ?? [],
      status: 'under-review',
      appliedAt: new Date(),
    })

    return this.toResponse(doc)
  }

  async updateStatus(id: string, dto: UpdateAdmissionStatusDto): Promise<AdmissionApplicationResponseDto> {
    const existing = await this.repository.findById(id)
    if (!existing) {
      throw new NotFoundException(`Admission application not found: ${id}`)
    }

    const updated = await this.repository.updateStatus(id, dto.status, dto.reviewerNotes)
    if (!updated) {
      throw new NotFoundException(`Failed to update application: ${id}`)
    }

    return this.toResponse(updated)
  }

  async enroll(id: string, dto: EnrollApplicantDto): Promise<{ application: AdmissionApplicationResponseDto; studentId: string }> {
    const application = await this.repository.findById(id)
    if (!application) {
      throw new NotFoundException(`Admission application not found: ${id}`)
    }

    if (application.status === 'enrolled' && application.enrolledStudentId) {
      throw new BadRequestException('This applicant has already been enrolled as a student.')
    }

    // Generate admissionNo and rollNo if not provided
    const studentCount = await this.studentModel.countDocuments().exec()
    const admissionNo = dto.admissionNo || `ADM-${new Date().getFullYear()}-${String(studentCount + 1).padStart(4, '0')}`
    const rollNo = dto.rollNo || String((studentCount % 40) + 1).padStart(3, '0')
    const fullName = `${application.student.firstName} ${application.student.lastName}`.trim()

    const studentId = generateUuid()
    await this.studentModel.create({
      _id: studentId,
      admissionNo,
      rollNo,
      name: fullName,
      grade: application.student.gradeApplied,
      section: dto.section,
      phone: application.parent.phone,
      status: 'studying',
    })

    const updatedApp = await this.repository.markEnrolled(id, studentId)
    return {
      application: this.toResponse(updatedApp ?? application),
      studentId,
    }
  }

  private toResponse(doc: AdmissionApplicationDocument): AdmissionApplicationResponseDto {
    return {
      _id: String(doc._id),
      applicationNo: doc.applicationNo,
      student: {
        firstName: doc.student.firstName,
        lastName: doc.student.lastName,
        dateOfBirth: doc.student.dateOfBirth,
        gender: doc.student.gender,
        gradeApplied: doc.student.gradeApplied,
        bloodGroup: doc.student.bloodGroup,
        previousSchool: doc.student.previousSchool,
        photoUrl:
          doc.student.photoUrl ||
          (doc.student.gender === 'female'
            ? '/mock/student_photo_girl.jpg'
            : '/mock/student_photo_boy.jpg'),
        middleName: doc.student.middleName ?? '',
        category: doc.student.category ?? '',
        house: doc.student.house ?? '',
        religion: doc.student.religion ?? '',
        nationalId: doc.student.nationalId ?? '',
        penId: doc.student.penId ?? '',
        caste: doc.student.caste ?? '',
        subCaste: doc.student.subCaste ?? '',
        motherTongue: doc.student.motherTongue ?? '',
        placeOfBirth: doc.student.placeOfBirth ?? '',
        nationality: doc.student.nationality ?? 'Indian',
        belowPovertyLine: doc.student.belowPovertyLine ?? false,
        rightToEducation: doc.student.rightToEducation ?? false,
        phone: doc.student.phone ?? '',
        email: doc.student.email ?? '',
      },
      parent: {
        guardianType: doc.parent.guardianType,
        name: doc.parent.name,
        email: doc.parent.email,
        phone: doc.parent.phone,
        occupation: doc.parent.occupation,
        address: doc.parent.address,
        fatherName: doc.parent.fatherName ?? '',
        fatherPhone: doc.parent.fatherPhone ?? '',
        fatherOccupation: doc.parent.fatherOccupation ?? '',
        fatherQualification: doc.parent.fatherQualification ?? '',
        fatherAadhaar: doc.parent.fatherAadhaar ?? '',
        fatherIncomePaise: doc.parent.fatherIncomePaise ?? null,
        motherName: doc.parent.motherName ?? '',
        motherPhone: doc.parent.motherPhone ?? '',
        motherOccupation: doc.parent.motherOccupation ?? '',
        motherQualification: doc.parent.motherQualification ?? '',
        motherAadhaar: doc.parent.motherAadhaar ?? '',
        emergencyName: doc.parent.emergencyName ?? '',
        emergencyPhone: doc.parent.emergencyPhone ?? '',
        permanentAddress: doc.parent.permanentAddress ?? '',
      },
      academic: {
        admissionNo: doc.academic?.admissionNo ?? '',
        rollNo: doc.academic?.rollNo ?? '',
        admissionDate: doc.academic?.admissionDate ?? '',
        section: doc.academic?.section ?? '',
        biometricId: doc.academic?.biometricId ?? '',
        openingDuePaise: doc.academic?.openingDuePaise ?? 0,
      },
      health: {
        medicalConditions: doc.health?.medicalConditions ?? '',
        allergies: doc.health?.allergies ?? '',
        heightCm: doc.health?.heightCm ?? '',
        weightKg: doc.health?.weightKg ?? '',
      },
      bank: {
        accountHolder: doc.bank?.accountHolder ?? '',
        bankName: doc.bank?.bankName ?? '',
        accountNumber: doc.bank?.accountNumber ?? '',
        ifsc: doc.bank?.ifsc ?? '',
      },
      feeGroupIds: doc.feeGroupIds ?? [],
      customFields: doc.customFields ?? {},
      documents: doc.documents.map((d) => ({
        name: d.name,
        status: d.status,
        fileUrl: d.fileUrl ?? '',
      })),
      status: doc.status,
      appliedAt: doc.appliedAt ?? new Date(),
      reviewedAt: doc.reviewedAt,
      reviewerNotes: doc.reviewerNotes,
      enrolledStudentId: doc.enrolledStudentId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }
}
