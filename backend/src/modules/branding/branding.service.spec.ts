import { HttpStatus } from '@nestjs/common'
import { AppException } from '../../common/exceptions/app.exception'
import { FileStorage } from '../../common/storage/file-storage.interface'
import { BRANDING_ASSET_RULES, BrandingErrorCode } from './constants/branding.constants'
import { BrandingService, validateBrandingImage, type UploadedImageFile } from './branding.service'
import { BrandingAssetRecord, BrandingRecord, BrandingRepository } from './branding.repository'

// A minimal valid 1x1 transparent PNG buffer
const VALID_1X1_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

// A minimal valid 2x1 PNG buffer (not square)
const VALID_2X1_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR42mNk+M/wHwMDAwMACgAC/10cAAAAAElFTkSuQmCC',
  'base64',
)

const mockBrandingRecord: BrandingRecord = {
  _id: 'branding-singleton-id',
  displayName: 'Skooly Academy',
  shortName: 'SA',
  tagline: 'Excellence in Education',
  documentFooter: '© 2026 Skooly Academy',
  colorTheme: 'navy',
  assets: {
    logo: null,
    favicon: null,
    principalSignature: null,
    schoolSeal: null,
    loginBackground: null,
  },
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

describe('BrandingService & validateBrandingImage', () => {
  describe('validateBrandingImage', () => {
    it('throws when file size exceeds maximum bytes', () => {
      const rule = BRANDING_ASSET_RULES.favicon
      const file: UploadedImageFile = {
        buffer: Buffer.alloc(rule.maxBytes + 1),
        size: rule.maxBytes + 1,
        originalname: 'large.png',
      }
      expect(() => validateBrandingImage(rule, file)).toThrow(AppException)
      try {
        validateBrandingImage(rule, file)
      } catch (err) {
        expect((err as AppException).errorCode).toBe(BrandingErrorCode.FILE_TOO_LARGE)
        expect((err as AppException).statusCode).toBe(HttpStatus.PAYLOAD_TOO_LARGE)
      }
    })

    it('throws when file type is unsupported', () => {
      const rule = BRANDING_ASSET_RULES.favicon
      const file: UploadedImageFile = {
        buffer: Buffer.from('plain text content'),
        size: 18,
        originalname: 'text.txt',
      }
      expect(() => validateBrandingImage(rule, file)).toThrow(AppException)
      try {
        validateBrandingImage(rule, file)
      } catch (err) {
        expect((err as AppException).errorCode).toBe(BrandingErrorCode.UNSUPPORTED_FILE)
      }
    })

    it('throws when SVG contains unsafe script tags', () => {
      const rule = BRANDING_ASSET_RULES.logo
      const unsafeSvg = Buffer.from('<svg><script>alert("xss")</script></svg>')
      const file: UploadedImageFile = {
        buffer: unsafeSvg,
        size: unsafeSvg.length,
        originalname: 'malicious.svg',
      }
      expect(() => validateBrandingImage(rule, file)).toThrow(AppException)
      try {
        validateBrandingImage(rule, file)
      } catch (err) {
        expect((err as AppException).errorCode).toBe(BrandingErrorCode.UNSAFE_SVG)
      }
    })

    it('throws when square requirement is violated', () => {
      const rule = { ...BRANDING_ASSET_RULES.favicon, minWidth: 1, minHeight: 1 }
      const file: UploadedImageFile = {
        buffer: VALID_2X1_PNG,
        size: VALID_2X1_PNG.length,
        originalname: 'nonsquare.png',
      }
      expect(() => validateBrandingImage(rule, file)).toThrow(AppException)
      try {
        validateBrandingImage(rule, file)
      } catch (err) {
        expect((err as AppException).errorCode).toBe(BrandingErrorCode.IMAGE_NOT_SQUARE)
      }
    })

    it('validates a correct image successfully', () => {
      const rule = { ...BRANDING_ASSET_RULES.favicon, minWidth: 1, minHeight: 1 }
      const file: UploadedImageFile = {
        buffer: VALID_1X1_PNG,
        size: VALID_1X1_PNG.length,
        originalname: 'valid.png',
      }
      const inspected = validateBrandingImage(rule, file)
      expect(inspected.mimeType).toBe('image/png')
      expect(inspected.width).toBe(1)
      expect(inspected.height).toBe(1)
    })
  })

  describe('BrandingService methods', () => {
    let service: BrandingService
    let mockRepo: jest.Mocked<BrandingRepository>
    let mockStorage: jest.Mocked<FileStorage>

    beforeEach(() => {
      mockRepo = {
        find: jest.fn().mockResolvedValue(mockBrandingRecord),
        ensureExists: jest.fn().mockResolvedValue(mockBrandingRecord),
        update: jest.fn().mockImplementation((changes) =>
          Promise.resolve({ ...mockBrandingRecord, ...changes }),
        ),
        setAsset: jest.fn().mockResolvedValue({
          previous: null,
          updated: mockBrandingRecord,
        }),
      } as unknown as jest.Mocked<BrandingRepository>

      mockStorage = {
        save: jest.fn().mockResolvedValue({ key: 'branding/logo/abc.png', sizeBytes: 100 }),
        remove: jest.fn().mockResolvedValue(undefined),
        publicUrl: jest.fn().mockImplementation((key) => `http://localhost:4000/uploads/${key}`),
      }

      service = new BrandingService(mockRepo, mockStorage)
    })

    it('returns all asset rules', () => {
      const rules = service.getAssetRules()
      expect(rules).toHaveLength(5)
      expect(rules.map((r) => r.type)).toEqual([
        'logo',
        'favicon',
        'principalSignature',
        'schoolSeal',
        'loginBackground',
      ])
    })

    it('retrieves branding and formats response with public URLs', async () => {
      const res = await service.getBranding()
      expect(res.displayName).toBe('Skooly Academy')
      expect(res.shortName).toBe('SA')
      expect(res.colorTheme).toBe('navy')
      expect(mockRepo.find).toHaveBeenCalled()
    })

    it('throws if update DTO is empty', async () => {
      await expect(service.update({})).rejects.toThrow(AppException)
      try {
        await service.update({})
      } catch (err) {
        expect((err as AppException).errorCode).toBe(BrandingErrorCode.NO_CHANGES)
        expect((err as AppException).statusCode).toBe(HttpStatus.BAD_REQUEST)
      }
    })

    it('updates branding fields', async () => {
      const res = await service.update({ displayName: 'New Name' })
      expect(mockRepo.update).toHaveBeenCalledWith({ displayName: 'New Name' })
      expect(res.displayName).toBe('New Name')
    })

    it('removes an asset and deletes the stored file', async () => {
      const existingAsset: BrandingAssetRecord = {
        key: 'branding/favicon/old.png',
        originalName: 'old.png',
        mimeType: 'image/png',
        sizeBytes: 50,
        width: 32,
        height: 32,
        uploadedAt: new Date(),
      }
      mockRepo.setAsset.mockResolvedValueOnce({
        previous: existingAsset,
        updated: { ...mockBrandingRecord, assets: { ...mockBrandingRecord.assets, favicon: null } },
      })

      const res = await service.removeAsset('favicon')
      expect(mockRepo.setAsset).toHaveBeenCalledWith('favicon', null)
      expect(mockStorage.remove).toHaveBeenCalledWith('branding/favicon/old.png')
      expect(res.assets.favicon).toBeNull()
    })

    it('throws if trying to remove an asset that is not set', async () => {
      mockRepo.setAsset.mockResolvedValueOnce({
        previous: null,
        updated: mockBrandingRecord,
      })

      await expect(service.removeAsset('favicon')).rejects.toThrow(AppException)
      try {
        await service.removeAsset('favicon')
      } catch (err) {
        expect((err as AppException).errorCode).toBe(BrandingErrorCode.ASSET_NOT_SET)
        expect((err as AppException).statusCode).toBe(HttpStatus.NOT_FOUND)
      }
    })
  })
})
