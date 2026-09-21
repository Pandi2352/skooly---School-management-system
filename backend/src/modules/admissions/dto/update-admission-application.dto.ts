import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'

const trimmed = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value)

/**
 * Correcting an application: a misheard surname, the wrong grade, a new phone number. Status,
 * documents and enrolment are not here — each has its own endpoint, so a correction can't approve
 * anyone by accident.
 */
export class UpdateAdmissionApplicationDto {
  @ApiPropertyOptional({ example: 'Rohan' })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MinLength(1, { message: 'Enter the applicant’s first name.' })
  @MaxLength(60)
  firstName?: string

  @ApiPropertyOptional({ example: 'Verma' })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MinLength(1, { message: 'Enter the applicant’s last name.' })
  @MaxLength(60)
  lastName?: string

  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Choose the grade applied for.' })
  @Min(1)
  @Max(12)
  gradeApplied?: number

  @ApiPropertyOptional({ example: 'St. Xavier Kindergarten' })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(120)
  previousSchool?: string

  @ApiPropertyOptional({ example: 'Rajesh Verma' })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MinLength(1, { message: 'Enter the parent or guardian’s name.' })
  @MaxLength(80)
  parentName?: string

  @ApiPropertyOptional({ example: '+91 98450 11223' })
  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @MaxLength(20)
  parentPhone?: string

  @ApiPropertyOptional({ example: 'rajesh.verma@example.in' })
  @IsOptional()
  @Transform(trimmed)
  @IsEmail({}, { message: 'Enter a valid email address.' })
  @MaxLength(160)
  parentEmail?: string
}
