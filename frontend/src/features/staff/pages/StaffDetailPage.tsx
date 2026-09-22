import {
  ArrowLeftIcon,
  CalendarPlusIcon,
  CameraIcon,
  PencilSimpleIcon,
  StarIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Tabs } from '@/components/ui/Tabs'
import { StaffStatusBadge } from '../components/StaffStatusBadge'
import { StaffPhotoUpload } from '../components/StaffPhotoUpload'
import { StaffAcademicTab } from '../components/detail/StaffAcademicTab'
import { StaffEmploymentTab } from '../components/detail/StaffEmploymentTab'
import { StaffEvaluationsTab } from '../components/detail/StaffEvaluationsTab'
import { StaffLeaveHistoryTab } from '../components/detail/StaffLeaveHistoryTab'
import { StaffProfileTab } from '../components/detail/StaffProfileTab'
import { LeaveRequestDialog } from '../components/LeaveRequestDialog'
import { EvaluationDialog } from '../components/EvaluationDialog'
import { useStaffMember } from '../hooks/useStaff'
import { staffFullName } from '../utils/staffStatus'

export function StaffDetailPage() {
  const { staffId } = useParams<{ staffId: string }>()
  const navigate = useNavigate()
  const { data: staff, isLoading, error, refetch } = useStaffMember(staffId ?? '')

  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [evalDialogOpen, setEvalDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <PageContainer title="Staff Profile">
        <LoadingState label="staff profile" />
      </PageContainer>
    )
  }

  if (error || !staff) {
    return (
      <PageContainer title="Staff Profile">
        <ErrorState
          title="Staff member not found"
          description={error instanceof Error ? error.message : 'Unable to find staff records.'}
          onRetry={() => void refetch()}
        />
      </PageContainer>
    )
  }

  const fullName = staffFullName(staff.personalInfo)

  const tabItems = [
    {
      value: 'profile',
      label: 'Personal & Contact',
      content: <StaffProfileTab staff={staff} />,
    },
    {
      value: 'academic',
      label: 'Academics & Experience',
      content: <StaffAcademicTab staff={staff} />,
    },
    {
      value: 'employment',
      label: 'Employment & Position',
      content: <StaffEmploymentTab staff={staff} />,
    },
    {
      value: 'leaves',
      label: 'Leaves & Balances',
      content: <StaffLeaveHistoryTab staff={staff} />,
    },
    {
      value: 'evaluations',
      label: 'Evaluations & Ratings',
      content: <StaffEvaluationsTab staff={staff} />,
    },
  ]

  return (
    <PageContainer
      title={fullName}
      eyebrow={
        <Link
          to={paths.staff}
          className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-ink"
        >
          <ArrowLeftIcon className="size-3" /> Back to Staff Directory
        </Link>
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setLeaveDialogOpen(true)}
          >
            <CalendarPlusIcon className="size-4" />
            Apply Leave
          </Button>
          <Button
            variant="ghost"
            onClick={() => setEvalDialogOpen(true)}
          >
            <StarIcon className="size-4" />
            Add Evaluation
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              void navigate(paths.staffMemberEdit(staff.id))
            }}
          >
            <PencilSimpleIcon className="size-4" />
            Edit Profile
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Profile Header Card */}
        <Card className="p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar
                  name={fullName}
                  src={staff.photoUrl ?? undefined}
                  size="lg"
                  className="size-20 text-xl"
                />
                <button
                  type="button"
                  onClick={() => setPhotoDialogOpen(true)}
                  aria-label="Change photo"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <CameraIcon className="size-6" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-ink">{fullName}</h2>
                  <StaffStatusBadge status={staff.employment.status} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
                  <span className="font-semibold text-ink">{staff.employment.designation}</span>
                  <span>•</span>
                  <span>{staff.employment.department}</span>
                  <span>•</span>
                  <span className="font-mono tabular-nums text-xs">
                    ID: {staff.employment.employeeId}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
                  <span>Joined: {staff.employment.dateOfJoining}</span>
                  <span>Phone: {staff.contactInfo.phone}</span>
                  {staff.contactInfo.email && <span>Email: {staff.contactInfo.email}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPhotoDialogOpen(true)}
              >
                <CameraIcon className="size-4" />
                Change Photo
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabbed Profile Sections */}
        <Tabs label="Staff profile sections" items={tabItems} defaultValue="profile" />
      </div>

      {/* Photo Upload Dialog */}
      <Dialog
        open={photoDialogOpen}
        onOpenChange={setPhotoDialogOpen}
        title="Update Staff Photo"
        description="Choose a professional portrait photo for staff ID cards and records."
        size="sm"
      >
        <div className="py-2">
          <StaffPhotoUpload
            staffId={staff.id}
            photoUrl={staff.photoUrl}
            onPhotoChanged={() => setPhotoDialogOpen(false)}
          />
        </div>
      </Dialog>

      <LeaveRequestDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        defaultStaffId={staff.id}
        staffList={[{ id: staff.id, name: `${fullName} (${staff.employment.employeeId})` }]}
      />

      <EvaluationDialog
        open={evalDialogOpen}
        onOpenChange={setEvalDialogOpen}
        defaultStaffId={staff.id}
        staffList={[{ id: staff.id, name: `${fullName} (${staff.employment.employeeId})` }]}
      />
    </PageContainer>
  )
}
