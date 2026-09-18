/** Injection token for the active file storage (local disk today; S3 or similar later). */
export const FILE_STORAGE = Symbol('FILE_STORAGE')

/** Public route that serves locally stored files; see main.ts. */
export const UPLOADS_ROUTE = '/uploads'

export type SaveFileInput = {
  buffer: Buffer
  /** Lower-case folder path like "branding/logo"; letters, digits, hyphens and slashes only. */
  folder: string
  /** Extension without the dot, taken from the detected file type, never from the upload's name. */
  extension: string
  contentType: string
}

export type StoredFile = {
  /** Storage-relative key, e.g. "branding/logo/<uuid>.png". Save this in the database, not the URL. */
  key: string
}

/**
 * Where uploaded files live. Modules depend on this interface only, so swapping local disk for
 * cloud storage means adding one provider, with no module changes.
 */
export interface FileStorage {
  save(input: SaveFileInput): Promise<StoredFile>
  /** Removes a file; succeeds quietly if it's already gone. */
  remove(key: string): Promise<void>
  /** Absolute URL clients use to load the file. */
  publicUrl(key: string): string
}
