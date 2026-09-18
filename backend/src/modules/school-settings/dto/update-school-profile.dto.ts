import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator'

export class UpdateSchoolProfileDto {
  @ApiProperty({ description: 'Full school name', example: 'Skooly International Academy' })
  @IsString()
  @IsNotEmpty({ message: 'Enter the school’s full name' })
  @MaxLength(120, { message: 'Use 120 characters or fewer' })
  schoolName: string

  @ApiProperty({ description: 'Short abbreviation for the school', example: 'SIA', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(10, { message: 'Use 10 characters or fewer' })
  shortName?: string

  @ApiProperty({ description: 'School administrative contact email', example: 'office@skooly.edu' })
  @IsEmail({}, { message: 'Enter a valid email address, like office@school.in' })
  email: string

  @ApiProperty({ description: 'School contact phone', example: '+91 98765 43210', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^$|^\+?[\d\s-]{7,16}$/, { message: 'Enter a valid phone number, like +91 98765 43210' })
  phone?: string

  @ApiProperty({ description: 'Head of Institution / Principal name', example: 'Dr. Arthur Pendelton', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(80, { message: 'Use 80 characters or fewer' })
  principalName?: string

  @ApiProperty({ description: 'Country code (ISO-2)', example: 'IN' })
  @IsString()
  @IsNotEmpty({ message: 'Choose a country' })
  country: string

  @ApiProperty({ description: 'School physical street and postal address', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(300, { message: 'Use 300 characters or fewer' })
  address?: string
}
