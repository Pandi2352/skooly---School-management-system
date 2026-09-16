import { SETTINGS_TABS } from '../constants'
import type { SettingsTab } from '../types/settings.types'

export const isSettingsTab = (value: string): value is SettingsTab =>
  SETTINGS_TABS.some((tab) => tab === value)
