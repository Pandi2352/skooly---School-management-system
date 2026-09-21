import { ArrowClockwiseIcon, TextboxIcon, UserPlusIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { CountChips, type CountChip } from '@/components/page/CountChips'
import { EmptyState } from '@/components/page/EmptyState'
import { PageContainer } from '@/components/page/PageContainer'
import { RecordsCard } from '@/components/page/RecordsCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { CUSTOM_FIELD_PERMISSIONS } from '@/features/customFields'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { AdmissionReviewDrawer } from '../components/AdmissionReviewDrawer'
import { AdmissionsTable } from '../components/AdmissionsTable'
import type { AdmissionAction } from '../components/AdmissionRowActions'
import { AdmissionsToolbar } from '../components/AdmissionsToolbar'
import { EditAdmissionDialog } from '../components/EditAdmissionDialog'
import { EnrollApplicantDialog } from '../components/EnrollApplicantDialog'
import { useAdmissionFilters } from '../hooks/useAdmissionFilters'
import {
  useAdmissionApplications,
  useAdmissionStats,
  useDeleteAdmissionApplication,
  useEnrollApplicant,
  useUpdateAdmissionStatus,
} from '../hooks/useAdmissionPipeline'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'

// The page composes: filters in state, data from query hooks, rendering from shared components.
export function AdmissionsEnrollmentPage() {
  const { toast } = useToast()
  const { can } = usePermissions()
  const canEditForm = can(CUSTOM_FIELD_PERMISSIONS.view)

  const { filters, update, reset, isFiltered } = useAdmissionFilters()

  const [reviewApplication, setReviewApplication] = useState<AdmissionApplication | null>(null)
  const [enrollApplication, setEnrollApplication] = useState<AdmissionApplication | null>(null)
  const [editApplication, setEditApplication] = useState<AdmissionApplication | null>(null)
  const [deleteApplication, setDeleteApplication] = useState<AdmissionApplication | null>(null)

  const applications = useAdmissionApplications({
    ...filters,
    search: filters.search || undefined,
    appliedFrom: filters.appliedFrom || undefined,
    appliedTo: filters.appliedTo || undefined,
  })
  const stats = useAdmissionStats()
  const updateStatus = useUpdateAdmissionStatus()
  const enrollApplicant = useEnrollApplicant()
  const removeApplication = useDeleteAdmissionApplication()

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

  const runAction = (action: AdmissionAction, application: AdmissionApplication) => {
    if (action === 'review') setReviewApplication(application)
    else if (action === 'edit') setEditApplication(application)
    else if (action === 'enroll') setEnrollApplication(application)
    else setDeleteApplication(application)
  }

  const confirmDelete = async () => {
    if (!deleteApplication) return
    try {
      const applicationNo = await removeApplication.mutateAsync(deleteApplication._id)
      toast.success('Application deleted', `${applicationNo} has been removed.`)
    } catch (error) {
      toast.error('Couldn’t delete the application', getErrorMessage(error))
    } finally {
      setDeleteApplication(null)
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
            activeId={filters.status}
            onSelect={(status) => update({ status })}
          />
        )
      }
      actions={
        <>
          <Button variant="secondary" onClick={() => void refresh()} loading={applications.isFetching}>
            <ArrowClockwiseIcon className="size-4.5" aria-hidden="true" />
            Refresh
          </Button>
          {/* The questions this form asks are edited here, so the link belongs beside the pipeline. */}
          {canEditForm && (
            <Link to={paths.settingsCustomFields} className={buttonClasses({ variant: 'secondary' })}>
              <TextboxIcon className="size-4.5" aria-hidden="true" />
              Form questions
            </Link>
          )}
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
            <AdmissionsToolbar filters={filters} isFiltered={isFiltered} onChange={update} onReset={reset} />
          }
          footer={
            applications.data && applications.data.total > applications.data.limit ? (
              <Pagination
                page={applications.data.page}
                pageCount={applications.data.totalPages}
                total={applications.data.total}
                pageSize={applications.data.limit}
                itemLabel="applications"
                onPageChange={(page) => update({ page })}
              />
            ) : undefined
          }
        >
          <AdmissionsTable
            applications={applications.data?.items ?? []}
            isLoading={applications.isPending}
            isRefreshing={applications.isPlaceholderData}
            error={applications.isError ? getErrorMessage(applications.error) : undefined}
            onRetry={() => void applications.refetch()}
            onAction={runAction}
            empty={
              isFiltered ? (
                <EmptyState
                  icon={UsersThreeIcon}
                  title="No applications match these filters"
                  description="Try a wider date range, a different status, or clear the filters."
                  action={
                    <Button variant="secondary" onClick={reset}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={UsersThreeIcon}
                  title="No applications yet"
                  description="Applications appear here as families apply. You can also take one at the desk with a direct walk-in admission."
                />
              )
            }
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

      {/* Remounted per application so the form always opens on the row that was clicked. */}
      <EditAdmissionDialog
        key={editApplication?._id ?? 'none'}
        application={editApplication}
        onClose={() => setEditApplication(null)}
      />

      <ConfirmDialog
        open={deleteApplication !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteApplication(null)
        }}
        title={`Delete ${deleteApplication?.applicationNo ?? ''}?`}
        description="This removes the application and everything recorded against it, and can't be undone. For a family that withdrew, rejecting the application keeps the record instead."
        confirmLabel="Delete application"
        tone="danger"
        onConfirm={confirmDelete}
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
