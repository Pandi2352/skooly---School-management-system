import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/components/page/PageContainer'
import { SchoolProfilePanel } from '../components/SchoolProfilePanel'
import { SchoolSettingsNav } from '../components/SchoolSettingsNav'
import { SettingsComingSoon } from '../components/SettingsComingSoon'
import { SettingsQuickGuide } from '../components/SettingsQuickGuide'
import { SystemSettingsPanel } from '../components/SystemSettingsPanel'
import type { SettingsTab } from '../types/settings.types'
import { isSettingsTab } from '../utils/settingsTabs'

export function SchoolSettingsPage() {
  const [params] = useSearchParams()
  const tabParam = params.get('tab') ?? ''
  const tab: SettingsTab = isSettingsTab(tabParam) ? tabParam : 'profile'

  return (
    <PageContainer title="School Settings" fullWidth>
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="grid min-w-0 gap-5 lg:sticky lg:top-[calc(var(--spacing-navbar)+1.25rem)]">
          <SchoolSettingsNav active={tab} />
          <SettingsQuickGuide className="hidden lg:block" />
        </aside>

        <div className="min-w-0 rounded-md border border-line bg-surface">
          {tab === 'profile' ? (
            <SchoolProfilePanel />
          ) : tab === 'system' ? (
            <SystemSettingsPanel />
          ) : (
            <SettingsComingSoon tab={tab} />
          )}
        </div>
      </div>
    </PageContainer>
  )
}
