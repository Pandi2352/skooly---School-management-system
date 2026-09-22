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
import type { CreateJobApplicantDto, CreateJobPostingDto, UpdateApplicantStatusDto, UpdateJobPostingDto } from './dto/recruitment.dto'

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

  async findAll(query: QueryStaffDto) {
    const { search, department, status, page = 1, limit = DEFAULT_PAGE_SIZE } = query
    const filter: FilterQuery<StaffDocument> = {}
    if (department) filter['employment.department'] = department
    if (status) filter['employment.status'] = status
    if (search) filter.$text = { $search: search }
    const skip = (page - 1) * limit
    const [rows, total] = await Promise.all([
      this.staffModel.find(filter).sort({ 'personalInfo.firstName': 1 }).skip(skip).limit(limit).lean().exec(),
      this.staffModel.countDocuments(filter).exec(),
    ])
    return { rows, total, page, pageCount: Math.max(1, Math.ceil(total / limit)) }
  }

  async findById(id: string) {
    return this.staffModel.findById(id).lean().exec()
  }

  async create(dto: CreateStaffDto) {
    return this.staffModel.create(dto)
  }

  async update(id: string, dto: UpdateStaffDto) {
    return this.staffModel.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true }).lean().exec()
  }

  async updatePhoto(id: string, photoUrl: string) {
    return this.staffModel.findByIdAndUpdate(id, { $set: { photoUrl } }, { new: true }).lean().exec()
  }

  async countByStatus() {
    return this.staffModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$employment.status', count: { $sum: 1 } } },
    ]).exec()
  }

  async countByDepartment() {
    return this.staffModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$employment.department', count: { $sum: 1 } } },
    ]).exec()
  }

  // ── Leaves ─────────────────────────────────────────────────────────────────

  async findLeaves(filter: FilterQuery<LeaveApplicationDocument>) {
    return this.leaveModel.find(filter).sort({ fromDate: -1 }).lean().exec()
  }

  async findLeaveById(id: string) {
    return this.leaveModel.findById(id).lean().exec()
  }

  async createLeave(dto: CreateLeaveApplicationDto) {
    return this.leaveModel.create(dto)
  }

  async updateLeaveStatus(id: string, dto: UpdateLeaveStatusDto, approvedBy: string) {
    return this.leaveModel.findByIdAndUpdate(
      id,
      { $set: { status: dto.status, remarks: dto.remarks ?? '', approvedBy, approvedAt: new Date() } },
      { new: true },
    ).lean().exec()
  }

  async deleteLeave(id: string) {
    return this.leaveModel.findByIdAndDelete(id).lean().exec()
  }

  async countPendingLeaves() {
    return this.leaveModel.countDocuments({ status: 'pending' }).exec()
  }

  // ── Evaluations ────────────────────────────────────────────────────────────

  async findEvaluations(staffId?: string) {
    const filter: FilterQuery<StaffEvaluationDocument> = staffId ? { staffId } : {}
    return this.evalModel.find(filter).sort({ createdAt: -1 }).lean().exec()
  }

  async createEvaluation(dto: CreateEvaluationDto) {
    return this.evalModel.create(dto)
  }

  // ── Recruitment ────────────────────────────────────────────────────────────

  async findJobs() {
    return this.jobModel.find().sort({ createdAt: -1 }).lean().exec()
  }

  async findJobById(id: string) {
    return this.jobModel.findById(id).lean().exec()
  }

  async createJob(dto: CreateJobPostingDto) {
    return this.jobModel.create(dto)
  }

  async updateJob(id: string, dto: UpdateJobPostingDto) {
    return this.jobModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean().exec()
  }

  async findApplicants(jobId: string) {
    return this.applicantModel.find({ jobId }).sort({ createdAt: -1 }).lean().exec()
  }

  async createApplicant(dto: CreateJobApplicantDto) {
    return this.applicantModel.create(dto)
  }

  async updateApplicantStatus(id: string, dto: UpdateApplicantStatusDto) {
    return this.applicantModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean().exec()
  }

  async countOpenJobs() {
    return this.jobModel.countDocuments({ status: 'open' }).exec()
  }
}
