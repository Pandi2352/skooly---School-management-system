/**
 * Identifies an uploaded image from its bytes, never from the file name or the browser's claimed
 * type, and reads its pixel size where the format allows. Supports PNG, JPEG, WebP, ICO and SVG.
 */

export type ImageKind = 'png' | 'jpeg' | 'webp' | 'ico' | 'svg'

export type InspectedImage = {
  kind: ImageKind
  mimeType: string
  extension: string
  /** Null when the size can't be read (for example an SVG without width/height or viewBox). */
  width: number | null
  height: number | null
}

const MIME_TYPES: Record<ImageKind, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
}

const EXTENSIONS: Record<ImageKind, string> = { png: 'png', jpeg: 'jpg', webp: 'webp', ico: 'ico', svg: 'svg' }

function detectKind(buffer: Buffer): ImageKind | null {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'png'
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpeg'
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return 'webp'
  }
  if (buffer.length >= 6 && buffer.readUInt16LE(0) === 0 && buffer.readUInt16LE(2) === 1 && buffer.readUInt16LE(4) > 0) {
    return 'ico'
  }
  const head = buffer.subarray(0, 2048).toString('utf8').replace(/^\uFEFF/, '').trimStart().toLowerCase()
  if ((head.startsWith('<?xml') || head.startsWith('<svg') || head.startsWith('<!--')) && head.includes('<svg')) {
    return 'svg'
  }
  return null
}

function pngSize(buffer: Buffer) {
  return buffer.length >= 24 ? { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) } : null
}

function jpegSize(buffer: Buffer) {
  let offset = 2
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) return null
    const marker = buffer[offset + 1] ?? 0
    const length = buffer.readUInt16BE(offset + 2)
    // SOF0–SOF15 carry the frame size, except DHT (C4), JPG (C8) and DAC (CC).
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
    }
    offset += 2 + length
  }
  return null
}

function webpSize(buffer: Buffer) {
  const chunk = buffer.toString('ascii', 12, 16)
  if (chunk === 'VP8X' && buffer.length >= 30) {
    return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) }
  }
  if (chunk === 'VP8 ' && buffer.length >= 30) {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff }
  }
  if (chunk === 'VP8L' && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  return null
}

function icoSize(buffer: Buffer) {
  if (buffer.length < 8) return null
  // The largest image in the icon decides its size; 0 means 256.
  let best = { width: 0, height: 0 }
  const count = buffer.readUInt16LE(4)
  for (let index = 0; index < count && 6 + index * 16 + 2 <= buffer.length; index += 1) {
    const entry = 6 + index * 16
    const width = buffer[entry] || 256
    const height = buffer[entry + 1] || 256
    if (width * height > best.width * best.height) best = { width, height }
  }
  return best.width > 0 ? best : null
}

function svgSize(buffer: Buffer) {
  const tag = /<svg\b[^>]*>/i.exec(buffer.toString('utf8'))?.[0]
  if (!tag) return null
  const number = (name: string) => {
    const value = new RegExp(`\\b${name}\\s*=\\s*["']\\s*([\\d.]+)(?:px)?\\s*["']`, 'i').exec(tag)?.[1]
    return value ? Math.round(Number(value)) : null
  }
  const width = number('width')
  const height = number('height')
  if (width && height) return { width, height }
  const viewBox = /\bviewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*["']/i.exec(tag)
  return viewBox ? { width: Math.round(Number(viewBox[1])), height: Math.round(Number(viewBox[2])) } : null
}

export function inspectImage(buffer: Buffer): InspectedImage | null {
  const kind = detectKind(buffer)
  if (!kind) return null
  const readers: Record<ImageKind, (data: Buffer) => { width: number; height: number } | null> = {
    png: pngSize,
    jpeg: jpegSize,
    webp: webpSize,
    ico: icoSize,
    svg: svgSize,
  }
  let size: { width: number; height: number } | null = null
  try {
    size = readers[kind](buffer)
  } catch {
    size = null
  }
  return {
    kind,
    mimeType: MIME_TYPES[kind],
    extension: EXTENSIONS[kind],
    width: size?.width ?? null,
    height: size?.height ?? null,
  }
}

const UNSAFE_SVG_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /<script\b/i, reason: 'scripts' },
  { pattern: /\son[a-z]+\s*=/i, reason: 'event handlers (onload, onclick…)' },
  { pattern: /javascript\s*:/i, reason: 'javascript: links' },
  { pattern: /<foreignobject\b/i, reason: 'embedded HTML (foreignObject)' },
  { pattern: /<(?:iframe|embed|object)\b/i, reason: 'embedded frames or objects' },
  { pattern: /(?:xlink:)?href\s*=\s*["']\s*(?:https?:|data:(?!image\/(?:png|jpe?g|webp|gif);))/i, reason: 'links to outside files' },
  { pattern: /<!entity\b/i, reason: 'XML entities' },
]

/** Why an SVG isn't safe to serve (it could run code when opened), or null when it's clean. */
export function findUnsafeSvgContent(buffer: Buffer): string | null {
  const text = buffer.toString('utf8')
  return UNSAFE_SVG_PATTERNS.find(({ pattern }) => pattern.test(text))?.reason ?? null
}

/** A display-safe version of the uploaded file name: no folders, control characters or long names. */
export function cleanOriginalName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? ''
  // eslint-disable-next-line no-control-regex
  const cleaned = base.replace(/[\x00-\x1f<>:"|?*]/g, '').trim()
  return (cleaned || 'image').slice(0, 120)
}
