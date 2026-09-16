import {
  DatabaseIcon,
  GearSixIcon,
  MoonIcon,
  ShieldCheckIcon,
  SlidersIcon,
  SunIcon,
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { COLOR_THEMES, isColorTheme } from '@/app/theme/themeContext'
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
} from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'

export function SettingsMenu() {
  const { theme, setPreference, colorTheme, setColorTheme } = useTheme()
  const navigate = useNavigate()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform hover:scale-105 hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-11 pointer-coarse:min-w-11"
          aria-label="Settings and preferences"
        >
          <Tooltip content="Settings & preferences">
            <span className="relative flex items-center justify-center">
              <GearSixIcon className="size-5" weight="fill" aria-hidden="true" />
              <span
                className="absolute -top-1 -right-1 size-2 rounded-full bg-accent ring-2 ring-surface"
                aria-hidden="true"
              />
            </span>
          </Tooltip>
        </button>
      }
    >
      <DropdownLabel>System & Preferences</DropdownLabel>
      <DropdownSeparator />
      <DropdownItem
        icon={theme === 'dark' ? SunIcon : MoonIcon}
        onSelect={() => setPreference(nextTheme)}
      >
        <span>Switch to {nextTheme} theme</span>
      </DropdownItem>
      <DropdownSeparator />
      <DropdownLabel>Colour theme</DropdownLabel>
      <DropdownRadioGroup
        value={colorTheme}
        onValueChange={(value) => {
          if (isColorTheme(value)) setColorTheme(value)
        }}
      >
        {COLOR_THEMES.map((option) => (
          <DropdownRadioItem key={option.value} value={option.value}>
            <span
              className={cn(
                'size-3.5 flex-none rounded-full ring-1 ring-line',
                option.swatchClassName,
              )}
              aria-hidden="true"
            />
            {option.label}
          </DropdownRadioItem>
        ))}
      </DropdownRadioGroup>
      <DropdownSeparator />
      <DropdownItem
        icon={SlidersIcon}
        onSelect={() => {
          void navigate(paths.settingsGeneral)
        }}
      >
        <span>General Settings</span>
      </DropdownItem>
      <DropdownItem
        icon={ShieldCheckIcon}
        onSelect={() => {
          void navigate(paths.settingsRoles)
        }}
      >
        <span>Roles & Permissions</span>
      </DropdownItem>
      <DropdownItem
        icon={DatabaseIcon}
        onSelect={() => {
          void navigate(paths.backups)
        }}
      >
        <span>Backup Management</span>
      </DropdownItem>
    </Dropdown>
  )
}
