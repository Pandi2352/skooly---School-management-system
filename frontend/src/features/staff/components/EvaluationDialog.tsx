import { StarIcon } from '@phosphor-icons/react'
import { useState, type SyntheticEvent } from 'react'
import { useCreateEvaluation } from '../hooks/useStaff'
import { computeOverallRating, ratingLabel, ratingTone } from '../utils/evaluationUtils'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

type EvaluationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultStaffId?: string
  staffList?: { id: string; name: string }[]
}

export function EvaluationDialog({
  open,
  onOpenChange,
  defaultStaffId = 'staff-001',
  staffList = [
    { id: 'staff-001', name: 'Priya Sharma (EMP-0001)' },
    { id: 'staff-002', name: 'Arjun Mehta (EMP-0002)' },
    { id: 'staff-003', name: 'Sunita Patil (EMP-0003)' },
    { id: 'staff-004', name: 'Vikram Joshi (EMP-0004)' },
    { id: 'staff-005', name: 'Ananya Roy (EMP-0005)' },
  ],
}: EvaluationDialogProps) {
  const [staffId, setStaffId] = useState(defaultStaffId)
  const [evaluatorName, setEvaluatorName] = useState('Dr. S. Ramanathan')
  const [evaluatorRole, setEvaluatorRole] = useState('Principal')
  const [period, setPeriod] = useState('Term 1 - 2026')
  const [comments, setComments] = useState('')

  const [scores, setScores] = useState({
    subjectKnowledge: 4,
    classroomManagement: 4,
    communication: 4,
    punctuality: 5,
    teamwork: 4,
  })

  const [error, setError] = useState<string | null>(null)
  const createMutation = useCreateEvaluation()

  const overallRating = computeOverallRating(scores)

  const handleScoreChange = (key: keyof typeof scores, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async () => {
    setError(null)

    const staffMember = staffList.find((s) => s.id === staffId)
    const staffName = staffMember?.name.split(' (')[0] ?? 'Staff Member'

    try {
      await createMutation.mutateAsync({
        staffId,
        staffName,
        evaluatorId: 'admin-001',
        evaluatorName: evaluatorName.trim(),
        evaluatorRole: evaluatorRole.trim(),
        period: period.trim(),
        scores,
        overallRating,
        comments: comments.trim() || undefined,
      })
      onOpenChange(false)
      setComments('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record evaluation.')
    }
  }

  const staffOptions = staffList.map((s) => ({ value: s.id, label: s.name }))

  const criteriaList: { key: keyof typeof scores; label: string }[] = [
    { key: 'subjectKnowledge', label: 'Subject Knowledge & Pedagogy' },
    { key: 'classroomManagement', label: 'Classroom Discipline & Management' },
    { key: 'communication', label: 'Student & Parent Communication' },
    { key: 'punctuality', label: 'Punctuality & Attendance' },
    { key: 'teamwork', label: 'Institutional Teamwork & Initiative' },
  ]

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Record Faculty Evaluation"
      description="Appraise teaching faculty on standard academic and institutional metrics."
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              void handleSubmit()
            }}
            loading={createMutation.isPending}
          >
            Submit Evaluation
          </Button>
        </div>
      }
    >
      <form
        onSubmit={(e: SyntheticEvent) => {
          e.preventDefault()
          void handleSubmit()
        }}
        className="grid gap-4 py-2"
      >
        {error && (
          <div className="rounded-sm bg-danger/10 p-3 text-sm text-danger">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select
            label="Staff Member"
            required
            value={staffId}
            options={staffOptions}
            onValueChange={setStaffId}
          />
          <Input
            label="Appraisal Period"
            required
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="e.g. Term 1 - 2026 / Annual"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Evaluator Name"
            required
            value={evaluatorName}
            onChange={(e) => setEvaluatorName(e.target.value)}
          />
          <Input
            label="Evaluator Role / Designation"
            required
            value={evaluatorRole}
            onChange={(e) => setEvaluatorRole(e.target.value)}
          />
        </div>

        <div className="space-y-3 rounded-md border border-line bg-canvas/40 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Performance Criteria (Scale 1 to 5)
          </h4>
          <div className="space-y-2.5">
            {criteriaList.map((crit) => (
              <div
                key={crit.key}
                className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center text-sm"
              >
                <span className="font-medium text-ink">{crit.label}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleScoreChange(crit.key, star)}
                      className="p-1 text-amber-500 transition-transform hover:scale-110"
                    >
                      <StarIcon
                        weight={star <= scores[crit.key] ? 'fill' : 'regular'}
                        className="size-5"
                      />
                    </button>
                  ))}
                  <span className="ms-2 w-6 text-center font-mono font-bold tabular-nums text-ink">
                    {scores[crit.key]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
            <span className="text-sm font-semibold text-ink">Computed Overall Rating:</span>
            <div className="flex items-center gap-2">
              <span className={`text-base font-bold ${ratingTone(overallRating)}`}>
                {overallRating} / 5
              </span>
              <span className="text-xs text-ink-muted">({ratingLabel(overallRating)})</span>
            </div>
          </div>
        </div>

        <Textarea
          label="Observations & Feedback"
          placeholder="Specific pedagogical strengths, areas of improvement, or commendable work..."
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </form>
    </Dialog>
  )
}
