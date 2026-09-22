import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import {
  DEPARTMENTS,
  EMPLOYMENT_STATUSES,
  EMPLOYMENT_TYPES,
  type Department,
  type EmploymentStatus,
  type EmploymentType,
} from '../constants/staff.constants'

export class QualificationDto {
  @ApiProperty({ example: 'B.Ed.' }) @IsString() degree: string
  @ApiProperty({ example: 'Bangalore University' }) @IsString() institution: string
  @ApiProperty({ example: '2010' }) @IsString() year: string
  @ApiPropertyOptional({ example: 'First Class' }) @IsOptional() @IsString() grade?: string
}

export class ExperienceDto {
  @ApiProperty({ example: 'DPS Pune' }) @IsString() institution: string
  @ApiProperty({ example: 'Maths Teacher' }) @IsString() designation: string
  @ApiProperty({ example: '2012-06-01' }) @IsString() from: string
  @ApiPropertyOptional({ example: '2018-03-31' }) @IsOptional() @IsString() to?: string
  @ApiPropertyOptional({ example: false }) @IsOptional() @IsBoolean() isCurrent?: boolean
}

export class PersonalInfoDto {
  @ApiProperty({ example: 'Priya' }) @IsString() firstName: string
  @ApiPropertyOptional() @IsOptional() @IsString() middleName?: string
  @ApiProperty({ example: 'Sharma' }) @IsString() lastName: string
  @ApiProperty({ example: '1988-03-15' }) @IsString() dateOfBirth: string
  @ApiProperty({ example: 'female' }) @IsString() gender: string
  @ApiPropertyOptional({ example: 'B+' }) @IsOptional() @IsString() bloodGroup?: string
  @ApiPropertyOptional() @IsOptional() @IsString() aadhaarNumber?: string
  @ApiPropertyOptional() @IsOptional() @IsString() panNumber?: string
  @ApiPropertyOptional() @IsOptional() @IsString() religion?: string
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string
}

export class ContactInfoDto {
  @ApiProperty({ example: '+91 98450 11223' }) @IsString() phone: string
  @ApiPropertyOptional() @IsOptional() @IsString() altPhone?: string
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string
}

export class EmploymentDto {
  @ApiProperty({ example: 'EMP-0001' }) @IsString() employeeId: string
  @ApiProperty({ example: 'Mathematics Teacher' }) @IsString() designation: string
  @ApiProperty({ example: 'Secondary', enum: DEPARTMENTS }) @IsIn(DEPARTMENTS) department: Department
  @ApiProperty({ example: '2018-06-01' }) @IsString() dateOfJoining: string
  @ApiProperty({ enum: EMPLOYMENT_TYPES }) @IsIn(EMPLOYMENT_TYPES) employmentType: EmploymentType
  @ApiProperty({ enum: EMPLOYMENT_STATUSES }) @IsIn(EMPLOYMENT_STATUSES) status: EmploymentStatus
  @ApiPropertyOptional({ example: 4500000 }) @IsOptional() @IsNumber() @Min(0) salaryPaise?: number
  @ApiPropertyOptional() @IsOptional() @IsString() reportingTo?: string
  @ApiPropertyOptional() @IsOptional() @IsString() dateOfLeaving?: string
}

export class LeaveBalanceDto {
  @ApiPropertyOptional({ example: 12 }) @IsOptional() @IsNumber() @Min(0) casual?: number
  @ApiPropertyOptional({ example: 12 }) @IsOptional() @IsNumber() @Min(0) medical?: number
  @ApiPropertyOptional({ example: 15 }) @IsOptional() @IsNumber() @Min(0) earned?: number
  @ApiPropertyOptional({ example: 90 }) @IsOptional() @IsNumber() @Min(0) maternity?: number
  @ApiPropertyOptional({ example: 15 }) @IsOptional() @IsNumber() @Min(0) paternity?: number
}

export class CreateStaffDto {
  @ApiProperty() @ValidateNested() @Type(() => PersonalInfoDto) personalInfo: PersonalInfoDto
  @ApiProperty() @ValidateNested() @Type(() => ContactInfoDto) contactInfo: ContactInfoDto
  @ApiProperty() @ValidateNested() @Type(() => EmploymentDto) employment: EmploymentDto
  @ApiPropertyOptional({ type: [QualificationDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => QualificationDto)
  qualifications?: QualificationDto[]
  @ApiPropertyOptional({ type: [ExperienceDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ExperienceDto)
  experience?: ExperienceDto[]
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => LeaveBalanceDto) leaveBalance?: LeaveBalanceDto
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) subjects?: string[]
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) classes?: string[]
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string
}
