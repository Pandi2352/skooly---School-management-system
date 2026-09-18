import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { generateUuid } from '../utils/uuid.util'
import { FileStorage, SaveFileInput, StoredFile, UPLOADS_ROUTE } from './file-storage.interface'

const SAFE_FOLDER = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/
const SAFE_KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*\/[0-9a-f-]{36}\.[a-z0-9]{2,5}$/
const SAFE_EXTENSION = /^[a-z0-9]{2,5}$/

/**
 * Stores files on local disk under UPLOAD_DIR with generated UUID names. File names never come from
 * user input, and every key is checked to stay inside the upload folder (no path traversal).
 */
@Injectable()
export class LocalFileStorage implements FileStorage {
  private readonly root: string
  private readonly baseUrl: string

  constructor(configService: ConfigService) {
    this.root = resolve(configService.get<string>('app.uploadDir') ?? 'uploads')
    this.baseUrl = configService.get<string>('app.publicBaseUrl') ?? ''
  }

  async save({ buffer, folder, extension }: SaveFileInput): Promise<StoredFile> {
    if (!SAFE_FOLDER.test(folder)) throw new Error(`Unsafe storage folder "${folder}"`)
    if (!SAFE_EXTENSION.test(extension)) throw new Error(`Unsafe file extension "${extension}"`)

    const key = `${folder}/${generateUuid()}.${extension}`
    const target = this.pathFor(key)
    await mkdir(dirname(target), { recursive: true })
    // 'wx' fails instead of overwriting, which a UUID name should never need.
    await writeFile(target, buffer, { flag: 'wx' })
    return { key }
  }

  async remove(key: string): Promise<void> {
    await rm(this.pathFor(key), { force: true })
  }

  publicUrl(key: string): string {
    return `${this.baseUrl}${UPLOADS_ROUTE}/${key}`
  }

  private pathFor(key: string): string {
    if (!SAFE_KEY.test(key)) throw new Error(`Unsafe storage key "${key}"`)
    const target = resolve(this.root, key)
    if (!target.startsWith(this.root + sep)) throw new Error(`Storage key "${key}" escapes the upload folder`)
    return target
  }
}
