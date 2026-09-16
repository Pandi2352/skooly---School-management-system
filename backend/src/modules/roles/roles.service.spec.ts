import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { RolesRepository } from './roles.repository'
import { RolesService } from './roles.service'

describe('RolesService', () => {
  let service: RolesService

  const mockRole = {
    _id: 'test-uuid-1',
    name: 'Custom Teacher',
    description: 'Teaches secondary science',
    kind: 'custom',
    fullAccess: false,
    permissions: ['academic-management:view'],
  }

  const mockRolesRepository = {
    count: jest.fn(),
    insertMany: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findByNameExcludingId: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: RolesRepository,
          useValue: mockRolesRepository,
        },
      ],
    }).compile()

    service = module.get<RolesService>(RolesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('seedDefaultRolesIfEmpty', () => {
    it('should seed default system roles when DB is empty', async () => {
      mockRolesRepository.count.mockResolvedValue(0)
      mockRolesRepository.insertMany.mockResolvedValue([])

      await service.seedDefaultRolesIfEmpty()

      expect(mockRolesRepository.count).toHaveBeenCalled()
      expect(mockRolesRepository.insertMany).toHaveBeenCalled()
    })

    it('should not seed default system roles when DB has documents', async () => {
      mockRolesRepository.count.mockResolvedValue(5)

      await service.seedDefaultRolesIfEmpty()

      expect(mockRolesRepository.count).toHaveBeenCalled()
      expect(mockRolesRepository.insertMany).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return a list of roles', async () => {
      const roles = [mockRole]
      mockRolesRepository.findAll.mockResolvedValue(roles)

      const result = await service.findAll()
      expect(result).toEqual(roles)
    })
  })

  describe('findOne', () => {
    it('should return role when found', async () => {
      mockRolesRepository.findById.mockResolvedValue(mockRole)

      const result = await service.findOne('test-uuid-1')
      expect(result).toEqual(mockRole)
    })

    it('should throw NotFoundException when role is missing', async () => {
      mockRolesRepository.findById.mockResolvedValue(null)

      await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should throw ConflictException if role name already exists', async () => {
      mockRolesRepository.findByName.mockResolvedValue(mockRole)

      await expect(
        service.create({ name: 'Custom Teacher', description: 'desc' }),
      ).rejects.toThrow(ConflictException)
    })

    it('should create and save a new custom role', async () => {
      mockRolesRepository.findByName.mockResolvedValue(null)
      mockRolesRepository.create.mockResolvedValue({
        ...mockRole,
        name: 'Sports Coordinator',
      })

      const result = await service.create({
        name: 'Sports Coordinator',
        description: 'Arranges sports events',
      })

      expect(result.name).toBe('Sports Coordinator')
    })
  })

  describe('updatePermissions', () => {
    it('should reject editing permissions on fullAccess administrator', async () => {
      mockRolesRepository.findById.mockResolvedValue({
        ...mockRole,
        fullAccess: true,
      })

      await expect(
        service.updatePermissions('admin-id', { permissions: ['some:perm'] }),
      ).rejects.toThrow(BadRequestException)
    })

    it('should update permissions on non-admin role', async () => {
      mockRolesRepository.findById.mockResolvedValue({
        ...mockRole,
        fullAccess: false,
      })
      mockRolesRepository.updateById.mockResolvedValue({
        ...mockRole,
        permissions: ['fees:view'],
      })

      const result = await service.updatePermissions('test-uuid-1', {
        permissions: ['fees:view', 'fees:view'],
      })

      expect(result.permissions).toEqual(['fees:view'])
    })
  })

  describe('remove', () => {
    it('should reject deleting a system role', async () => {
      mockRolesRepository.findById.mockResolvedValue({
        ...mockRole,
        kind: 'system',
      })

      await expect(service.remove('admin-id')).rejects.toThrow(BadRequestException)
    })

    it('should delete a custom role', async () => {
      mockRolesRepository.findById.mockResolvedValue({
        ...mockRole,
        kind: 'custom',
      })
      mockRolesRepository.deleteById.mockResolvedValue(true)

      const result = await service.remove('test-uuid-1')
      expect(result.success).toBe(true)
    })
  })
})
