export type PageListItem = number | 'gap'

/**
 * Page numbers to show, with 'gap' where pages are skipped.
 * Page 5 of 10 → [1, 'gap', 4, 5, 6, 'gap', 10]. A gap of one page shows the number instead.
 */
export function getPageList(page: number, pageCount: number, siblings = 1): PageListItem[] {
  if (pageCount <= 0) return []
  const current = Math.min(Math.max(page, 1), pageCount)

  const pages = new Set<number>([1, pageCount])
  for (let p = current - siblings; p <= current + siblings; p++) {
    if (p >= 1 && p <= pageCount) pages.add(p)
  }

  const result: PageListItem[] = []
  let previous = 0
  for (const p of [...pages].sort((a, b) => a - b)) {
    if (p - previous === 2) result.push(previous + 1)
    else if (p - previous > 2) result.push('gap')
    result.push(p)
    previous = p
  }
  return result
}
