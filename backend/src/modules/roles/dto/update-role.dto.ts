import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateRoleDto {
  @ApiPropertyOptional({
    description: 'Updated name for the role',
    example: 'Senior Librarian',
    minLength: 2,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Role name must have at least 2 characters' })
  name?: string

  @ApiPropertyOptional({
    description: 'Updated operational description',
    example: 'Manages physical books, digital catalog, and issue/return desks.',
  })
  @IsString()
  @IsOptional()
  description?: string
}
