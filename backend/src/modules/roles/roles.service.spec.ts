import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { RolesService } from './roles.service'
import { Role } from './schemas/role.schema'

describe('RolesService', () => {
  let service: RolesService

  const mockRoleDocument = {
    _id: 'test-uuid-1',
    name: 'Custom Teacher',
    description: 'Teaches secondary science',
    kind: 'custom',
    fullAccess: false,
    permissions: ['academic-management:view'],
    save: jest.fn().mockImplementation(function () {
      return Promise.resolve(this)
    }),
  }

  const mockRoleModel = {
    countDocuments: jest.fn(),
    insertMany: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getModelToken(Role.name),
          useValue: Object.assign(
            jest.fn().mockImplementation((dto) => ({
              ...dto,
              save: jest.fn().mockResolvedValue(dto),
            })),
            mockRoleModel,
          ),
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
      mockRoleModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      })
      mockRoleModel.insertMany.mockResolvedValue([])

      await service.seedDefaultRolesIfEmpty()

      expect(mockRoleModel.countDocuments).toHaveBeenCalled()
      expect(mockRoleModel.insertMany).toHaveBeenCalled()
    })

    it('should not seed default system roles when DB has documents', async () => {
      mockRoleModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(5),
      })

      await service.seedDefaultRolesIfEmpty()

      expect(mockRoleModel.countDocuments).toHaveBeenCalled()
      expect(mockRoleModel.insertMany).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return a list of roles ordered by kind and name', async () => {
      const roles = [mockRoleDocument]
      mockRoleModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(roles),
        }),
      })

      const result = await service.findAll()
      expect(result).toEqual(roles)
    })
  })

  describe('findOne', () => {
    it('should return role when found', async () => {
      mockRoleModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRoleDocument),
      })

      const result = await service.findOne('test-uuid-1')
      expect(result).toEqual(mockRoleDocument)
    })

    it('should throw NotFoundException when role is missing', async () => {
      mockRoleModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      })

      await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should throw ConflictException if role name already exists', async () => {
      mockRoleModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRoleDocument),
      })

      await expect(
        service.create({ name: 'Custom Teacher', description: 'desc' }),
      ).rejects.toThrow(ConflictException)
    })

    it('should create and save a new custom role', async () => {
      mockRoleModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      })

      const result = await service.create({
        name: 'Sports Coordinator',
        description: 'Arranges sports events',
      })

      expect(result.name).toBe('Sports Coordinator')
      expect(result.kind).toBe('custom')
    })
  })

  describe('updatePermissions', () => {
    it('should reject editing permissions on fullAccess administrator', async () => {
      mockRoleModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockRoleDocument,
          fullAccess: true,
        }),
      })

      await expect(
        service.updatePermissions('admin-id', { permissions: ['some:perm'] }),
      ).rejects.toThrow(BadRequestException)
    })

    it('should update permissions on non-admin role', async () => {
      const editableRole = {
        ...mockRoleDocument,
        fullAccess: false,
        permissions: [],
        save: jest.fn().mockImplementation(function () {
          return Promise.resolve(this)
        }),
      }
      mockRoleModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(editableRole),
      })

      const result = await service.updatePermissions('test-uuid-1', {
        permissions: ['fees:view', 'fees:view'],
      })

      expect(result.permissions).toEqual(['fees:view'])
    })
  })

  describe('remove', () => {
    it('should reject deleting a system role', async () => {
      mockRoleModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockRoleDocument,
          kind: 'system',
        }),
      })

      await expect(service.remove('admin-id')).rejects.toThrow(BadRequestException)
    })

    it('should delete a custom role', async () => {
      mockRoleModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockRoleDocument,
          kind: 'custom',
        }),
      })
      mockRoleModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      })

      const result = await service.remove('test-uuid-1')
      expect(result.success).toBe(true)
    })
  })
})
