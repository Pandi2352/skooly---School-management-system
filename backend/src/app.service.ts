import { Injectable } from '@nestjs/common'
import { generateUuid } from './common/utils/uuid.util'

@Injectable()
export class AppService {
  getHealthStatus() {
    return {
      status: 'ok',
      service: 'skooly-erp-backend',
      timestamp: new Date().toISOString(),
      sampleUuid: generateUuid(),
      architecture: 'single-institution-erp',
      primaryKeyType: 'UUIDv4 (No ObjectId)',
    }
  }
}
