import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { readStorage, removeStorage, writeStorage } from '@/lib/storage'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { isColorTheme, ThemeContext, type ColorTheme, type ThemePreference } from './themeContext'

const readPreference = (): ThemePreference => {
  const saved = readStorage(STORAGE_KEYS.theme)
  return saved === 'light' || saved === 'dark' ? saved : 'system'
}

const readPersonalColorTheme = (): ColorTheme | null => {
  const saved = readStorage(STORAGE_KEYS.colorTheme)
  return isColorTheme(saved) ? saved : null
}

// The school default is cached so the first paint (index.html) uses it before branding loads.
const readSchoolColorTheme = (): ColorTheme => {
  const saved = readStorage(STORAGE_KEYS.schoolColorTheme)
  return isColorTheme(saved) ? saved : 'navy'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState(readPreference)
  const [personalColorTheme, setPersonalColorTheme] = useState(readPersonalColorTheme)
  const [schoolColorTheme, setSchoolColorThemeState] = useState(readSchoolColorTheme)
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference
  const colorTheme = personalColorTheme ?? schoolColorTheme

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.color = colorTheme
  }, [colorTheme])

  // Stable, because BrandingSync calls it from an effect whenever branding loads.
  const setSchoolColorTheme = useCallback((next: ColorTheme) => {
    setSchoolColorThemeState(next)
    writeStorage(STORAGE_KEYS.schoolColorTheme, next)
  }, [])

  const value = useMemo(
    () => ({
      preference,
      theme,
      setPreference: (next: ThemePreference) => {
        setPreferenceState(next)
        if (next === 'system') removeStorage(STORAGE_KEYS.theme)
        else writeStorage(STORAGE_KEYS.theme, next)
      },
      colorTheme,
      setColorTheme: (next: ColorTheme) => {
        setPersonalColorTheme(next)
        writeStorage(STORAGE_KEYS.colorTheme, next)
      },
      schoolColorTheme,
      setSchoolColorTheme,
      usesSchoolColorTheme: personalColorTheme === null,
      followSchoolColorTheme: () => {
        setPersonalColorTheme(null)
        removeStorage(STORAGE_KEYS.colorTheme)
      },
    }),
    [preference, theme, colorTheme, schoolColorTheme, setSchoolColorTheme, personalColorTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
