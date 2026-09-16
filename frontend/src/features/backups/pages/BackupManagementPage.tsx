import { useState } from 'react'
import { PageContainer } from '@/components/page/PageContainer'
import { BackupListCard } from '../components/BackupListCard'
import { BackupPageActions } from '../components/BackupPageActions'
import { BackupScheduleNotice } from '../components/BackupScheduleNotice'
import { OffsiteCopiesCard } from '../components/OffsiteCopiesCard'
import { SchedulingDialog } from '../components/SchedulingDialog'

export function BackupManagementPage() {
  const [schedulingOpen, setSchedulingOpen] = useState(false)

  return (
    <PageContainer
      title="Backup Management"
      description="Nightly automatic backups and manual copies of your school data"
      actions={<BackupPageActions onOpenScheduling={() => setSchedulingOpen(true)} />}
      fullWidth
    >
      <div className="grid min-w-0 grid-cols-1 gap-5">
        <BackupScheduleNotice />
        <BackupListCard />
        <OffsiteCopiesCard />
      </div>
      <SchedulingDialog open={schedulingOpen} onOpenChange={setSchedulingOpen} />
    </PageContainer>
  )
}
