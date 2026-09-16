import { CaretDownIcon, CheckIcon, GlobeIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/useToast'

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
] as const

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<string>('en')
  const { toast } = useToast()

  const active = LANGUAGES.find((lang) => lang.code === currentLang) ?? LANGUAGES[0]

  const handleSelect = (code: string, name: string) => {
    setCurrentLang(code)
    toast({
      title: `Language set to ${name}`,
      description: 'System interface language preference updated.',
    })
  }

  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-2.5 pointer-coarse:min-h-11"
          aria-label={`Language: ${active.label}`}
        >
          <Tooltip content="Select language">
            <span className="flex items-center gap-1.5">
              <GlobeIcon className="size-4 text-ink-muted" aria-hidden="true" />
              <span className="hidden sm:inline">{active.label}</span>
              <CaretDownIcon className="size-3 text-ink-muted" aria-hidden="true" />
            </span>
          </Tooltip>
        </button>
      }
    >
      <DropdownLabel>Select Language</DropdownLabel>
      <DropdownSeparator />
      {LANGUAGES.map((lang) => (
        <DropdownItem
          key={lang.code}
          icon={lang.code === currentLang ? CheckIcon : undefined}
          onSelect={() => handleSelect(lang.code, lang.label)}
        >
          <span className="flex w-full items-center justify-between gap-3">
            <span>{lang.label}</span>
            <span className="text-xs text-ink-muted">{lang.native}</span>
          </span>
        </DropdownItem>
      ))}
    </Dropdown>
  )
}
