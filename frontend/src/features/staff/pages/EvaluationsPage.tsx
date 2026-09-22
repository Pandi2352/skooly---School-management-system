import { PlusIcon, StarIcon, TrophyIcon, UsersIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { PageContainer } from '@/components/page/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EvaluationDialog } from '../components/EvaluationDialog'
import { useEvaluations } from '../hooks/useStaff'
import { averageRating, ratingLabel, ratingTone } from '../utils/evaluationUtils'

export function EvaluationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: evaluations = [], isLoading } = useEvaluations()

  const avgOverall = averageRating(evaluations)
  const totalEvals = evaluations.length
  const excellentCount = evaluations.filter((e) => e.overallRating >= 4.5).length

  return (
    <PageContainer
      title="Teacher & Faculty Evaluations"
      description="Appraise teaching pedagogy, classroom engagement, institutional contribution, and student feedback."
      fullWidth
      actions={
        <Button
          variant="primary"
          onClick={() => setDialogOpen(true)}
        >
          <PlusIcon className="size-4" />
          Record Faculty Evaluation
        </Button>
      }
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Evaluations Conducted
              </span>
              <UsersIcon className="size-4.5 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-ink">
              {totalEvals}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Campus Average Rating
              </span>
              <StarIcon className="size-4.5 text-amber-500" weight="fill" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black tabular-nums text-ink">
                {avgOverall ?? '—'} <span className="text-sm font-normal text-ink-muted">/ 5.0</span>
              </span>
              {avgOverall && (
                <span className="text-xs font-semibold text-emerald-600">
                  {ratingLabel(avgOverall)}
                </span>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Exemplary Ratings (4.5+)
              </span>
              <TrophyIcon className="size-4.5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black tabular-nums text-emerald-600">
              {excellentCount}
            </div>
          </Card>
        </div>

        {/* Evaluation Records */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
            Evaluation Logs & Appraisals
          </h3>

          {isLoading ? (
            <Card className="p-8 text-center text-sm text-ink-muted">
              Loading faculty evaluations...
            </Card>
          ) : evaluations.length > 0 ? (
            <div className="grid gap-4">
              {evaluations.map((ev) => (
                <Card key={ev.id} className="p-5 transition-shadow hover:shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="font-bold text-ink">{ev.staffName ?? 'Staff Member'}</h4>
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {ev.period}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        Evaluator: {ev.evaluatorName ?? ev.evaluatorRole} ({ev.evaluatorRole}) • Recorded:{' '}
                        {ev.createdAt ? ev.createdAt.split('T')[0] : '—'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            weight={star <= Math.round(ev.overallRating) ? 'fill' : 'regular'}
                            className="size-4.5"
                          />
                        ))}
                      </div>
                      <span className={`text-base font-bold ${ratingTone(ev.overallRating)}`}>
                        {ev.overallRating} / 5
                      </span>
                    </div>
                  </div>

                  {/* Criteria Breakdown Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
                    <div className="rounded border border-line/60 bg-canvas/60 p-2 text-center">
                      <div className="text-ink-muted">Subject Knowledge</div>
                      <div className="mt-1 font-bold tabular-nums text-ink">
                        {ev.scores.subjectKnowledge}/5
                      </div>
                    </div>
                    <div className="rounded border border-line/60 bg-canvas/60 p-2 text-center">
                      <div className="text-ink-muted">Classroom Mgmt</div>
                      <div className="mt-1 font-bold tabular-nums text-ink">
                        {ev.scores.classroomManagement}/5
                      </div>
                    </div>
                    <div className="rounded border border-line/60 bg-canvas/60 p-2 text-center">
                      <div className="text-ink-muted">Communication</div>
                      <div className="mt-1 font-bold tabular-nums text-ink">
                        {ev.scores.communication}/5
                      </div>
                    </div>
                    <div className="rounded border border-line/60 bg-canvas/60 p-2 text-center">
                      <div className="text-ink-muted">Punctuality</div>
                      <div className="mt-1 font-bold tabular-nums text-ink">
                        {ev.scores.punctuality}/5
                      </div>
                    </div>
                    <div className="rounded border border-line/60 bg-canvas/60 p-2 text-center">
                      <div className="text-ink-muted">Teamwork</div>
                      <div className="mt-1 font-bold tabular-nums text-ink">
                        {ev.scores.teamwork}/5
                      </div>
                    </div>
                  </div>

                  {ev.comments && (
                    <div className="mt-3.5 rounded-md border border-line/40 bg-surface p-3 text-xs italic text-ink-muted">
                      "{ev.comments}"
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-sm text-ink-muted">
              No faculty evaluations recorded yet. Use the button above to record the first appraisal.
            </Card>
          )}
        </div>
      </div>

      <EvaluationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </PageContainer>
  )
}
