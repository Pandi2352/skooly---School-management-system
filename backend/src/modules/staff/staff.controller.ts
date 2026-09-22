import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiErrors } from '../../common/decorators/api-envelope.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { StaffService } from './staff.service'
import { CreateStaffDto } from './dto/create-staff.dto'
import { UpdateStaffDto } from './dto/update-staff.dto'
import { QueryStaffDto } from './dto/query-staff.dto'
import { CreateLeaveApplicationDto, QueryLeavesDto, UpdateLeaveStatusDto } from './dto/leave.dto'
import { CreateEvaluationDto } from './dto/evaluation.dto'
import {
  CreateJobApplicantDto,
  CreateJobPostingDto,
  UpdateApplicantStatusDto,
  UpdateJobPostingDto,
} from './dto/recruitment.dto'
import {
  EVALUATION_PERMISSIONS,
  LEAVE_PERMISSIONS,
  RECRUITMENT_PERMISSIONS,
  STAFF_PERMISSIONS,
} from './constants/staff.constants'
import type {
  JobApplicant,
  JobPosting,
  LeaveApplication,
  PaginatedStaffResponse,
  Staff,
  StaffEvaluation,
  StaffStatsResponse,
} from './dto/staff-response.dto'

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  // ── Staff ──────────────────────────────────────────────────────────────────

  @Get()
  @RequirePermissions(STAFF_PERMISSIONS.view)
  @ApiOperation({ summary: 'List staff members' })
  list(@Query() query: QueryStaffDto): Promise<PaginatedStaffResponse> {
    return this.service.list(query)
  }

  @Get('stats')
  @RequirePermissions(STAFF_PERMISSIONS.view)
  @ApiOperation({ summary: 'Staff dashboard KPIs' })
  getStats(): Promise<StaffStatsResponse> {
    return this.service.getStats()
  }

  @Get(':id')
  @RequirePermissions(STAFF_PERMISSIONS.view)
  @ApiOperation({ summary: 'Get full staff profile' })
  @ApiErrors(HttpStatus.NOT_FOUND)
  getById(@Param('id') id: string): Promise<Staff> {
    return this.service.getById(id)
  }

  @Post()
  @RequirePermissions(STAFF_PERMISSIONS.create)
  @ApiOperation({ summary: 'Create a new staff member' })
  create(@Body() dto: CreateStaffDto): Promise<Staff> {
    return this.service.create(dto)
  }

  @Patch(':id')
  @RequirePermissions(STAFF_PERMISSIONS.edit)
  @ApiOperation({ summary: 'Update staff profile' })
  @ApiErrors(HttpStatus.NOT_FOUND)
  update(@Param('id') id: string, @Body() dto: UpdateStaffDto): Promise<Staff> {
    return this.service.update(id, dto)
  }

  @Patch(':id/photo')
  @RequirePermissions(STAFF_PERMISSIONS.edit)
  @ApiOperation({ summary: 'Update staff photo URL' })
  updatePhoto(@Param('id') id: string, @Body('photoUrl') photoUrl: string): Promise<Staff> {
    return this.service.updatePhoto(id, photoUrl)
  }

  // ── Leaves ─────────────────────────────────────────────────────────────────

  @Get('leaves')
  @RequirePermissions(LEAVE_PERMISSIONS.view)
  @ApiOperation({ summary: 'List leave applications' })
  getLeaves(@Query() query: QueryLeavesDto): Promise<LeaveApplication[]> {
    return this.service.getLeaves(query)
  }

  @Post('leaves')
  @RequirePermissions(LEAVE_PERMISSIONS.create)
  @ApiOperation({ summary: 'Submit a leave application' })
  submitLeave(@Body() dto: CreateLeaveApplicationDto): Promise<LeaveApplication> {
    return this.service.submitLeave(dto)
  }

  @Patch('leaves/:id/status')
  @RequirePermissions(LEAVE_PERMISSIONS.edit)
  @ApiOperation({ summary: 'Approve or reject a leave application' })
  @ApiErrors(HttpStatus.NOT_FOUND)
  updateLeaveStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveStatusDto,
    @CurrentUser() user: AuthenticatedUserContext,
  ): Promise<LeaveApplication> {
    return this.service.approveOrRejectLeave(id, dto, user.id)
  }

  @Delete('leaves/:id')
  @RequirePermissions(LEAVE_PERMISSIONS.delete)
  @ApiOperation({ summary: 'Cancel a leave application' })
  @ApiErrors(HttpStatus.NOT_FOUND)
  cancelLeave(@Param('id') id: string): Promise<{ message: string }> {
    return this.service.cancelLeave(id)
  }

  // ── Evaluations ────────────────────────────────────────────────────────────

  @Get('evaluations')
  @RequirePermissions(EVALUATION_PERMISSIONS.view)
  @ApiOperation({ summary: 'List evaluations (all or by staffId)' })
  getEvaluations(@Query('staffId') staffId?: string): Promise<StaffEvaluation[]> {
    return this.service.getEvaluations(staffId)
  }

  @Post('evaluations')
  @RequirePermissions(EVALUATION_PERMISSIONS.create)
  @ApiOperation({ summary: 'Submit a staff evaluation' })
  createEvaluation(@Body() dto: CreateEvaluationDto): Promise<StaffEvaluation> {
    return this.service.createEvaluation(dto)
  }

  // ── Recruitment ────────────────────────────────────────────────────────────

  @Get('recruitment/jobs')
  @RequirePermissions(RECRUITMENT_PERMISSIONS.view)
  @ApiOperation({ summary: 'List job postings' })
  getJobs(): Promise<JobPosting[]> {
    return this.service.getJobs()
  }

  @Post('recruitment/jobs')
  @RequirePermissions(RECRUITMENT_PERMISSIONS.create)
  @ApiOperation({ summary: 'Create a job posting' })
  createJob(@Body() dto: CreateJobPostingDto): Promise<JobPosting> {
    return this.service.createJob(dto)
  }

  @Patch('recruitment/jobs/:id')
  @RequirePermissions(RECRUITMENT_PERMISSIONS.edit)
  @ApiOperation({ summary: 'Update a job posting' })
  @ApiErrors(HttpStatus.NOT_FOUND)
  updateJob(@Param('id') id: string, @Body() dto: UpdateJobPostingDto): Promise<JobPosting> {
    return this.service.updateJob(id, dto)
  }

  @Get('recruitment/jobs/:jobId/applicants')
  @RequirePermissions(RECRUITMENT_PERMISSIONS.view)
  @ApiOperation({ summary: 'List applicants for a job posting' })
  getApplicants(@Param('jobId') jobId: string): Promise<JobApplicant[]> {
    return this.service.getApplicants(jobId)
  }

  @Post('recruitment/applicants')
  @RequirePermissions(RECRUITMENT_PERMISSIONS.create)
  @ApiOperation({ summary: 'Add a job applicant' })
  createApplicant(@Body() dto: CreateJobApplicantDto): Promise<JobApplicant> {
    return this.service.createApplicant(dto)
  }

  @Patch('recruitment/applicants/:id/status')
  @RequirePermissions(RECRUITMENT_PERMISSIONS.edit)
  @ApiOperation({ summary: 'Update applicant pipeline status' })
  @ApiErrors(HttpStatus.NOT_FOUND)
  updateApplicantStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicantStatusDto,
  ): Promise<JobApplicant> {
    return this.service.updateApplicantStatus(id, dto)
  }
}
