import { Test, TestingModule } from '@nestjs/testing'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'

describe('RolesController', () => {
  let controller: RolesController

  const mockRole = {
    _id: 'teacher-uuid',
    name: 'Teacher',
    description: 'Faculty staff member',
    kind: 'system',
    fullAccess: false,
    permissions: ['academics:view'],
  }

  const mockRolesService = {
    findAll: jest.fn().mockResolvedValue([mockRole]),
    findOne: jest.fn().mockResolvedValue(mockRole),
    create: jest.fn().mockResolvedValue(mockRole),
    update: jest.fn().mockResolvedValue(mockRole),
    updatePermissions: jest.fn().mockResolvedValue(mockRole),
    remove: jest.fn().mockResolvedValue({ success: true, message: 'Deleted' }),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile()

    controller = module.get<RolesController>(RolesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('findAll should delegate to service', async () => {
    const result = await controller.findAll()
    expect(result).toEqual([mockRole])
    expect(mockRolesService.findAll).toHaveBeenCalledTimes(1)
  })

  it('findOne should delegate to service', async () => {
    const result = await controller.findOne('teacher-uuid')
    expect(result).toEqual(mockRole)
    expect(mockRolesService.findOne).toHaveBeenCalledWith('teacher-uuid')
  })

  it('create should delegate to service', async () => {
    const dto = { name: 'Lab Assistant', description: 'Assists in computer lab' }
    await controller.create(dto)
    expect(mockRolesService.create).toHaveBeenCalledWith(dto)
  })

  it('update should delegate to service', async () => {
    const dto = { description: 'Updated description' }
    await controller.update('teacher-uuid', dto)
    expect(mockRolesService.update).toHaveBeenCalledWith('teacher-uuid', dto)
  })

  it('updatePermissions should delegate to service', async () => {
    const dto = { permissions: ['attendance:view'] }
    await controller.updatePermissions('teacher-uuid', dto)
    expect(mockRolesService.updatePermissions).toHaveBeenCalledWith('teacher-uuid', dto)
  })

  it('remove should delegate to service', async () => {
    const result = await controller.remove('custom-id')
    expect(result.success).toBe(true)
    expect(mockRolesService.remove).toHaveBeenCalledWith('custom-id')
  })
})
