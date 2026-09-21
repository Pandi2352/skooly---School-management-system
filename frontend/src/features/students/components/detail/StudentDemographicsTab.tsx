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
            <dt className="text-xs text-ink-muted">Category</dt>
            <dd className="mt-1 font-semibold text-ink">{student.category ?? 'General'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">House Assignment</dt>
            <dd className="mt-1 font-semibold text-ink capitalize">{student.house ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Religion</dt>
            <dd className="mt-1 font-semibold text-ink">{student.religion ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">National ID / Aadhaar</dt>
            <dd className="mt-1 font-semibold tabular-nums text-ink">{student.nationalId ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Permanent Education No (PEN)</dt>
            <dd className="mt-1 font-semibold tabular-nums text-ink">{student.penId ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Caste & Sub-Caste</dt>
            <dd className="mt-1 font-semibold text-ink">
              {student.caste ? `${student.caste}${student.subCaste ? ` (${student.subCaste})` : ''}` : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Mother Tongue</dt>
            <dd className="mt-1 font-semibold text-ink">{student.motherTongue ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Place of Birth & Nationality</dt>
            <dd className="mt-1 font-semibold text-ink">
              {student.placeOfBirth ? `${student.placeOfBirth}, ` : ''}{student.nationality ?? 'Indian'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Special Quotas & Entitlements</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {student.belowPovertyLine && (
                <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
                  BPL Quota
                </span>
              )}
              {student.rightToEducation && (
                <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                  RTE Candidate
                </span>
              )}
              {!student.belowPovertyLine && !student.rightToEducation && (
                <span className="text-ink-muted">Standard Enrolment</span>
              )}
            </dd>
          </div>
          {Boolean(student.studentPhone ?? student.studentEmail) && (
            <div className="sm:col-span-2 lg:col-span-3 border-t border-line pt-2 text-xs text-ink-muted">
              Direct Contact: {student.studentPhone && <span className="font-semibold text-ink tabular-nums mr-3">📞 {student.studentPhone}</span>}
              {student.studentEmail && <span className="font-semibold text-ink">✉️ {student.studentEmail}</span>}
            </div>
          )}
        </dl>
      </Card>

      {/* Academic History & Biometrics */}
      <Card
        title="Academic History & Identification"
        description="Enrollment milestones, school background, and attendance tracking credentials."
      >
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-ink-muted">Admission Number</dt>
            <dd className="mt-1 font-semibold text-ink tabular-nums">{student.admissionNo}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Roll Number</dt>
            <dd className="mt-1 font-semibold text-ink tabular-nums">{student.rollNo}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Admission Date</dt>
            <dd className="mt-1 font-semibold text-ink tabular-nums">{formatDate(student.admissionDate)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Biometric Device ID</dt>
            <dd className="mt-1 font-semibold tabular-nums text-ink">{student.biometricId ?? '—'}</dd>
          </div>
          {student.previousSchool && (
            <div className="sm:col-span-2 lg:col-span-4 border-t border-line pt-2">
              <dt className="text-xs text-ink-muted">Previous School Attended</dt>
              <dd className="mt-0.5 font-semibold text-ink">{student.previousSchool}</dd>
            </div>
          )}
        </dl>
      </Card>

      {/* Bank Details & Billing Account */}
      {student.bank && (
        <Card
          title="Bank Details & Direct Billing"
          description="Disbursement account for scholarships, concessions, and auto-debit."
        >
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs text-ink-muted">Bank Name</dt>
              <dd className="mt-1 font-semibold text-ink">{student.bank.bankName ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Account Number</dt>
              <dd className="mt-1 font-semibold tabular-nums text-ink">{student.bank.accountNumber ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">IFSC Code</dt>
              <dd className="mt-1 font-semibold tabular-nums text-ink">{student.bank.ifscCode ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Account Holder Name</dt>
              <dd className="mt-1 font-semibold text-ink">{student.bank.accountHolderName ?? student.name}</dd>
            </div>
          </dl>
        </Card>
      )}

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
        <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-ink-muted">Height & Weight</dt>
            <dd className="mt-1 font-semibold text-ink tabular-nums">
              {student.heightCm ? `${student.heightCm} cm` : '—'} / {student.weightKg ? `${student.weightKg} kg` : '—'}
            </dd>
          </div>
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
