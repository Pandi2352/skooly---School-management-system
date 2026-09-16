import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service'

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'System health check and UUID generator validation' })
  @ApiResponse({
    status: 200,
    description: 'System operational status and sample UUID',
    schema: {
      example: {
        status: 'ok',
        service: 'skooly-erp-backend',
        timestamp: '2026-09-16T12:00:00.000Z',
        sampleUuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        architecture: 'single-institution-erp',
        primaryKeyType: 'UUIDv4 (No ObjectId)',
      },
    },
  })
  getHealth() {
    return this.appService.getHealthStatus()
  }
}
