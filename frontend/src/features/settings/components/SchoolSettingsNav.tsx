import {
  ArrowSquareOutIcon,
  BellIcon,
  BuildingsIcon,
  ClockIcon,
  PlugIcon,
  ShareNetworkIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  TelegramLogoIcon,
  type Icon,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { cn } from '@/lib/cn'
import type { SettingsTab } from '../types/settings.types'

type TabLink = { id: SettingsTab; label: string; icon: Icon }

const schoolTabs: TabLink[] = [
  { id: 'profile', label: 'School Profile', icon: BuildingsIcon },
  { id: 'system', label: 'System & Formats', icon: SlidersHorizontalIcon },
  { id: 'attendance', label: 'Attendance', icon: ClockIcon },
  { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  { id: 'integrations', label: 'Integrations', icon: PlugIcon },
]

const channelTabs: TabLink[] = [
  { id: 'social', label: 'Social Media', icon: ShareNetworkIcon },
  { id: 'telegram', label: 'Telegram Bot', icon: TelegramLogoIcon },
]

const itemClasses = (isActive: boolean) =>
  cn(
    'flex min-h-10 shrink-0 items-center gap-2.5 rounded-md border px-3 text-sm font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none pointer-coarse:min-h-11',
    isActive
      ? 'border-primary bg-primary text-surface'
      : 'border-line bg-surface text-ink hover:border-primary/40 hover:bg-primary/5',
  )

/** Sections of School Settings, kept in the URL (?tab=security) so each can be linked to. */
export function SchoolSettingsNav({ active }: { active: SettingsTab }) {
  const renderTab = ({ id, label, icon: TabIcon }: TabLink) => (
    <li key={id}>
      <Link
        to={{ search: id === 'profile' ? '' : `?tab=${id}` }}
        aria-current={active === id ? 'page' : undefined}
        className={itemClasses(active === id)}
      >
        <TabIcon className="size-4.5 flex-none" weight="fill" aria-hidden="true" />
        {label}
      </Link>
    </li>
  )

  return (
    <nav aria-label="Settings sections" className="grid min-w-0 gap-3">
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
        {schoolTabs.map(renderTab)}
      </ul>
      <p className="px-1 text-xs font-bold tracking-wide text-ink-muted uppercase">
        External channels
      </p>
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
        {channelTabs.map(renderTab)}
        <li>
          <Link
            to={paths.feature('settings-and-billing', 'notification-settings')}
            className={itemClasses(false)}
          >
            <BellIcon className="size-4.5 flex-none" weight="fill" aria-hidden="true" />
            Notifications
            <ArrowSquareOutIcon className="ms-auto size-4 text-ink-muted" aria-hidden="true" />
            <span className="sr-only">(opens Notification Settings)</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
