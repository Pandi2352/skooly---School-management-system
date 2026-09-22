import type { StaffDetail } from '../../types/staff.types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

type StaffAcademicTabProps = {
  staff: StaffDetail
}

export function StaffAcademicTab({ staff }: StaffAcademicTabProps) {
  const { qualifications, experience, subjects, classes } = staff

  return (
    <div className="grid gap-6">
      {/* Subjects & Classes */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Teaching Assignments
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-medium text-ink-muted">Assigned Subjects</div>
            <div className="flex flex-wrap gap-1.5">
              {subjects.length > 0 ? (
                subjects.map((sub) => (
                  <Badge key={sub} tone="info">
                    {sub}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-ink-muted">No subjects assigned</span>
              )}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium text-ink-muted">Assigned Classes / Grades</div>
            <div className="flex flex-wrap gap-1.5">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <Badge key={cls} tone="neutral">
                    Grade {cls}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-ink-muted">No classes assigned</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Qualifications */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Educational Qualifications
        </h3>
        {qualifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs font-semibold uppercase text-ink-muted">
                <tr>
                  <th className="py-2 pr-4">Degree / Diploma</th>
                  <th className="py-2 pr-4">Institution / Board</th>
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2 pr-4">Grade / %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {qualifications.map((q, idx) => (
                  <tr key={idx} className="hover:bg-canvas/50">
                    <td className="py-2.5 pr-4 font-medium text-ink">{q.degree}</td>
                    <td className="py-2.5 pr-4 text-ink-muted">{q.institution}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-ink-muted">{q.year}</td>
                    <td className="py-2.5 pr-4 text-ink-muted">{q.grade ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-ink-muted">No qualifications recorded.</div>
        )}
      </Card>

      {/* Work Experience */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Prior Work Experience
        </h3>
        {experience.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs font-semibold uppercase text-ink-muted">
                <tr>
                  <th className="py-2 pr-4">Institution / Organization</th>
                  <th className="py-2 pr-4">Designation</th>
                  <th className="py-2 pr-4">From</th>
                  <th className="py-2 pr-4">To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {experience.map((exp, idx) => (
                  <tr key={idx} className="hover:bg-canvas/50">
                    <td className="py-2.5 pr-4 font-medium text-ink">{exp.institution}</td>
                    <td className="py-2.5 pr-4 text-ink-muted">{exp.designation}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-ink-muted">{exp.from}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-ink-muted">
                      {exp.isCurrent ? (
                        <span className="font-semibold text-emerald-600">Present</span>
                      ) : (
                        (exp.to ?? '—')
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-ink-muted">No prior work experience added.</div>
        )}
      </Card>
    </div>
  )
}
