import { useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useBranding } from '../hooks/useBranding'
import { applyFavicon } from '../utils/favicon'

/**
 * Applies the school's branding to the whole app: the browser tab icon and the default colour
 * theme. Renders nothing; mounted once in the app layout. If branding can't load, defaults stay.
 */
export function BrandingSync() {
  const branding = useBranding()
  const { setSchoolColorTheme } = useTheme()
  const faviconUrl = branding.data?.assets.favicon?.url ?? null
  const schoolColorTheme = branding.data?.colorTheme
  const displayName = branding.data?.displayName

  useEffect(() => {
    if (branding.isSuccess) applyFavicon(faviconUrl)
  }, [branding.isSuccess, faviconUrl])

  useEffect(() => {
    if (schoolColorTheme) setSchoolColorTheme(schoolColorTheme)
  }, [schoolColorTheme, setSchoolColorTheme])

  useEffect(() => {
    if (displayName) {
      document.title = `${displayName} · School ERP`
    }
  }, [displayName])

  return null
}
