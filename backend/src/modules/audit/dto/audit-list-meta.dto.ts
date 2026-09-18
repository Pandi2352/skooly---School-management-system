import { ApiProperty } from '@nestjs/swagger'

export class AuditListMetaDto {
  @ApiProperty({ example: 128, description: 'Events matching the current filters' })
  total: number

  @ApiProperty({ example: 1 })
  page: number

  @ApiProperty({ example: 25 })
  limit: number

  @ApiProperty({ example: 6 })
  totalPages: number

  @ApiProperty({ example: 400, description: 'How many days of history this school keeps' })
  retentionDays: number
}
