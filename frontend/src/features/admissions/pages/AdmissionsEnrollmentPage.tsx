import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowClockwiseIcon, UserPlusIcon } from '@phosphor-icons/react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { paths } from '@/app/paths'
import { useToast } from '@/hooks/useToast'
import { AdmissionReviewDrawer } from '../components/AdmissionReviewDrawer'
import { AdmissionsPipelineStats } from '../components/AdmissionsPipelineStats'
import { AdmissionsTable } from '../components/AdmissionsTable'
import { EnrollApplicantDialog } from '../components/EnrollApplicantDialog'
import {
  useAdmissionApplications,
  useAdmissionStats,
  useEnrollApplicant,
  useUpdateAdmissionStatus,
} from '../hooks/useAdmissionPipeline'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'

export function AdmissionsEnrollmentPage() {
  const { toast } = useToast()

  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [grade, setGrade] = useState<number | undefined>(undefined)

  const [reviewApplication, setReviewApplication] = useState<AdmissionApplication | null>(null)
  const [enrollApplication, setEnrollApplication] = useState<AdmissionApplication | null>(null)

  const {
    data: applicationsData,
    isLoading: isAppsLoading,
    refetch: refetchApps,
  } = useAdmissionApplications({
    status: activeStatus,
    search: search || undefined,
    grade,
  })

  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useAdmissionStats()

  const updateStatusMutation = useUpdateAdmissionStatus()
  const enrollMutation = useEnrollApplicant()

  const handleRefresh = async () => {
    await Promise.all([refetchApps(), refetchStats()])
    toast.info('Refreshed admissions data')
  }

  const handleUpdateStatus = async (
    id: string,
    status: 'under-review' | 'approved' | 'rejected',
    notes: string,
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id,
        input: { status, reviewerNotes: notes },
      })
      toast.success(
        `Application ${status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Updated'}`,
        `Application status has been updated to ${status}.`,
      )
    } catch {
      toast.error('Failed to update status', 'Please check your connection and try again.')
    }
  }

  const handleConfirmEnroll = async (id: string, section: string) => {
    try {
      const result = await enrollMutation.mutateAsync({
        id,
        input: { section },
      })
      toast.success(
        'Student Enrolled Successfully',
        result.message || `Assigned Admission No: ${result.admissionNo}`,
      )
    } catch {
      toast.error('Failed to enroll student', 'Could not complete student enrollment.')
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-2">
        <Breadcrumb
          items={[
            { label: 'Administration', to: paths.module('core-setup-administration') },
            { label: 'Admissions & Enrollment' },
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Admissions & Enrollment
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Pipeline for screening applications, verifying documents, and enrolling students into classes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                void handleRefresh()
              }}
              className="flex items-center gap-1.5 text-xs"
              title="Refresh admissions pipeline"
            >
              <ArrowClockwiseIcon className="h-4 w-4" />
              Refresh
            </Button>

            <Link
              to={paths.studentNew}
              className={buttonClasses({
                variant: 'primary',
                size: 'sm',
                className: 'flex items-center gap-1.5 text-xs',
              })}
            >
              <UserPlusIcon className="h-4 w-4" weight="bold" />
              Direct Walk-in Admission
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <AdmissionsPipelineStats
        stats={stats}
        isLoading={isStatsLoading}
        activeStatus={activeStatus}
        onSelectStatus={(status) => setActiveStatus(status)}
      />

      {/* Applications Table Card */}
      <div className="rounded-md border border-line bg-surface p-5 shadow-xs">
        <AdmissionsTable
          applications={applicationsData?.items ?? []}
          isLoading={isAppsLoading}
          search={search}
          onSearchChange={setSearch}
          grade={grade}
          onGradeChange={setGrade}
          onReview={(app) => setReviewApplication(app)}
          onEnroll={(app) => setEnrollApplication(app)}
        />
      </div>

      {/* Slide-over Review Drawer */}
      <AdmissionReviewDrawer
        application={reviewApplication}
        open={Boolean(reviewApplication)}
        onClose={() => setReviewApplication(null)}
        onUpdateStatus={handleUpdateStatus}
        onEnrollClick={(app) => setEnrollApplication(app)}
        isSubmitting={updateStatusMutation.isPending}
      />

      {/* Enrollment Confirmation Dialog */}
      <EnrollApplicantDialog
        application={enrollApplication}
        open={Boolean(enrollApplication)}
        onClose={() => setEnrollApplication(null)}
        onConfirmEnroll={handleConfirmEnroll}
        isEnrolling={enrollMutation.isPending}
      />
    </div>
  )
}
