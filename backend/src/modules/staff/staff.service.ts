import { Injectable, NotFoundException } from '@nestjs/common'
import { StaffRepository } from './staff.repository'
import type { QueryStaffDto } from './dto/query-staff.dto'
import type { CreateStaffDto } from './dto/create-staff.dto'
import type { UpdateStaffDto } from './dto/update-staff.dto'
import type { CreateLeaveApplicationDto, QueryLeavesDto, UpdateLeaveStatusDto } from './dto/leave.dto'
import type { CreateEvaluationDto } from './dto/evaluation.dto'
import type {
  CreateJobApplicantDto,
  CreateJobPostingDto,
  UpdateApplicantStatusDto,
  UpdateJobPostingDto,
} from './dto/recruitment.dto'
import type { FilterQuery } from 'mongoose'
import type { LeaveApplicationDocument } from './schemas/leave-application.schema'
import type {
  JobApplicant,
  JobPosting,
  LeaveApplication,
  PaginatedStaffResponse,
  Staff,
  StaffEvaluation,
  StaffStatsResponse,
} from './dto/staff-response.dto'

@Injectable()
export class StaffService {
  constructor(private readonly repo: StaffRepository) {}

  // ── Staff ──────────────────────────────────────────────────────────────────

  list(query: QueryStaffDto): Promise<PaginatedStaffResponse> {
    return this.repo.findAll(query)
  }

  async getById(id: string): Promise<Staff> {
    const doc = await this.repo.findById(id)
    if (!doc) throw new NotFoundException(`Staff member not found: ${id}`)
    return doc
  }

  create(dto: CreateStaffDto): Promise<Staff> {
    return this.repo.create(dto)
  }

  async update(id: string, dto: UpdateStaffDto): Promise<Staff> {
    const doc = await this.repo.update(id, dto)
    if (!doc) throw new NotFoundException(`Staff member not found: ${id}`)
    return doc
  }

  async updatePhoto(id: string, photoUrl: string): Promise<Staff> {
    const doc = await this.repo.updatePhoto(id, photoUrl)
    if (!doc) throw new NotFoundException(`Staff member not found: ${id}`)
    return doc
  }

  async getStats(): Promise<StaffStatsResponse> {
    const [statusCounts, deptCounts, pendingLeaves, openJobs, total] = await Promise.all([
      this.repo.countByStatus(),
      this.repo.countByDepartment(),
      this.repo.countPendingLeaves(),
      this.repo.countOpenJobs(),
      this.repo.findAll({ page: 1, limit: 1 }).then((r) => r.total),
    ])

    const byStatus = Object.fromEntries(statusCounts.map((s) => [s._id, s.count])) as Record<string, number>
    const byDepartment = Object.fromEntries(deptCounts.map((d) => [d._id, d.count])) as Record<string, number>

    return {
      total,
      active: byStatus['active'] ?? 0,
      onLeave: byStatus['on-leave'] ?? 0,
      resigned: byStatus['resigned'] ?? 0,
      pendingLeaves,
      openJobs,
      byDepartment,
    }
  }

  // ── Leaves ─────────────────────────────────────────────────────────────────

  getLeaves(query: QueryLeavesDto): Promise<LeaveApplication[]> {
    const filter: FilterQuery<LeaveApplicationDocument> = {}
    if (query.staffId) filter.staffId = query.staffId
    if (query.leaveType) filter.leaveType = query.leaveType
    if (query.status) filter.status = query.status
    if (query.from || query.to) {
      filter.fromDate = {}
      if (query.from) filter.fromDate.$gte = query.from
      if (query.to) filter.fromDate.$lte = query.to
    }
    return this.repo.findLeaves(filter)
  }

  submitLeave(dto: CreateLeaveApplicationDto): Promise<LeaveApplication> {
    return this.repo.createLeave(dto)
  }

  async approveOrRejectLeave(id: string, dto: UpdateLeaveStatusDto, approvedBy: string): Promise<LeaveApplication> {
    const doc = await this.repo.updateLeaveStatus(id, dto, approvedBy)
    if (!doc) throw new NotFoundException(`Leave application not found: ${id}`)
    return doc
  }

  async cancelLeave(id: string): Promise<{ message: string }> {
    const doc = await this.repo.deleteLeave(id)
    if (!doc) throw new NotFoundException(`Leave application not found: ${id}`)
    return { message: 'Leave application cancelled.' }
  }

  // ── Evaluations ────────────────────────────────────────────────────────────

  getEvaluations(staffId?: string): Promise<StaffEvaluation[]> {
    return this.repo.findEvaluations(staffId)
  }

  createEvaluation(dto: CreateEvaluationDto): Promise<StaffEvaluation> {
    return this.repo.createEvaluation(dto)
  }

  // ── Recruitment ────────────────────────────────────────────────────────────

  getJobs(): Promise<JobPosting[]> {
    return this.repo.findJobs()
  }

  async getJobById(id: string): Promise<JobPosting> {
    const doc = await this.repo.findJobById(id)
    if (!doc) throw new NotFoundException(`Job posting not found: ${id}`)
    return doc
  }

  createJob(dto: CreateJobPostingDto): Promise<JobPosting> {
    return this.repo.createJob(dto)
  }

  async updateJob(id: string, dto: UpdateJobPostingDto): Promise<JobPosting> {
    const doc = await this.repo.updateJob(id, dto)
    if (!doc) throw new NotFoundException(`Job posting not found: ${id}`)
    return doc
  }

  getApplicants(jobId: string): Promise<JobApplicant[]> {
    return this.repo.findApplicants(jobId)
  }

  createApplicant(dto: CreateJobApplicantDto): Promise<JobApplicant> {
    return this.repo.createApplicant(dto)
  }

  async updateApplicantStatus(id: string, dto: UpdateApplicantStatusDto): Promise<JobApplicant> {
    const doc = await this.repo.updateApplicantStatus(id, dto)
    if (!doc) throw new NotFoundException(`Applicant not found: ${id}`)
    return doc
  }
}
