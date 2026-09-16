import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { isValidUuid } from './common/utils/uuid.util'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('health check', () => {
    it('should return health status with valid UUID', () => {
      const response = appController.getHealth()
      expect(response).toBeDefined()
      expect(response.status).toBe('ok')
      expect(response.primaryKeyType).toBe('UUIDv4 (No ObjectId)')
      expect(isValidUuid(response.sampleUuid)).toBe(true)
    })
  })
})
