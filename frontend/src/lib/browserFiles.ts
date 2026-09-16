// Browser-only helpers for getting data out of the page: clipboard and file downloads.

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text)
}

/** Saves text as a file through a temporary link. */
export function downloadTextFile(fileName: string, content: string, mimeType: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
