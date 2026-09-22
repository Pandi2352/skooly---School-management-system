import {
  ArrowRightIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  CalendarPlusIcon,
  PlusIcon,
  StarIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { PageContainer } from '@/components/page/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useStaffStats } from '../hooks/useStaff'
import { DepartmentStrengthChart } from '../components/overview/DepartmentStrengthChart'
import { LeaveBreakdownChart } from '../components/overview/LeaveBreakdownChart'
import { StaffDepartmentDonut } from '../components/overview/StaffDepartmentDonut'
import { StaffHeadcountChart } from '../components/overview/StaffHeadcountChart'
import { AddStaffDialog } from '../components/AddStaffDialog'
import { LeaveRequestDialog } from '../components/LeaveRequestDialog'
import { EvaluationDialog } from '../components/EvaluationDialog'

export function StaffOverviewPage() {
  const { data: stats } = useStaffStats()
  const [addStaffOpen, setAddStaffOpen] = useState(false)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [evalDialogOpen, setEvalDialogOpen] = useState(false)

  const totalStaff = stats?.total ?? 5
  const activeStaff = stats?.active ?? 3
  const onLeave = stats?.onLeave ?? 1
  const pendingLeaves = stats?.pendingLeaves ?? 2
  const openJobs = stats?.openJobs ?? 1
  const byDept = stats?.byDepartment ?? {
    Primary: 2,
    Secondary: 1,
    'Senior Secondary': 1,
    Accounts: 1,
  }

  return (
    <PageContainer
      title="HR & Staff Overview"
      description="Workforce metrics, staff headcount trajectory, leave utilization, and departmental analytics."
      fullWidth
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
            Rate Faculty
          </Button>
          <Button
            variant="primary"
            onClick={() => setAddStaffOpen(true)}
          >
            <PlusIcon className="size-4" />
            Add Staff
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 transition-all hover:border-primary/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Total Staff
              </span>
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <UsersIcon className="size-4.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums text-ink">
                {totalStaff}
              </span>
              <span className="text-xs text-emerald-600 font-medium">
                {activeStaff} active today
              </span>
            </div>
            <Link
              to={paths.staff}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View directory <ArrowRightIcon className="size-3" />
            </Link>
          </Card>

          <Card className="p-4 transition-all hover:border-amber-500/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                On Leave Today
              </span>
              <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600">
                <CalendarCheckIcon className="size-4.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums text-ink">
                {onLeave}
              </span>
              <span className="text-xs text-ink-muted">faculty / staff</span>
            </div>
            <Link
              to={paths.staffLeave}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Check leave tracker <ArrowRightIcon className="size-3" />
            </Link>
          </Card>

          <Card className="p-4 transition-all hover:border-blue-500/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Pending Leave Requests
              </span>
              <div className="flex size-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
                <CalendarPlusIcon className="size-4.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums text-ink">
                {pendingLeaves}
              </span>
              <span className="text-xs text-ink-muted">awaiting approval</span>
            </div>
            <Link
              to={paths.staffLeave}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Review approvals <ArrowRightIcon className="size-3" />
            </Link>
          </Card>

          <Card className="p-4 transition-all hover:border-emerald-500/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Open Vacancies
              </span>
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                <BriefcaseIcon className="size-4.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums text-ink">
                {openJobs}
              </span>
              <span className="text-xs text-ink-muted">active job postings</span>
            </div>
            <Link
              to={paths.staffRecruitment}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Manage recruitment <ArrowRightIcon className="size-3" />
            </Link>
          </Card>
        </div>

        {/* Charts Row 1: Headcount Growth (Area) + Department Donut (Pie) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StaffHeadcountChart currentTotal={totalStaff} />
          <StaffDepartmentDonut byDepartment={byDept} />
        </div>

        {/* Charts Row 2: Leave Breakdown (Bar) + Department Strength (Horizontal Bar) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LeaveBreakdownChart />
          <DepartmentStrengthChart />
        </div>

        {/* Quick Nav Module Hub */}
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-muted">
            HR Module Hub & Quick Navigation
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to={paths.staff}
              className="flex items-center gap-3 rounded-md border border-line bg-canvas/40 p-3 transition-colors hover:border-primary hover:bg-surface"
            >
              <UsersIcon className="size-6 text-primary flex-none" />
              <div>
                <div className="font-semibold text-ink">Staff Directory</div>
                <div className="text-xs text-ink-muted">Profiles, qualifications, records</div>
              </div>
            </Link>

            <Link
              to={paths.staffLeave}
              className="flex items-center gap-3 rounded-md border border-line bg-canvas/40 p-3 transition-colors hover:border-primary hover:bg-surface"
            >
              <CalendarCheckIcon className="size-6 text-amber-600 flex-none" />
              <div>
                <div className="font-semibold text-ink">Leave Management</div>
                <div className="text-xs text-ink-muted">Applications, approvals, balances</div>
              </div>
            </Link>

            <Link
              to={paths.staffEvaluations}
              className="flex items-center gap-3 rounded-md border border-line bg-canvas/40 p-3 transition-colors hover:border-primary hover:bg-surface"
            >
              <StarIcon className="size-6 text-amber-500 flex-none" />
              <div>
                <div className="font-semibold text-ink">Teacher Evaluations</div>
                <div className="text-xs text-ink-muted">Appraisals, criteria, feedback</div>
              </div>
            </Link>

            <Link
              to={paths.staffRecruitment}
              className="flex items-center gap-3 rounded-md border border-line bg-canvas/40 p-3 transition-colors hover:border-primary hover:bg-surface"
            >
              <BriefcaseIcon className="size-6 text-emerald-600 flex-none" />
              <div>
                <div className="font-semibold text-ink">Recruitment & Hiring</div>
                <div className="text-xs text-ink-muted">Openings, applicant pipelines</div>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      <AddStaffDialog open={addStaffOpen} onOpenChange={setAddStaffOpen} />
      <LeaveRequestDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen} />
      <EvaluationDialog open={evalDialogOpen} onOpenChange={setEvalDialogOpen} />
    </PageContainer>
  )
}
