import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import type { EntityType, TemplateColumn } from '../constants/data-transfer.constants'

export class PreviewImportDto {
  @ApiProperty({ enum: ['students', 'parents', 'staff'], description: 'Entity to import' })
  @IsEnum(['students', 'parents', 'staff'])
  entityType: EntityType

  @ApiProperty({ type: [Object], description: 'Array of mapped record objects to validate' })
  @IsArray()
  records: Record<string, unknown>[]
}

export class CommitImportOptionsDto {
  @ApiPropertyOptional({ default: true, description: 'Skip duplicate entries instead of aborting' })
  @IsOptional()
  skipDuplicates?: boolean
}

export class CommitImportDto {
  @ApiProperty({ enum: ['students', 'parents', 'staff'], description: 'Entity to import' })
  @IsEnum(['students', 'parents', 'staff'])
  entityType: EntityType

  @ApiProperty({ type: [Object], description: 'Array of mapped record objects to commit' })
  @IsArray()
  records: Record<string, unknown>[]

  @ApiPropertyOptional({ type: CommitImportOptionsDto })
  @IsOptional()
  options?: CommitImportOptionsDto
}

export class ImportRowErrorDto {
  @ApiProperty({ example: 3, description: '1-indexed row number from the import file' })
  rowNumber: number

  @ApiPropertyOptional({ example: 'grade', description: 'Field name triggering the error' })
  field?: string

  @ApiProperty({ example: 'Grade must be a number between 1 and 12', description: 'Error explanation' })
  message: string
}

export class ImportPreviewResponseDto {
  @ApiProperty()
  totalCount: number

  @ApiProperty()
  validCount: number

  @ApiProperty()
  invalidCount: number

  @ApiProperty({ type: [ImportRowErrorDto] })
  errors: ImportRowErrorDto[]

  @ApiProperty({ type: [Object] })
  previewItems: Record<string, unknown>[]
}

export class CommitImportResponseDto {
  @ApiProperty()
  success: boolean

  @ApiProperty()
  insertedCount: number

  @ApiProperty()
  failedCount: number

  @ApiProperty({ type: [ImportRowErrorDto] })
  errors: ImportRowErrorDto[]

  @ApiProperty()
  message: string
}

export class ExportQueryDto {
  @ApiPropertyOptional({ description: 'Optional grade filter' })
  @IsOptional()
  @IsNumber()
  grade?: number

  @ApiPropertyOptional({ description: 'Optional section filter' })
  @IsOptional()
  @IsString()
  section?: string

  @ApiPropertyOptional({ description: 'Optional status filter' })
  @IsOptional()
  @IsString()
  status?: string
}

export class TemplateResponseDto {
  @ApiProperty()
  entityType: EntityType

  @ApiProperty({ type: [Object] })
  columns: TemplateColumn[]

  @ApiProperty({ type: [Object] })
  sampleRows: Record<string, unknown>[]
}
