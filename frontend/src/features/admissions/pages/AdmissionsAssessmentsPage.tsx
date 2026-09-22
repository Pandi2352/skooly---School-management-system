import {
  ExamIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  TrendUpIcon,
  TrophyIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { PageContainer } from '@/components/page/PageContainer'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import { useToast } from '@/hooks/useToast'

export type AssessmentStatus = 'scheduled' | 'evaluated' | 'recommended' | 'on-hold' | 'rejected'

export type AdmissionAssessment = {
  id: string
  applicationNo: string
  studentName: string
  gradeApplied: number
  testDate: string
  testType: 'Written & Interview' | 'Diagnostic Screening' | 'Aptitude Assessment'
  writtenScore: number | null
  maxWrittenScore: number
  interviewRating: number | null
  maxInterviewRating: number
  evaluatorName: string
  facultyRemarks: string
  status: AssessmentStatus
}

const SAMPLE_ASSESSMENTS: AdmissionAssessment[] = [
  {
    id: 'ASM-2026-001',
    applicationNo: 'APP-2026-001',
    studentName: 'Rohan Verma',
    gradeApplied: 5,
    testDate: '2026-03-03',
    testType: 'Written & Interview',
    writtenScore: 92,
    maxWrittenScore: 100,
    interviewRating: 4.8,
    maxInterviewRating: 5.0,
    evaluatorName: 'Dr. Meenakshi Sundaram (VP Academics)',
    facultyRemarks: 'Exceptional aptitude in mental mathematics and clear expressive English communication.',
    status: 'recommended',
  },
  {
    id: 'ASM-2026-002',
    applicationNo: 'APP-2026-002',
    studentName: 'Ananya Sharma',
    gradeApplied: 8,
    testDate: '2026-03-04',
    testType: 'Written & Interview',
    writtenScore: 88,
    maxWrittenScore: 100,
    interviewRating: 4.6,
    maxInterviewRating: 5.0,
    evaluatorName: 'Mrs. Geetha Krishnan (Senior Coordinator)',
    facultyRemarks: 'Strong foundation in Science. Very active in extracurriculars and debate.',
    status: 'recommended',
  },
  {
    id: 'ASM-2026-003',
    applicationNo: 'APP-2026-003',
    studentName: 'Aarav Nair',
    gradeApplied: 3,
    testDate: '2026-03-08',
    testType: 'Diagnostic Screening',
    writtenScore: null,
    maxWrittenScore: 50,
    interviewRating: null,
    maxInterviewRating: 5.0,
    evaluatorName: 'Primary Wing Assessment Committee',
    facultyRemarks: 'Scheduled for morning session in Academic Block B.',
    status: 'scheduled',
  },
  {
    id: 'ASM-2026-004',
    applicationNo: 'APP-2026-004',
    studentName: 'Diya Patel',
    gradeApplied: 7,
    testDate: '2026-03-02',
    testType: 'Written & Interview',
    writtenScore: 68,
    maxWrittenScore: 100,
    interviewRating: 3.8,
    maxInterviewRating: 5.0,
    evaluatorName: 'Middle School Evaluation Panel',
    facultyRemarks: 'Recommended remedial language support for 1st term. Academic potential is solid.',
    status: 'evaluated',
  },
  {
    id: 'ASM-2026-005',
    applicationNo: 'APP-2026-005',
    studentName: 'Ishaan Reddy',
    gradeApplied: 10,
    testDate: '2026-03-01',
    testType: 'Aptitude Assessment',
    writtenScore: 52,
    maxWrittenScore: 100,
    interviewRating: 3.2,
    maxInterviewRating: 5.0,
    evaluatorName: 'Secondary Academic Board',
    facultyRemarks: 'Awaiting submission of previous term report card before final seat allocation.',
    status: 'on-hold',
  },
]

const statusLabels: Record<AssessmentStatus, string> = {
  scheduled: 'Test Scheduled',
  evaluated: 'Evaluated',
  recommended: 'Merit Recommended',
  'on-hold': 'On Hold / Review',
  rejected: 'Not Qualified',
}

const statusTones: Record<AssessmentStatus, BadgeTone> = {
  scheduled: 'planned',
  evaluated: 'neutral',
  recommended: 'neutral',
  'on-hold': 'planned',
  rejected: 'danger',
}

export function AdmissionsAssessmentsPage() {
  const [assessments, setAssessments] = useState<AdmissionAssessment[]>(SAMPLE_ASSESSMENTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [editingAssessment, setEditingAssessment] = useState<AdmissionAssessment | null>(null)
  const { toast } = useToast()

  const filtered = assessments.filter((asm) => {
    if (statusFilter !== 'all' && asm.status !== statusFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      asm.studentName.toLowerCase().includes(q) ||
      asm.applicationNo.toLowerCase().includes(q) ||
      asm.id.toLowerCase().includes(q)
    )
  })

  const totalAssessed = assessments.length
  const recommendedCount = assessments.filter((a) => a.status === 'recommended').length
  const scheduledCount = assessments.filter((a) => a.status === 'scheduled').length
  const evaluatedCount = assessments.filter((a) => a.writtenScore !== null).length
  const averageScore = Math.round(
    assessments
      .filter((a) => a.writtenScore !== null)
      .reduce((sum, a) => sum + (a.writtenScore ?? 0), 0) / (evaluatedCount || 1),
  )

  const handleSaveAssessment = (updated: AdmissionAssessment) => {
    setAssessments(assessments.map((a) => (a.id === updated.id ? updated : a)))
    toast.success('Evaluation Saved', `Assessment scores for ${updated.studentName} updated.`)
    setEditingAssessment(null)
  }

  const columns: TableColumn<AdmissionAssessment>[] = [
    {
      key: 'student',
      header: 'Applicant & grade',
      cell: (asm) => (
        <div>
          <div className="font-semibold text-ink">{asm.studentName}</div>
          <div className="text-xs text-ink-muted">Grade {asm.gradeApplied} · {asm.applicationNo}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Assessment type',
      cell: (asm) => (
        <div>
          <div className="font-medium text-ink">{asm.testType}</div>
          <div className="text-xs text-ink-muted tabular-nums">{asm.testDate}</div>
        </div>
      ),
    },
    {
      key: 'written',
      header: 'Written exam',
      cell: (asm) => (
        <div className="tabular-nums">
          {asm.writtenScore != null ? (
            <span className="font-semibold text-ink">
              {asm.writtenScore} <span className="text-xs font-normal text-ink-muted">/ {asm.maxWrittenScore}</span>
            </span>
          ) : (
            <span className="text-xs text-ink-muted">Pending Test</span>
          )}
        </div>
      ),
    },
    {
      key: 'interview',
      header: 'Interview rating',
      cell: (asm) => (
        <div className="tabular-nums">
          {asm.interviewRating != null ? (
            <span className="font-semibold text-ink">
              ★ {asm.interviewRating.toFixed(1)} <span className="text-xs font-normal text-ink-muted">/ {asm.maxInterviewRating.toFixed(1)}</span>
            </span>
          ) : (
            <span className="text-xs text-ink-muted">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'recommendation',
      header: 'Recommendation',
      cell: (asm) => (
        <Badge tone={statusTones[asm.status]}>
          {statusLabels[asm.status]}
        </Badge>
      ),
    },
    {
      key: 'remarks',
      header: 'Evaluator remarks',
      cell: (asm) => (
        <div className="max-w-xs truncate text-xs text-ink-muted" title={asm.facultyRemarks}>
          {asm.facultyRemarks}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (asm) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setEditingAssessment(asm)}
          className="flex items-center gap-1"
        >
          <PencilSimpleIcon className="size-3.5" />
          Enter Marks
        </Button>
      ),
    },
  ]

  return (
    <PageContainer
      title="Merit & Entrance Assessments"
      description="Track diagnostic entrance examinations, faculty interviews, merit ratings, and admission clearance."
      fullWidth
    >
      <div className="grid gap-5">
        {/* Metric tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-line bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Total Applicants</span>
              <UsersIcon className="size-4 text-primary" />
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{totalAssessed}</div>
            <div className="mt-0.5 text-xs text-ink-muted">Registered in intake pool</div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Merit Recommended</span>
              <TrophyIcon className="size-4 text-success" />
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{recommendedCount}</div>
            <div className="mt-0.5 text-xs text-ink-muted">Qualified for admission</div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Tests Scheduled</span>
              <ExamIcon className="size-4 text-accent" />
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{scheduledCount}</div>
            <div className="mt-0.5 text-xs text-ink-muted">Upcoming evaluations</div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Average Test Score</span>
              <TrendUpIcon className="size-4 text-primary" />
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{averageScore}%</div>
            <div className="mt-0.5 text-xs text-ink-muted">Across completed exams</div>
          </div>
        </div>

        {/* Filter controls */}
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-72">
              <Input
                label="Search Assessments"
                hideLabel
                placeholder="Search by student or app no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startIcon={MagnifyingGlassIcon}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                label="Filter by Status"
                hideLabel
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'All Assessments' },
                  { value: 'scheduled', label: 'Tests Scheduled' },
                  { value: 'evaluated', label: 'Evaluated' },
                  { value: 'recommended', label: 'Merit Recommended' },
                  { value: 'on-hold', label: 'On Hold' },
                ]}
              />
            </div>
          </div>
        </Card>

        <Card title="Assessment & Evaluation Ledger" description={`${filtered.length} candidates in assessment phase`}>
          <Table
            caption="Assessment & evaluation"
            hideCaption
            columns={columns}
            primaryKey="student"
            rows={filtered}
            getRowKey={(asm) => asm.id}
            empty={<div className="p-6 text-center text-xs text-ink-muted">No assessment records found.</div>}
          />
        </Card>
      </div>

      {editingAssessment && (
        <EditAssessmentDialog
          assessment={editingAssessment}
          open
          onClose={() => setEditingAssessment(null)}
          onSave={handleSaveAssessment}
        />
      )}
    </PageContainer>
  )
}

function EditAssessmentDialog({
  assessment,
  open,
  onClose,
  onSave,
}: {
  assessment: AdmissionAssessment
  open: boolean
  onClose: () => void
  onSave: (asm: AdmissionAssessment) => void
}) {
  const [writtenScore, setWrittenScore] = useState(
    assessment.writtenScore !== null ? String(assessment.writtenScore) : '',
  )
  const [interviewRating, setInterviewRating] = useState(
    assessment.interviewRating !== null ? String(assessment.interviewRating) : '',
  )
  const [evaluatorName, setEvaluatorName] = useState(assessment.evaluatorName)
  const [facultyRemarks, setFacultyRemarks] = useState(assessment.facultyRemarks)
  const [status, setStatus] = useState<AssessmentStatus>(assessment.status)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onSave({
      ...assessment,
      writtenScore: writtenScore.trim() ? parseFloat(writtenScore) : null,
      interviewRating: interviewRating.trim() ? parseFloat(interviewRating) : null,
      evaluatorName,
      facultyRemarks,
      status,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={`Score Entry: ${assessment.studentName}`}
      description={`Grade ${assessment.gradeApplied} · Application ${assessment.applicationNo}`}
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={`Written Test Score (Max: ${assessment.maxWrittenScore})`}
            type="number"
            min={0}
            max={assessment.maxWrittenScore}
            value={writtenScore}
            onChange={(e) => setWrittenScore(e.target.value)}
            placeholder="Score out of 100"
          />
          <Input
            label={`Interview Rating (Max: ${assessment.maxInterviewRating})`}
            type="number"
            step="0.1"
            min={0}
            max={assessment.maxInterviewRating}
            value={interviewRating}
            onChange={(e) => setInterviewRating(e.target.value)}
            placeholder="Rating out of 5.0"
          />
          <div className="sm:col-span-2">
            <Select
              label="Admission Recommendation"
              value={status}
              onValueChange={(val) => setStatus(val as AssessmentStatus)}
              options={[
                { value: 'recommended', label: 'Merit Recommended (Qualified for Admission)' },
                { value: 'evaluated', label: 'Evaluated (Standard Queue)' },
                { value: 'on-hold', label: 'On Hold (Review Required)' },
                { value: 'scheduled', label: 'Pending Test' },
                { value: 'rejected', label: 'Not Qualified' },
              ]}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Evaluating Officer / Panel"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
            />
          </div>
        </div>
        <Input
          label="Faculty Observations & Remarks"
          value={facultyRemarks}
          onChange={(e) => setFacultyRemarks(e.target.value)}
          placeholder="Strengths, language proficiency, subject notes..."
        />
        <div className="flex justify-end gap-2 pt-2 border-t border-line">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Assessment
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
