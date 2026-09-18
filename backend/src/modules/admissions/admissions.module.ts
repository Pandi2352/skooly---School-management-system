import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Student, StudentSchema } from '../students/schemas/student.schema'
import { AdmissionsController } from './admissions.controller'
import { AdmissionsRepository } from './admissions.repository'
import { AdmissionsService } from './admissions.service'
import {
  AdmissionApplication,
  AdmissionApplicationSchema,
} from './schemas/admission-application.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdmissionApplication.name, schema: AdmissionApplicationSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [AdmissionsController],
  providers: [AdmissionsRepository, AdmissionsService],
  exports: [AdmissionsService, AdmissionsRepository],
})
export class AdmissionsModule {}
