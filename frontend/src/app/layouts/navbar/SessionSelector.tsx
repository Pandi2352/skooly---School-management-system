import { CalendarBlankIcon, CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/ui/Dropdown'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/hooks/useToast'

const ACADEMIC_SESSIONS = [
  { id: '2026-2027', label: '2026-2027 (Active)', short: '26-27' },
  { id: '2025-2026', label: '2025-2026 (Previous)', short: '25-26' },
  { id: '2024-2025', label: '2024-2025 (Archived)', short: '24-25' },
] as const

export function SessionSelector() {
  const [activeSession, setActiveSession] = useState<string>('2026-2027')
  const { toast } = useToast()

  const current = ACADEMIC_SESSIONS.find((s) => s.id === activeSession) ?? ACADEMIC_SESSIONS[0]

  const handleSelect = (sessionId: string) => {
    setActiveSession(sessionId)
    toast({
      title: `Academic session switched to ${sessionId}`,
      description: 'Records and academic filters now reflect this academic year.',
    })
  }

  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-2.5 pointer-coarse:min-h-11"
          aria-label={`Academic session: ${current.id}`}
        >
          <Tooltip content="Academic session">
            <span className="flex items-center gap-1.5">
              <CalendarBlankIcon className="size-4 text-ink-muted" aria-hidden="true" />
              <span className="max-xs:hidden">{current.short}</span>
              <CaretDownIcon className="size-3 text-ink-muted" aria-hidden="true" />
            </span>
          </Tooltip>
        </button>
      }
    >
      <DropdownLabel>Academic Session</DropdownLabel>
      <DropdownSeparator />
      {ACADEMIC_SESSIONS.map((session) => (
        <DropdownItem
          key={session.id}
          icon={session.id === activeSession ? CheckIcon : undefined}
          onSelect={() => handleSelect(session.id)}
        >
          <span>{session.label}</span>
        </DropdownItem>
      ))}
    </Dropdown>
  )
}
