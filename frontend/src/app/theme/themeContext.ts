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
  /** The colour in use: the person's own choice, or else the school default from Branding. */
  colorTheme: ColorTheme
  /** Saves a personal colour choice in this browser. */
  setColorTheme: (colorTheme: ColorTheme) => void
  schoolColorTheme: ColorTheme
  /** Set from the school's branding; applies to everyone without a personal choice. */
  setSchoolColorTheme: (colorTheme: ColorTheme) => void
  usesSchoolColorTheme: boolean
  /** Drops the personal choice and follows the school default again. */
  followSchoolColorTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const isThemePreference = (value: unknown): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system'

export const isColorTheme = (value: unknown): value is ColorTheme =>
  value === 'navy' || value === 'blue'
