import {
  BookOpenIcon,
  CalendarBlankIcon,
  CaretDownIcon,
  ClockIcon,
  DownloadSimpleIcon,
  MegaphoneIcon,
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/ui/Dropdown'

export function MoreMenu() {
  const navigate = useNavigate()

  return (
    <Dropdown
      align="start"
      trigger={
        <button
          type="button"
          className="flex h-9 items-center gap-1 rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-11"
          aria-label="More navigation options"
        >
          <span>more</span>
          <CaretDownIcon className="size-3 text-ink-muted" aria-hidden="true" />
        </button>
      }
    >
      <DropdownLabel>Quick Shortcuts</DropdownLabel>
      <DropdownSeparator />
      <DropdownItem
        icon={CalendarBlankIcon}
        onSelect={() => {
          void navigate('/communication/event-calendar')
        }}
      >
        <span>Event Calendar</span>
      </DropdownItem>
      <DropdownItem
        icon={MegaphoneIcon}
        onSelect={() => {
          void navigate('/communication/notice-board')
        }}
      >
        <span>Notice Board</span>
      </DropdownItem>
      <DropdownItem
        icon={ClockIcon}
        onSelect={() => {
          void navigate('/academic-management/timetable-scheduling')
        }}
      >
        <span>Class Timetable</span>
      </DropdownItem>
      <DropdownItem
        icon={BookOpenIcon}
        onSelect={() => {
          void navigate('/academic-management/lesson-planning')
        }}
      >
        <span>Lesson Plans</span>
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem
        icon={DownloadSimpleIcon}
        onSelect={() => {
          void navigate('/core-setup-administration/data-import-export')
        }}
      >
        <span>Data & Reports Center</span>
      </DropdownItem>
    </Dropdown>
  )
}
