import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { FilterQuery, Model } from 'mongoose'
import { JobApplicant, type JobApplicantDocument } from './schemas/job-applicant.schema'
import { JobPosting, type JobPostingDocument } from './schemas/job-posting.schema'
import { LeaveApplication, type LeaveApplicationDocument } from './schemas/leave-application.schema'
import { Staff, type StaffDocument } from './schemas/staff.schema'
import { StaffEvaluation, type StaffEvaluationDocument } from './schemas/evaluation.schema'
import type { QueryStaffDto } from './dto/query-staff.dto'
import type { CreateStaffDto } from './dto/create-staff.dto'
import type { UpdateStaffDto } from './dto/update-staff.dto'
import type { CreateLeaveApplicationDto, UpdateLeaveStatusDto } from './dto/leave.dto'
import type { CreateEvaluationDto } from './dto/evaluation.dto'
import type {
  CreateJobApplicantDto,
  CreateJobPostingDto,
  UpdateApplicantStatusDto,
  UpdateJobPostingDto,
} from './dto/recruitment.dto'
import type { PaginatedStaffResponse } from './dto/staff-response.dto'

const DEFAULT_PAGE_SIZE = 20

@Injectable()
export class StaffRepository {
  constructor(
    @InjectModel(Staff.name) private readonly staffModel: Model<StaffDocument>,
    @InjectModel(LeaveApplication.name) private readonly leaveModel: Model<LeaveApplicationDocument>,
    @InjectModel(StaffEvaluation.name) private readonly evalModel: Model<StaffEvaluationDocument>,
    @InjectModel(JobPosting.name) private readonly jobModel: Model<JobPostingDocument>,
    @InjectModel(JobApplicant.name) private readonly applicantModel: Model<JobApplicantDocument>,
  ) {}

  // ── Staff ──────────────────────────────────────────────────────────────────

  async findAll(query: QueryStaffDto): Promise<PaginatedStaffResponse> {
    const { search, department, status, page = 1, limit = DEFAULT_PAGE_SIZE } = query
    const filter: FilterQuery<StaffDocument> = {}
    if (department) filter['employment.department'] = department
    if (status) filter['employment.status'] = status
    if (search) filter.$text = { $search: search }
    const skip = (page - 1) * limit
    const [rows, total] = await Promise.all([
      this.staffModel.find(filter).sort({ 'personalInfo.firstName': 1 }).skip(skip).limit(limit).lean<Staff[]>().exec(),
      this.staffModel.countDocuments(filter).exec(),
    ])
    return { rows, total, page, pageCount: Math.max(1, Math.ceil(total / limit)) }
  }

  async findById(id: string): Promise<Staff | null> {
    return this.staffModel.findById(id).lean<Staff>().exec()
  }

  async create(dto: CreateStaffDto): Promise<Staff> {
    const created = await this.staffModel.create(dto)
    return created.toObject() as unknown as Staff
  }

  async update(id: string, dto: UpdateStaffDto): Promise<Staff | null> {
    return this.staffModel.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true }).lean<Staff>().exec()
  }

  async updatePhoto(id: string, photoUrl: string): Promise<Staff | null> {
    return this.staffModel.findByIdAndUpdate(id, { $set: { photoUrl } }, { new: true }).lean<Staff>().exec()
  }

  async countByStatus(): Promise<{ _id: string; count: number }[]> {
    return this.staffModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$employment.status', count: { $sum: 1 } } },
    ]).exec()
  }

  async countByDepartment(): Promise<{ _id: string; count: number }[]> {
    return this.staffModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$employment.department', count: { $sum: 1 } } },
    ]).exec()
  }

  // ── Leaves ─────────────────────────────────────────────────────────────────

  async findLeaves(filter: FilterQuery<LeaveApplicationDocument>): Promise<LeaveApplication[]> {
    return this.leaveModel.find(filter).sort({ fromDate: -1 }).lean<LeaveApplication[]>().exec()
  }

  async findLeaveById(id: string): Promise<LeaveApplication | null> {
    return this.leaveModel.findById(id).lean<LeaveApplication>().exec()
  }

  async createLeave(dto: CreateLeaveApplicationDto): Promise<LeaveApplication> {
    const created = await this.leaveModel.create(dto)
    return created.toObject() as unknown as LeaveApplication
  }

  async updateLeaveStatus(id: string, dto: UpdateLeaveStatusDto, approvedBy: string): Promise<LeaveApplication | null> {
    return this.leaveModel.findByIdAndUpdate(
      id,
      { $set: { status: dto.status, remarks: dto.remarks ?? '', approvedBy, approvedAt: new Date() } },
      { new: true },
    ).lean<LeaveApplication>().exec()
  }

  async deleteLeave(id: string): Promise<LeaveApplication | null> {
    return this.leaveModel.findByIdAndDelete(id).lean<LeaveApplication>().exec()
  }

  async countPendingLeaves(): Promise<number> {
    return this.leaveModel.countDocuments({ status: 'pending' }).exec()
  }

  // ── Evaluations ────────────────────────────────────────────────────────────

  async findEvaluations(staffId?: string): Promise<StaffEvaluation[]> {
    const filter: FilterQuery<StaffEvaluationDocument> = staffId ? { staffId } : {}
    return this.evalModel.find(filter).sort({ createdAt: -1 }).lean<StaffEvaluation[]>().exec()
  }

  async createEvaluation(dto: CreateEvaluationDto): Promise<StaffEvaluation> {
    const created = await this.evalModel.create(dto)
    return created.toObject() as unknown as StaffEvaluation
  }

  // ── Recruitment ────────────────────────────────────────────────────────────

  async findJobs(): Promise<JobPosting[]> {
    return this.jobModel.find().sort({ createdAt: -1 }).lean<JobPosting[]>().exec()
  }

  async findJobById(id: string): Promise<JobPosting | null> {
    return this.jobModel.findById(id).lean<JobPosting>().exec()
  }

  async createJob(dto: CreateJobPostingDto): Promise<JobPosting> {
    const created = await this.jobModel.create(dto)
    return created.toObject() as unknown as JobPosting
  }

  async updateJob(id: string, dto: UpdateJobPostingDto): Promise<JobPosting | null> {
    return this.jobModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean<JobPosting>().exec()
  }

  async findApplicants(jobId: string): Promise<JobApplicant[]> {
    return this.applicantModel.find({ jobId }).sort({ createdAt: -1 }).lean<JobApplicant[]>().exec()
  }

  async createApplicant(dto: CreateJobApplicantDto): Promise<JobApplicant> {
    const created = await this.applicantModel.create(dto)
    return created.toObject() as unknown as JobApplicant
  }

  async updateApplicantStatus(id: string, dto: UpdateApplicantStatusDto): Promise<JobApplicant | null> {
    return this.applicantModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean<JobApplicant>().exec()
  }

  async countOpenJobs(): Promise<number> {
    return this.jobModel.countDocuments({ status: 'open' }).exec()
  }
}
