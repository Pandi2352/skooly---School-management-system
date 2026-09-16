import { ApiProperty } from '@nestjs/swagger'

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Operation outcome flag', example: true })
  success: boolean

  @ApiProperty({ description: 'Human-readable message describing the outcome', example: 'Operation completed successfully' })
  message: string

  @ApiProperty({ description: 'Data payload' })
  data: T

  @ApiProperty({ description: 'Server timestamp of response', example: '2026-09-16T12:00:00.000Z' })
  timestamp: string
}
