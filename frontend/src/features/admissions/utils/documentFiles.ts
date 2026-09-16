import { ACCEPTED_DOCUMENT_TYPES, DOCUMENT_MAX_BYTES } from '../constants'

/** What's wrong with the file, or null when it can be used. */
export function validateDocumentFile(file: { type: string; size: number }) {
  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) return 'Choose a PDF, JPG or PNG file.'
  if (file.size > DOCUMENT_MAX_BYTES) return 'Choose a file smaller than 5 MB.'
  return null
}

export function formatFileSize(bytes: number) {
  const megabytes = bytes / (1024 * 1024)
  return megabytes >= 1
    ? `${megabytes.toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`
}
