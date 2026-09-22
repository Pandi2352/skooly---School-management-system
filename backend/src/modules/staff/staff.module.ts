import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { StaffController } from './staff.controller'
import { StaffRepository } from './staff.repository'
import { StaffService } from './staff.service'
import { Staff, StaffSchema } from './schemas/staff.schema'
import { LeaveApplication, LeaveApplicationSchema } from './schemas/leave-application.schema'
import { StaffEvaluation, StaffEvaluationSchema } from './schemas/evaluation.schema'
import { JobPosting, JobPostingSchema } from './schemas/job-posting.schema'
import { JobApplicant, JobApplicantSchema } from './schemas/job-applicant.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Staff.name, schema: StaffSchema },
      { name: LeaveApplication.name, schema: LeaveApplicationSchema },
      { name: StaffEvaluation.name, schema: StaffEvaluationSchema },
      { name: JobPosting.name, schema: JobPostingSchema },
      { name: JobApplicant.name, schema: JobApplicantSchema },
    ]),
  ],
  controllers: [StaffController],
  providers: [StaffRepository, StaffService],
  exports: [StaffService, StaffRepository],
})
export class StaffModule {}
