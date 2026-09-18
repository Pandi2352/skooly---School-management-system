import { ArrowClockwiseIcon, UserPlusIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { CountChips, type CountChip } from '@/components/page/CountChips'
import { PageContainer } from '@/components/page/PageContainer'
import { RecordsCard } from '@/components/page/RecordsCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { useToast } from '@/hooks/useToast'
import { AdmissionReviewDrawer } from '../components/AdmissionReviewDrawer'
import { AdmissionsTable } from '../components/AdmissionsTable'
import { AdmissionsToolbar } from '../components/AdmissionsToolbar'
import { EnrollApplicantDialog } from '../components/EnrollApplicantDialog'
import {
  useAdmissionApplications,
  useAdmissionStats,
  useEnrollApplicant,
  useUpdateAdmissionStatus,
} from '../hooks/useAdmissionPipeline'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'

// The page composes: filters in state, data from query hooks, rendering from shared components.
export function AdmissionsEnrollmentPage() {
  const { toast } = useToast()

  const [activeStatus, setActiveStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [grade, setGrade] = useState<number | undefined>(undefined)

  const [reviewApplication, setReviewApplication] = useState<AdmissionApplication | null>(null)
  const [enrollApplication, setEnrollApplication] = useState<AdmissionApplication | null>(null)

  const applications = useAdmissionApplications({ status: activeStatus, search: search || undefined, grade })
  const stats = useAdmissionStats()
  const updateStatus = useUpdateAdmissionStatus()
  const enrollApplicant = useEnrollApplicant()

  const refresh = async () => {
    await Promise.all([applications.refetch(), stats.refetch()])
    toast.info('Refreshed admissions data')
  }

  const handleUpdateStatus = async (
    id: string,
    status: 'under-review' | 'approved' | 'rejected',
    notes: string,
  ) => {
    try {
      await updateStatus.mutateAsync({ id, input: { status, reviewerNotes: notes } })
      toast.success(
        `Application ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'}`,
        `The application is now ${status.replace('-', ' ')}.`,
      )
    } catch {
      toast.error('Couldn’t update the status', 'Check your connection and try again.')
    }
  }

  const handleConfirmEnroll = async (id: string, section: string) => {
    try {
      const result = await enrollApplicant.mutateAsync({ id, input: { section } })
      toast.success('Student enrolled', result.message || `Admission number ${result.admissionNo}.`)
    } catch {
      toast.error('Couldn’t enrol the student', 'Nothing was changed. Try again.')
    }
  }

  const counts = stats.data
  const chips: CountChip[] = [
    { id: 'all', label: 'Applications', count: counts?.total ?? 0, tone: 'info', hint: 'Show every application' },
    { id: 'under-review', label: 'Under review', count: counts?.underReview ?? 0, tone: 'planned' },
    { id: 'approved', label: 'Approved', count: counts?.approved ?? 0, tone: 'success' },
    { id: 'enrolled', label: 'Enrolled', count: counts?.enrolled ?? 0, tone: 'primary' },
    { id: 'rejected', label: 'Rejected', count: counts?.rejected ?? 0, tone: 'danger', hideWhenZero: true },
  ]

  return (
    <PageContainer
      title="Admissions & Enrollment"
      description="Screening applications, checking documents, and enrolling students into classes."
      eyebrow={
        <Breadcrumb
          items={[
            { label: 'Administration', to: paths.module('core-setup-and-administration') },
            { label: 'Admissions & Enrollment' },
          ]}
        />
      }
      status={
        !stats.isPending && (
          <CountChips
            label="Application totals"
            chips={chips}
            activeId={activeStatus}
            onSelect={setActiveStatus}
          />
        )
      }
      actions={
        <>
          <Button variant="secondary" onClick={() => void refresh()} loading={applications.isFetching}>
            <ArrowClockwiseIcon className="size-4.5" aria-hidden="true" />
            Refresh
          </Button>
          <Link to={paths.studentNew} className={buttonClasses({ variant: 'primary' })}>
            <UserPlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
            Direct walk-in admission
          </Link>
        </>
      }
      fullWidth
    >
      {/* grid-cols-1 is minmax(0, 1fr): without it the column grows to the table's full width
          and the whole page scrolls sideways instead of the table. */}
      <div className="grid min-w-0 grid-cols-1 gap-5">
        <RecordsCard
          title="Applications"
          icon={UsersThreeIcon}
          toolbar={
            <AdmissionsToolbar
              search={search}
              onSearchChange={setSearch}
              grade={grade}
              onGradeChange={setGrade}
            />
          }
        >
          <AdmissionsTable
            applications={applications.data?.items ?? []}
            isLoading={applications.isPending}
            onReview={setReviewApplication}
            onEnroll={setEnrollApplication}
          />
        </RecordsCard>
      </div>

      <AdmissionReviewDrawer
        application={reviewApplication}
        open={reviewApplication !== null}
        onClose={() => setReviewApplication(null)}
        onUpdateStatus={handleUpdateStatus}
        onEnrollClick={setEnrollApplication}
        isSubmitting={updateStatus.isPending}
      />

      <EnrollApplicantDialog
        application={enrollApplication}
        open={enrollApplication !== null}
        onClose={() => setEnrollApplication(null)}
        onConfirmEnroll={handleConfirmEnroll}
        isEnrolling={enrollApplicant.isPending}
      />
    </PageContainer>
  )
}
