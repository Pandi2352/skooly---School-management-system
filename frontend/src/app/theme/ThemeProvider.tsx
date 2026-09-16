import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { readStorage, removeStorage, writeStorage } from '@/lib/storage'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { isColorTheme, ThemeContext, type ColorTheme, type ThemePreference } from './themeContext'

const readPreference = (): ThemePreference => {
  const saved = readStorage(STORAGE_KEYS.theme)
  return saved === 'light' || saved === 'dark' ? saved : 'system'
}

const readColorTheme = (): ColorTheme => {
  const saved = readStorage(STORAGE_KEYS.colorTheme)
  return isColorTheme(saved) ? saved : 'navy'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState(readPreference)
  const [colorTheme, setColorThemeState] = useState(readColorTheme)
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.color = colorTheme
  }, [colorTheme])

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
        setColorThemeState(next)
        if (next === 'navy') removeStorage(STORAGE_KEYS.colorTheme)
        else writeStorage(STORAGE_KEYS.colorTheme, next)
      },
    }),
    [preference, theme, colorTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
