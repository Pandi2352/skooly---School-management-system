import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Student, StudentSchema } from '../students/schemas/student.schema'
import { User, UserSchema } from '../users/schemas/user.schema'
import { DataTransferController } from './data-transfer.controller'
import { DataTransferService } from './data-transfer.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DataTransferController],
  providers: [DataTransferService],
  exports: [DataTransferService],
})
export class DataTransferModule {}
