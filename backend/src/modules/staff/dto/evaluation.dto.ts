import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator'

export class EvaluationScoresDto {
  @ApiProperty({ example: 4 }) @IsNumber() @Min(1) @Max(5) subjectKnowledge: number
  @ApiProperty({ example: 4 }) @IsNumber() @Min(1) @Max(5) classroomManagement: number
  @ApiProperty({ example: 3 }) @IsNumber() @Min(1) @Max(5) communication: number
  @ApiProperty({ example: 4 }) @IsNumber() @Min(1) @Max(5) punctuality: number
  @ApiProperty({ example: 5 }) @IsNumber() @Min(1) @Max(5) teamwork: number
}

export class CreateEvaluationDto {
  @ApiProperty({ example: 'uuid-of-staff' }) @IsString() staffId: string
  @ApiPropertyOptional({ example: 'uuid-of-evaluator' }) @IsOptional() @IsString() evaluatorId?: string
  @ApiProperty({ example: 'Principal' }) @IsString() evaluatorRole: string
  @ApiProperty({ example: 'Annual 2025-26' }) @IsString() period: string
  @ApiProperty() @ValidateNested() @Type(() => EvaluationScoresDto) scores: EvaluationScoresDto
  @ApiProperty({ example: 4.0 }) @IsNumber() @Min(1) @Max(5) overallRating: number
  @ApiPropertyOptional() @IsOptional() @IsString() comments?: string
}
