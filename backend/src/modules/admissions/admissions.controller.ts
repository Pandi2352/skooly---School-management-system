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
import { ApiErrors, ApiSuccess } from '../../common/decorators/api-envelope.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe'
import { ADMISSION_PERMISSIONS } from './constants/admissions.constants'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import { AdmissionsService } from './admissions.service'
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto'
import {
  AdmissionApplicationResponseDto,
  AdmissionStatsResponseDto,
  PaginatedAdmissionsResponseDto,
} from './dto/admissions-response.dto'
import { QueryAdmissionsDto } from './dto/query-admissions.dto'
import { UpdateAdmissionApplicationDto } from './dto/update-admission-application.dto'
import { EnrollApplicantDto, UpdateAdmissionStatusDto } from './dto/update-admission-status.dto'

@ApiTags('Admissions')
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly service: AdmissionsService) {}

  @Get()
  @RequirePermissions(ADMISSION_PERMISSIONS.view)
  @ResponseMessage('Admissions applications fetched successfully.')
  @ApiOperation({ summary: 'List admission applications', description: 'Returns filtered and paginated admission applications.' })
  @ApiSuccess(PaginatedAdmissionsResponseDto, { description: 'Paginated admission applications' })
  list(@Query() query: QueryAdmissionsDto): Promise<PaginatedAdmissionsResponseDto> {
    return this.service.list(query)
  }

  @Get('stats')
  @RequirePermissions(ADMISSION_PERMISSIONS.view)
  @ResponseMessage('Admissions pipeline statistics fetched successfully.')
  @ApiOperation({ summary: 'Get admission pipeline statistics', description: 'Returns aggregate counts of applications by status.' })
  @ApiSuccess(AdmissionStatsResponseDto, { description: 'Admission statistics' })
  getStats(): Promise<AdmissionStatsResponseDto> {
    return this.service.getStats()
  }

  @Get(':id')
  @RequirePermissions(ADMISSION_PERMISSIONS.view)
  @ResponseMessage('Admission application details fetched successfully.')
  @ApiOperation({ summary: 'Get single admission application', description: 'Returns full demographic and document details.' })
  @ApiSuccess(AdmissionApplicationResponseDto, { description: 'Admission application' })
  @ApiErrors(HttpStatus.NOT_FOUND)
  getById(@Param('id') id: string): Promise<AdmissionApplicationResponseDto> {
    return this.service.getById(id)
  }

  @Post()
  @RequirePermissions(ADMISSION_PERMISSIONS.create)
  @ResponseMessage('Admission application submitted successfully.')
  @ApiOperation({ summary: 'Submit new admission application', description: 'Creates a new admission application.' })
  @ApiSuccess(AdmissionApplicationResponseDto, { description: 'Created admission application' })
  @ApiErrors(HttpStatus.BAD_REQUEST)
  create(@Body() dto: CreateAdmissionApplicationDto): Promise<AdmissionApplicationResponseDto> {
    return this.service.create(dto)
  }

  @Patch(':id/status')
  @RequirePermissions(ADMISSION_PERMISSIONS.edit)
  @ResponseMessage('Admission application status updated successfully.')
  @ApiOperation({ summary: 'Update application status', description: 'Approves, reviews, or rejects an application with notes.' })
  @ApiSuccess(AdmissionApplicationResponseDto, { description: 'Updated admission application' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAdmissionStatusDto,
  ): Promise<AdmissionApplicationResponseDto> {
    return this.service.updateStatus(id, dto)
  }

  @Patch(':id')
  @RequirePermissions(ADMISSION_PERMISSIONS.edit)
  @ResponseMessage('Application updated successfully.')
  @ApiOperation({
    summary: 'Correct an application’s details',
    description: 'Name, grade, previous school and parent contact. Status and enrolment have their own endpoints.',
  })
  @ApiSuccess(AdmissionApplicationResponseDto, { description: 'The corrected application' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND)
  updateDetails(
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: UpdateAdmissionApplicationDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<AdmissionApplicationResponseDto> {
    return this.service.updateDetails(id, dto, actor)
  }

  @Delete(':id')
  @RequirePermissions(ADMISSION_PERMISSIONS.delete)
  @ResponseMessage('Application deleted successfully.')
  @ApiOperation({
    summary: 'Delete an application',
    description: 'For a duplicate or a test entry. An enrolled application can’t be deleted: a student record points back to it.',
  })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<{ id: string; applicationNo: string }> {
    return this.service.remove(id, actor)
  }

  @Post(':id/enroll')
  @RequirePermissions(ADMISSION_PERMISSIONS.edit)
  @ResponseMessage('Applicant enrolled as student successfully.')
  @ApiOperation({ summary: 'Enroll approved applicant', description: 'Converts applicant into an active student record.' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND)
  enroll(
    @Param('id') id: string,
    @Body() dto: EnrollApplicantDto,
  ): Promise<{ application: AdmissionApplicationResponseDto; studentId: string }> {
    return this.service.enroll(id, dto)
  }
}
