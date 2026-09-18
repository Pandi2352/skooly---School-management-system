import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common'
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
import { QueryAdmissionsDto } from './dto/query-admissions.dto'
import { EnrollApplicantDto, UpdateAdmissionStatusDto } from './dto/update-admission-status.dto'
import {
  AdmissionApplicationDocument,
} from './schemas/admission-application.schema'

@Injectable()
export class AdmissionsService implements OnModuleInit {
  private readonly logger = new Logger(AdmissionsService.name)

  constructor(
    private readonly repository: AdmissionsRepository,
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
      this.repository.find(filter, skip, limit),
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

  async getStats(): Promise<AdmissionStatsResponseDto> {
    return this.repository.getStats()
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
      },
      parent: {
        guardianType: doc.parent.guardianType,
        name: doc.parent.name,
        email: doc.parent.email,
        phone: doc.parent.phone,
        occupation: doc.parent.occupation,
        address: doc.parent.address,
      },
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
