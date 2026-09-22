import { StarIcon } from '@phosphor-icons/react'
import { useEvaluations } from '../../hooks/useStaff'
import type { StaffDetail } from '../../types/staff.types'
import { Card } from '@/components/ui/Card'
import { ratingLabel, ratingTone } from '../../utils/evaluationUtils'

type StaffEvaluationsTabProps = {
  staff: StaffDetail
}

export function StaffEvaluationsTab({ staff }: StaffEvaluationsTabProps) {
  const { data: evaluations = [], isLoading } = useEvaluations(staff.id)

  const staffEvals = evaluations.filter((e) => e.staffId === staff.id)

  return (
    <div className="grid gap-6">
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Teacher Evaluations & Ratings
        </h3>
        {isLoading ? (
          <div className="py-4 text-sm text-ink-muted">Loading evaluations...</div>
        ) : staffEvals.length > 0 ? (
          <div className="space-y-4">
            {staffEvals.map((ev) => (
              <div
                key={ev.id}
                className="rounded-md border border-line bg-canvas/40 p-4 transition-colors"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{ev.period}</span>
                      <span className="text-xs text-ink-muted">
                        • Evaluator: {ev.evaluatorName ?? ev.evaluatorRole} ({ev.evaluatorRole})
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                      <span>Date: {ev.createdAt ? ev.createdAt.split('T')[0] : '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          weight={star <= Math.round(ev.overallRating) ? 'fill' : 'regular'}
                          className="size-4"
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-bold ${ratingTone(ev.overallRating)}`}>
                      {ev.overallRating} / 5 ({ratingLabel(ev.overallRating)})
                    </span>
                  </div>
                </div>

                {/* Criteria breakdown */}
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
                  <div className="rounded border border-line/60 bg-surface p-2">
                    <span className="text-ink-muted">Subject Knowledge:</span>{' '}
                    <span className="font-semibold text-ink">{ev.scores.subjectKnowledge}/5</span>
                  </div>
                  <div className="rounded border border-line/60 bg-surface p-2">
                    <span className="text-ink-muted">Classroom Mgmt:</span>{' '}
                    <span className="font-semibold text-ink">{ev.scores.classroomManagement}/5</span>
                  </div>
                  <div className="rounded border border-line/60 bg-surface p-2">
                    <span className="text-ink-muted">Communication:</span>{' '}
                    <span className="font-semibold text-ink">{ev.scores.communication}/5</span>
                  </div>
                  <div className="rounded border border-line/60 bg-surface p-2">
                    <span className="text-ink-muted">Punctuality:</span>{' '}
                    <span className="font-semibold text-ink">{ev.scores.punctuality}/5</span>
                  </div>
                  <div className="rounded border border-line/60 bg-surface p-2">
                    <span className="text-ink-muted">Teamwork:</span>{' '}
                    <span className="font-semibold text-ink">{ev.scores.teamwork}/5</span>
                  </div>
                </div>

                {ev.comments && (
                  <p className="mt-3 text-sm italic text-ink-muted">
                    "{ev.comments}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-ink-muted">
            No evaluations recorded for this staff member yet.
          </div>
        )}
      </Card>
    </div>
  )
}
