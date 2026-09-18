import { DEFAULT_FAVICON_HREF } from '../constants'

const iconType = (href: string) => {
  if (/\.ico(?:$|\?)/i.test(href)) return 'image/x-icon'
  if (/\.png(?:$|\?)/i.test(href)) return 'image/png'
  if (/\.jpe?g(?:$|\?)/i.test(href)) return 'image/jpeg'
  return ''
}

/** Points the browser tab icon at the school's favicon, or back to the default when there isn't one. */
export function applyFavicon(url: string | null) {
  const href = url ?? DEFAULT_FAVICON_HREF
  let link = document.head.querySelector<HTMLLinkElement>('link[rel~="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.append(link)
  }
  if (link.getAttribute('href') === href) return
  link.href = href
  const type = iconType(href)
  if (type) link.type = type
  else link.removeAttribute('type')
}
