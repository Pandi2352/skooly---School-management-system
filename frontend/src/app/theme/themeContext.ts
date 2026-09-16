import { createContext } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'
/** Brand colour of the content area. The sidebar keeps its navy in every colour theme. */
export type ColorTheme = 'navy' | 'blue'

export const COLOR_THEMES: { value: ColorTheme; label: string; swatchClassName: string }[] = [
  { value: 'navy', label: 'Navy', swatchClassName: 'bg-[#1f3a5f]' },
  { value: 'blue', label: 'Blue', swatchClassName: 'bg-[#0060df]' },
]

export type ThemeContextValue = {
  preference: ThemePreference
  theme: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
  colorTheme: ColorTheme
  setColorTheme: (colorTheme: ColorTheme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const isThemePreference = (value: unknown): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system'

export const isColorTheme = (value: unknown): value is ColorTheme =>
  value === 'navy' || value === 'blue'
