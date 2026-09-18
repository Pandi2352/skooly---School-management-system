/**
 * Reads an image file's pixel size in the browser. Null for SVG and ICO (which don't need or don't
 * decode reliably for this check) and for anything the browser can't decode; the server decides then.
 */
export async function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (file.type === 'image/svg+xml' || /\.(svg|ico)$/i.test(file.name) || file.type.includes('icon')) return null
  if (typeof createImageBitmap !== 'function') return null
  try {
    const bitmap = await createImageBitmap(file)
    const size = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return size
  } catch {
    return null
  }
}
