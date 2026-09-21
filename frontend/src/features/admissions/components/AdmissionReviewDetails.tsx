import {
  BankIcon,
  CheckSquareOffsetIcon,
  FirstAidKitIcon,
  GraduationCapIcon,
  IdentificationCardIcon,
  PhoneIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatMoney } from '@/lib/format'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'
import { calculateApplicantAge } from '../utils/admissionsPipelineUtils'

type Props = {
  application: AdmissionApplication
}

function DetailItem({
  label,
  value,
  truncate = false,
}: {
  label: string
  value: React.ReactNode
  truncate?: boolean
}) {
  return (
    <div className="min-w-0">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <p
        className={`mt-0.5 text-xs font-semibold text-ink ${
          truncate ? 'truncate' : 'break-words'
        }`}
      >
        {value ?? '—'}
      </p>
    </div>
  )
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string; weight?: 'bold' | 'fill' | 'regular' }>
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-3.5">
      <div className="flex items-center gap-2 border-b border-line pb-2.5 font-semibold text-ink text-xs uppercase tracking-wide">
        <Icon className="h-4 w-4 text-primary" weight="bold" />
        <span>{title}</span>
      </div>
      {children}
    </section>
  )
}

export function AdmissionReviewDetails({ application }: Props) {
  const { student, parent, academic, health, bank, feeGroupIds, customFields } = application
  const age = calculateApplicantAge(student.dateOfBirth)

  const hasFatherDetails = [
    parent.fatherName,
    parent.fatherPhone,
    parent.fatherOccupation,
    parent.fatherQualification,
  ].some((val) => Boolean(val && val.length > 0))

  const hasMotherDetails = [
    parent.motherName,
    parent.motherPhone,
    parent.motherOccupation,
    parent.motherQualification,
  ].some((val) => Boolean(val && val.length > 0))

  const hasDirectContact = [student.phone, student.email].some(
    (val) => Boolean(val && val.length > 0),
  )

  const customFieldEntries = Object.entries(customFields ?? {})

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* 1. Academic & Enrollment Details */}
      <SectionCard title="Academic & Enrollment" icon={GraduationCapIcon}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <DetailItem
            label="Grade Applied"
            value={`Grade ${student.gradeApplied}${academic?.section ? ` - Sec ${academic.section}` : ''}`}
          />
          <DetailItem label="Admission Number" value={academic?.admissionNo ?? 'Not Assigned'} />
          <DetailItem label="Roll Number" value={academic?.rollNo ?? 'Not Assigned'} />
          <DetailItem
            label="Admission Date"
            value={academic?.admissionDate ? formatDate(academic.admissionDate) : '—'}
          />
          <DetailItem label="Biometric ID" value={academic?.biometricId ?? '—'} />
          <DetailItem
            label="Opening Due Balance"
            value={
              academic?.openingDuePaise !== undefined
                ? formatMoney(academic.openingDuePaise)
                : '₹0.00'
            }
          />
        </div>
        {student.previousSchool && (
          <div className="border-t border-line pt-2.5">
            <DetailItem label="Previous School Attended" value={student.previousSchool} />
          </div>
        )}
      </SectionCard>

      {/* 2. Complete Personal Demographics & Identity */}
      <SectionCard title="Applicant Details & Identity" icon={IdentificationCardIcon}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <DetailItem
            label="Full Name"
            value={`${student.firstName} ${student.middleName ? `${student.middleName} ` : ''}${student.lastName}`}
          />
          <DetailItem label="Date of Birth" value={`${student.dateOfBirth} (${age} yrs)`} />
          <DetailItem label="Gender" value={<span className="capitalize">{student.gender}</span>} />
          <DetailItem label="Blood Group" value={student.bloodGroup ? student.bloodGroup : '—'} />
          <DetailItem label="Religion" value={student.religion ?? '—'} />
          <DetailItem label="Social Category" value={student.category ?? '—'} />
          <DetailItem label="House / Team" value={student.house ?? '—'} />
          <DetailItem label="National ID (Aadhaar)" value={student.nationalId ?? '—'} />
          <DetailItem label="PEN ID" value={student.penId ?? '—'} />
          <DetailItem
            label="Caste & Sub-Caste"
            value={
              student.caste
                ? `${student.caste}${student.subCaste ? ` (${student.subCaste})` : ''}`
                : '—'
            }
          />
          <DetailItem label="Mother Tongue" value={student.motherTongue ?? '—'} />
          <DetailItem label="Nationality" value={student.nationality ?? 'Indian'} />
          <DetailItem label="Place of Birth" value={student.placeOfBirth ?? '—'} />
          <DetailItem
            label="BPL (Below Poverty Line)"
            value={
              <Badge tone={student.belowPovertyLine ? 'info' : 'neutral'}>
                {student.belowPovertyLine ? 'Yes' : 'No'}
              </Badge>
            }
          />
          <DetailItem
            label="RTE (Right to Education)"
            value={
              <Badge tone={student.rightToEducation ? 'primary' : 'neutral'}>
                {student.rightToEducation ? 'Yes' : 'No'}
              </Badge>
            }
          />
        </div>
        {hasDirectContact && (
          <div className="grid grid-cols-2 gap-3 border-t border-line pt-2.5">
            <DetailItem label="Student Direct Phone" value={student.phone ?? '—'} />
            <DetailItem label="Student Direct Email" value={student.email ?? '—'} />
          </div>
        )}
      </SectionCard>

      {/* 3. Parents & Family Profile */}
      <SectionCard title="Family & Guardians" icon={UsersThreeIcon}>
        {/* Primary Guardian Card */}
        <div className="rounded-md border border-line bg-canvas p-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink text-sm">{parent.name}</span>
            <Badge tone="primary">Primary ({parent.guardianType})</Badge>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-ink">
              <PhoneIcon className="h-3.5 w-3.5 text-ink-muted" />
              <span>{parent.phone}</span>
            </div>
            <div>
              <span className="text-ink-muted">Email: </span>
              <span className="text-ink font-medium">{parent.email}</span>
            </div>
            {parent.occupation && (
              <div>
                <span className="text-ink-muted">Occupation: </span>
                <span className="text-ink font-medium">{parent.occupation}</span>
              </div>
            )}
            {parent.address && (
              <div className="sm:col-span-2">
                <span className="text-ink-muted">Guardian Address: </span>
                <span className="text-ink font-medium">{parent.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Father & Mother Profile Grid */}
        {(hasFatherDetails || hasMotherDetails) && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {hasFatherDetails && (
              <div className="rounded-md border border-line bg-canvas p-2.5">
                <p className="font-semibold text-ink text-xs uppercase tracking-wider mb-2 text-primary">
                  Father Profile
                </p>
                <div className="grid gap-1.5">
                  <DetailItem label="Father Name" value={parent.fatherName} />
                  <DetailItem label="Phone" value={parent.fatherPhone} />
                  <DetailItem label="Occupation" value={parent.fatherOccupation} />
                  <DetailItem label="Qualification" value={parent.fatherQualification} />
                  <DetailItem label="Aadhaar" value={parent.fatherAadhaar} />
                  {parent.fatherIncomePaise !== null &&
                    parent.fatherIncomePaise !== undefined && (
                      <DetailItem
                        label="Annual Income"
                        value={formatMoney(parent.fatherIncomePaise)}
                      />
                    )}
                </div>
              </div>
            )}

            {hasMotherDetails && (
              <div className="rounded-md border border-line bg-canvas p-2.5">
                <p className="font-semibold text-ink text-xs uppercase tracking-wider mb-2 text-primary">
                  Mother Profile
                </p>
                <div className="grid gap-1.5">
                  <DetailItem label="Mother Name" value={parent.motherName} />
                  <DetailItem label="Phone" value={parent.motherPhone} />
                  <DetailItem label="Occupation" value={parent.motherOccupation} />
                  <DetailItem label="Qualification" value={parent.motherQualification} />
                  <DetailItem label="Aadhaar" value={parent.motherAadhaar} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Emergency Contact & Permanent Address */}
        <div className="grid grid-cols-1 gap-3 border-t border-line pt-2.5 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium text-ink-muted">Emergency Contact</span>
            <p className="mt-0.5 font-semibold text-ink">
              {parent.emergencyName ?? '—'}
              {parent.emergencyPhone ? ` (${parent.emergencyPhone})` : ''}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-ink-muted">Permanent Living Address</span>
            <p className="mt-0.5 font-semibold text-ink">
              {[parent.permanentAddress, parent.address].find((val) => Boolean(val && val.trim().length > 0)) ?? '—'}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* 4. Health & Medical */}
      <SectionCard title="Health & Physical Profile" icon={FirstAidKitIcon}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DetailItem
            label="Height"
            value={health?.heightCm ? `${health.heightCm} cm` : '—'}
          />
          <DetailItem
            label="Weight"
            value={health?.weightKg ? `${health.weightKg} kg` : '—'}
          />
          <div className="col-span-2">
            <DetailItem
              label="Known Allergies"
              value={health?.allergies ?? 'No known allergies reported'}
            />
          </div>
          <div className="col-span-2 sm:col-span-4">
            <DetailItem
              label="Medical Conditions / Precautions"
              value={health?.medicalConditions ?? 'None reported'}
            />
          </div>
        </div>
      </SectionCard>

      {/* 5. Bank & Fee Groups */}
      <SectionCard title="Bank Details & Assigned Fees" icon={BankIcon}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DetailItem label="Account Holder" value={bank?.accountHolder ?? '—'} />
          <DetailItem label="Bank Name" value={bank?.bankName ?? '—'} />
          <DetailItem label="Account Number" value={bank?.accountNumber ?? '—'} />
          <DetailItem label="IFSC Code" value={bank?.ifsc ?? '—'} />
        </div>
        {feeGroupIds && feeGroupIds.length > 0 && (
          <div className="border-t border-line pt-2.5">
            <span className="text-xs font-medium text-ink-muted">Enrolled Fee Groups</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {feeGroupIds.map((feeId) => (
                <Badge key={feeId} tone="neutral">
                  {feeId}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      {/* 6. Custom Field Answers (if any) */}
      {customFieldEntries.length > 0 && (
        <SectionCard title="Additional Form Fields" icon={CheckSquareOffsetIcon}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {customFieldEntries.map(([key, value]) => (
              <DetailItem key={key} label={key} value={value} />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
