import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({
    description: 'Distinctive role title for school staff',
    example: 'Transport Manager',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Enter a role name, like Transport Manager' })
  name: string

  @ApiPropertyOptional({
    description: 'Operational summary of duties assigned to this role',
    example: 'Looks after bus routes, stops, drivers and transport fees.',
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    description: 'Optional ID of an existing role to copy permission defaults from',
    example: 'teacher',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  copyFromRoleId?: string | null
}
