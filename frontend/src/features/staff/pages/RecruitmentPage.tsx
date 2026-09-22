import {
  BriefcaseIcon,
  CalendarCheckIcon,
  PlusIcon,
  UserPlusIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { useState, type SyntheticEvent } from 'react'
import { PageContainer } from '@/components/page/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { DEPARTMENTS } from '../constants'
import type { Department } from '../constants'
import { ApplicantTable } from '../components/ApplicantTable'
import { JobPostingCard } from '../components/JobPostingCard'
import { useApplicants, useCreateApplicant, useCreateJob, useJobs } from '../hooks/useStaff'

export function RecruitmentPage() {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs()
  const [selectedJobId, setSelectedJobId] = useState<string>('job-001')

  const activeJob = jobs.find((j) => j.id === selectedJobId) ?? jobs[0]
  const { data: applicants = [] } = useApplicants(
    activeJob?.id ?? '',
  )

  // Dialogs
  const [newJobOpen, setNewJobOpen] = useState(false)
  const [newApplicantOpen, setNewApplicantOpen] = useState(false)

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('')
  const [jobDept, setJobDept] = useState<Department>('Secondary')
  const [jobVacancies, setJobVacancies] = useState('1')
  const [jobDesc, setJobDesc] = useState('')
  const [jobReqs, setJobReqs] = useState('')
  const createJobMutation = useCreateJob()

  // New Applicant Form State
  const [candName, setCandName] = useState('')
  const [candEmail, setCandEmail] = useState('')
  const [candPhone, setCandPhone] = useState('')
  const [candNotes, setCandNotes] = useState('')
  const createApplicantMutation = useCreateApplicant()

  const handleCreateJob = async () => {
    if (!jobTitle.trim() || !jobDesc.trim()) return

    await createJobMutation.mutateAsync({
      title: jobTitle.trim(),
      department: jobDept,
      vacancies: Number(jobVacancies) || 1,
      description: jobDesc.trim(),
      requirements: jobReqs.trim() || undefined,
    })

    setNewJobOpen(false)
    setJobTitle('')
    setJobDesc('')
    setJobReqs('')
  }

  const handleCreateApplicant = async () => {
    if (!activeJob || !candName.trim() || !candPhone.trim()) return

    await createApplicantMutation.mutateAsync({
      jobId: activeJob.id,
      name: candName.trim(),
      email: candEmail.trim(),
      phone: candPhone.trim(),
      notes: candNotes.trim() || undefined,
    })

    setNewApplicantOpen(false)
    setCandName('')
    setCandEmail('')
    setCandPhone('')
    setCandNotes('')
  }

  return (
    <PageContainer
      title="Recruitment & Hiring"
      description="Manage open teaching and administrative positions, review applicant resumes, and track interviews."
      fullWidth
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={!activeJob}
            onClick={() => setNewApplicantOpen(true)}
          >
            <UserPlusIcon className="size-4" />
            Add Applicant
          </Button>
          <Button
            variant="primary"
            onClick={() => setNewJobOpen(true)}
          >
            <PlusIcon className="size-4" />
            Post New Vacancy
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Recruitment Summary KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Active Job Postings
              </span>
              <BriefcaseIcon className="size-4.5 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-ink">
              {jobs.filter((j) => j.status === 'open').length}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Total Candidates in Pipeline
              </span>
              <UsersIcon className="size-4.5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-emerald-600">
              {applicants.length}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Scheduled Interviews
              </span>
              <CalendarCheckIcon className="size-4.5 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-amber-600">
              {applicants.filter((a) => a.status === 'interview-scheduled').length}
            </div>
          </Card>
        </div>

        {/* 2-Column Split: Vacancies List (Left) & Pipeline / Applicants (Right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Vacancies Column */}
          <div className="space-y-3 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                Open Positions ({jobs.length})
              </h3>
            </div>

            {jobsLoading ? (
              <div className="py-4 text-xs text-ink-muted">Loading positions...</div>
            ) : (
              <div className="space-y-2.5">
                {jobs.map((job) => (
                  <JobPostingCard
                    key={job.id}
                    job={job}
                    isSelected={activeJob?.id === job.id}
                    applicantCount={applicants.filter((a) => a.jobId === job.id).length}
                    onSelect={() => setSelectedJobId(job.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Applicants & Pipeline Column */}
          <div className="space-y-4 lg:col-span-2">
            {activeJob ? (
              <>
                <Card className="p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{activeJob.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
                        <span>{activeJob.department}</span>
                        <span>•</span>
                        <span>
                          {activeJob.vacancies}{' '}
                          {activeJob.vacancies === 1 ? 'vacancy' : 'vacancies'}
                        </span>
                        <span>•</span>
                        <span className="capitalize text-emerald-600 font-semibold">
                          Status: {activeJob.status}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setNewApplicantOpen(true)}
                    >
                      <UserPlusIcon className="size-3.5" />
                      Add Candidate
                    </Button>
                  </div>
                  <p className="mt-3 text-xs text-ink-muted leading-relaxed">
                    {activeJob.description}
                  </p>
                  {activeJob.requirements && (
                    <div className="mt-2 text-xs text-ink-muted">
                      <span className="font-semibold text-ink">Requirements:</span>{' '}
                      {activeJob.requirements}
                    </div>
                  )}
                </Card>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                      Candidate Pipeline ({applicants.length})
                    </h4>
                  </div>
                  <ApplicantTable
                    applicants={applicants}
                    jobTitle={activeJob.title}
                  />
                </div>
              </>
            ) : (
              <Card className="p-12 text-center text-sm text-ink-muted">
                Select a position to view candidates or post a new vacancy.
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* New Job Dialog */}
      <Dialog
        open={newJobOpen}
        onOpenChange={setNewJobOpen}
        title="Post New Vacancy"
        description="Publish an opening for teaching or non-teaching staff."
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setNewJobOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                void handleCreateJob()
              }}
              loading={createJobMutation.isPending}
            >
              Publish Vacancy
            </Button>
          </div>
        }
      >
        <form
          onSubmit={(e: SyntheticEvent) => {
            e.preventDefault()
            void handleCreateJob()
          }}
          className="grid gap-3 py-2"
        >
          <Input
            label="Position Title"
            required
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. High School Biology Teacher"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              value={jobDept}
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              onValueChange={(val) => setJobDept(val as Department)}
            />
            <Input
              label="Number of Vacancies"
              type="number"
              min="1"
              value={jobVacancies}
              onChange={(e) => setJobVacancies(e.target.value)}
            />
          </div>
          <Textarea
            label="Job Description"
            required
            rows={3}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Key responsibilities and curriculum focus..."
          />
          <Textarea
            label="Requirements & Eligibility (Optional)"
            rows={2}
            value={jobReqs}
            onChange={(e) => setJobReqs(e.target.value)}
            placeholder="Degrees, B.Ed., minimum experience..."
          />
        </form>
      </Dialog>

      {/* New Applicant Dialog */}
      <Dialog
        open={newApplicantOpen}
        onOpenChange={setNewApplicantOpen}
        title={`Add Candidate for ${activeJob?.title ?? 'Position'}`}
        description="Record candidate details to progress them through the screening pipeline."
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setNewApplicantOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                void handleCreateApplicant()
              }}
              loading={createApplicantMutation.isPending}
            >
              Add to Pipeline
            </Button>
          </div>
        }
      >
        <form
          onSubmit={(e: SyntheticEvent) => {
            e.preventDefault()
            void handleCreateApplicant()
          }}
          className="grid gap-3 py-2"
        >
          <Input
            label="Candidate Full Name"
            required
            value={candName}
            onChange={(e) => setCandName(e.target.value)}
            placeholder="e.g. Shalini Menon"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              type="tel"
              required
              value={candPhone}
              onChange={(e) => setCandPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
            <Input
              label="Email Address"
              type="email"
              value={candEmail}
              onChange={(e) => setCandEmail(e.target.value)}
              placeholder="candidate@email.com"
            />
          </div>
          <Textarea
            label="Initial Screening Notes"
            rows={2}
            value={candNotes}
            onChange={(e) => setCandNotes(e.target.value)}
            placeholder="Qualification notes, current school, expected CTC..."
          />
        </form>
      </Dialog>
    </PageContainer>
  )
}
