import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/page/EmptyState'
import { buttonClasses } from '@/components/ui/buttonStyles'
import type { SettingsTab } from '../types/settings.types'

type PlannedTab = Exclude<SettingsTab, 'profile' | 'system'>

const sections: Record<PlannedTab, string> = {
  attendance: 'Attendance',
  security: 'Security',
  integrations: 'Integrations',
  social: 'Social Media',
  telegram: 'Telegram Bot',
}

/** Placeholder for settings sections that aren't built yet. */
export function SettingsComingSoon({ tab }: { tab: PlannedTab }) {
  return (
    <EmptyState
      title={`${sections[tab]} is coming soon`}
      description="These settings will appear here once they're built. The school profile is ready to edit now."
      action={
        <Link to={{ search: '' }} className={buttonClasses({ variant: 'secondary' })}>
          Go to School Profile
        </Link>
      }
    />
  )
}
