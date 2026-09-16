import { FirstAidKitIcon, HouseIcon } from '@phosphor-icons/react'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/format'
import type { StudentDetail } from '../../types/student.types'

export function StudentDemographicsTab({ student }: { student: StudentDetail }) {
  return (
    <div className="grid gap-6">
      {/* Basic Demographics */}
      <Card
        title="Personal & Admission Information"
        description="Official demographic details recorded during enrollment."
      >
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs text-ink-muted">Date of Birth</dt>
            <dd className="mt-1 font-semibold text-ink tabular-nums">{formatDate(student.dob)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Gender</dt>
            <dd className="mt-1 font-semibold text-ink capitalize">{student.gender}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Blood Group</dt>
            <dd className="mt-1 font-semibold text-ink">{student.bloodGroup}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Admission Date</dt>
            <dd className="mt-1 font-semibold text-ink tabular-nums">
              {formatDate(student.admissionDate)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Admission Number</dt>
            <dd className="mt-1 font-semibold text-ink tabular-nums">{student.admissionNo}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Roll Number</dt>
            <dd className="mt-1 font-semibold text-ink tabular-nums">{student.rollNo}</dd>
          </div>
        </dl>
      </Card>

      {/* Residential Information */}
      <Card title="Residential Address" description="Current primary living address on file.">
        <div className="flex items-start gap-3 text-sm">
          <HouseIcon className="mt-0.5 size-5 flex-none text-ink-muted" aria-hidden="true" />
          <div className="grid gap-1">
            <p className="font-medium text-ink">{student.residentialAddress}</p>
            <p className="text-ink-muted">
              {student.city}, Karnataka - <span className="tabular-nums">{student.pincode}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Health & Medical */}
      <Card
        title="Health & Medical Records"
        description="Physical profile, known allergies, and emergency medical contacts."
      >
        <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
              <FirstAidKitIcon className="size-4 text-danger" aria-hidden="true" />
              Known Allergies
            </dt>
            <dd className="mt-1 font-medium text-ink">
              {student.medical.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {student.medical.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="rounded-md border border-line bg-canvas px-2 py-0.5 text-xs font-semibold text-ink"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-ink-muted">No known allergies reported</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-ink-muted">Ongoing Medications</dt>
            <dd className="mt-1 font-medium text-ink">
              {student.medical.medications.length > 0 ? (
                <span>{student.medical.medications.join(', ')}</span>
              ) : (
                <span className="text-ink-muted">None</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-ink-muted">Emergency Medical Contact</dt>
            <dd className="mt-1 font-medium text-ink">
              <div>
                {student.medical.emergencyContact.name} ({student.medical.emergencyContact.relation}
                )
              </div>
              <div className="mt-0.5 text-xs text-ink-muted tabular-nums">
                {student.medical.emergencyContact.phone}
              </div>
            </dd>
          </div>
        </div>

        {student.medical.doctorNotes && (
          <div className="mt-4 rounded-md border border-line bg-canvas p-3 text-xs text-ink-muted">
            <span className="font-semibold text-ink">Medical note: </span>
            {student.medical.doctorNotes}
          </div>
        )}
      </Card>
    </div>
  )
}
