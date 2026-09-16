import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class UpdatePermissionsDto {
  @ApiProperty({
    description: 'Complete array of permission keys assigned to this role',
    example: ['academic-management:view', 'student-information:view', 'student-information:create'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  permissions: string[]
}
