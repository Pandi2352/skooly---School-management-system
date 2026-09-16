import { ACCEPTED_IMAGE_TYPES } from '../constants'

/** Returns what's wrong with the file, or null when it can be used. */
export function validateImageFile(file: { type: string; size: number }, maxBytes: number) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Choose a PNG, JPG, SVG or WebP image.'
  if (file.size > maxBytes) {
    return `Choose an image smaller than ${Math.round(maxBytes / 1024 / 1024)} MB.`
  }
  return null
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('The file couldn’t be read.'))
    }
    reader.onerror = () => {
      reject(reader.error ?? new Error('The file couldn’t be read.'))
    }
    reader.readAsDataURL(file)
  })
}
