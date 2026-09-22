import { CalendarPlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { APPLICANT_STATUSES } from '../constants'
import type { ApplicantStatus } from '../constants'
import { useUpdateApplicantStatus } from '../hooks/useStaff'
import type { JobApplicant } from '../types/staff.types'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

type ApplicantTableProps = {
  applicants: JobApplicant[]
  jobTitle: string
}

const STATUS_LABELS: Record<ApplicantStatus, string> = {
  received: 'Application Received',
  shortlisted: 'Shortlisted',
  'interview-scheduled': 'Interview Scheduled',
  hired: 'Offer Accepted / Hired',
  rejected: 'Rejected',
}

const STATUS_TONES: Record<ApplicantStatus, string> = {
  received: 'bg-slate-400/15 text-slate-600',
  shortlisted: 'bg-blue-500/15 text-blue-700',
  'interview-scheduled': 'bg-amber-500/15 text-amber-700',
  hired: 'bg-emerald-500/15 text-emerald-700',
  rejected: 'bg-rose-500/15 text-rose-600',
}

export function ApplicantTable({ applicants, jobTitle }: ApplicantTableProps) {
  const updateStatusMutation = useUpdateApplicantStatus()
  const [scheduleModalApplicant, setScheduleModalApplicant] = useState<JobApplicant | null>(null)
  const [interviewDate, setInterviewDate] = useState('')

  const handleStatusChange = async (applicant: JobApplicant, nextStatus: ApplicantStatus) => {
    if (nextStatus === 'interview-scheduled') {
      setScheduleModalApplicant(applicant)
      return
    }
    await updateStatusMutation.mutateAsync({
      id: applicant.id,
      jobId: applicant.jobId,
      status: nextStatus,
    })
  }

  const handleConfirmInterview = async () => {
    if (!scheduleModalApplicant || !interviewDate) return
    await updateStatusMutation.mutateAsync({
      id: scheduleModalApplicant.id,
      jobId: scheduleModalApplicant.jobId,
      status: 'interview-scheduled',
      interviewDate,
    })
    setScheduleModalApplicant(null)
    setInterviewDate('')
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-table-head text-xs font-semibold uppercase text-primary">
            <tr>
              <th className="px-4 py-3">Applicant Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Applied On</th>
              <th className="px-4 py-3">Interview Date</th>
              <th className="px-4 py-3">Pipeline Status</th>
              <th className="px-4 py-3 text-end">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {applicants.length > 0 ? (
              applicants.map((cand) => (
                <tr key={cand.id} className="hover:bg-canvas/50">
                  <td className="px-4 py-3 font-semibold text-ink">{cand.name}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-ink">{cand.phone}</div>
                    <div className="text-xs text-ink-muted">{cand.email}</div>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-xs text-ink-muted">
                    {cand.createdAt ? cand.createdAt.split('T')[0] : '—'}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-xs font-medium text-ink">
                    {cand.interviewDate ? (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <CalendarPlusIcon className="size-3.5" />
                        {cand.interviewDate}
                      </span>
                    ) : (
                      <span className="text-ink-muted">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${
                        STATUS_TONES[cand.status]
                      }`}
                    >
                      {STATUS_LABELS[cand.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Select
                      label="Update Status"
                      hideLabel
                      size="sm"
                      value={cand.status}
                      options={APPLICANT_STATUSES.map((st) => ({
                        value: st,
                        label: STATUS_LABELS[st],
                      }))}
                      onValueChange={(val) => {
                        void handleStatusChange(cand, val as ApplicantStatus)
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-ink-muted">
                  No applicants received for {jobTitle} yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={Boolean(scheduleModalApplicant)}
        onOpenChange={(open) => !open && setScheduleModalApplicant(null)}
        title="Schedule Candidate Interview"
        description={`Set an interview date and time for ${scheduleModalApplicant?.name}.`}
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setScheduleModalApplicant(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                void handleConfirmInterview()
              }}
              disabled={!interviewDate}
              loading={updateStatusMutation.isPending}
            >
              Confirm Schedule
            </Button>
          </div>
        }
      >
        <div className="py-2">
          <Input
            label="Interview Date & Time"
            type="datetime-local"
            required
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
        </div>
      </Dialog>
    </>
  )
}
