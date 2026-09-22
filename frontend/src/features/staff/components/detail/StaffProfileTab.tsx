import type { StaffDetail } from '../../types/staff.types'
import { Card } from '@/components/ui/Card'

type StaffProfileTabProps = {
  staff: StaffDetail
}

export function StaffProfileTab({ staff }: StaffProfileTabProps) {
  const { personalInfo, contactInfo } = staff

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Personal Information
        </h3>
        <dl className="grid grid-cols-2 gap-y-3.5 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">First Name</dt>
            <dd className="font-medium text-ink">{personalInfo.firstName}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Last Name</dt>
            <dd className="font-medium text-ink">{personalInfo.lastName}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Date of Birth</dt>
            <dd className="font-medium text-ink">{personalInfo.dateOfBirth ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Gender</dt>
            <dd className="font-medium capitalize text-ink">{personalInfo.gender}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Blood Group</dt>
            <dd className="font-medium text-ink">{personalInfo.bloodGroup ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Aadhaar Number</dt>
            <dd className="font-mono text-xs text-ink">
              {personalInfo.aadhaarNumber ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">PAN Card</dt>
            <dd className="font-mono text-xs text-ink">{personalInfo.panNumber ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Category</dt>
            <dd className="font-medium text-ink">{personalInfo.category ?? '—'}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Contact Details
        </h3>
        <dl className="grid grid-cols-1 gap-y-3.5 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">Primary Phone</dt>
            <dd className="font-mono text-sm text-ink">{contactInfo.phone}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Alternate Phone</dt>
            <dd className="font-mono text-sm text-ink">
              {contactInfo.altPhone ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Official Email</dt>
            <dd className="font-medium text-ink">{contactInfo.email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Residential Address</dt>
            <dd className="font-medium text-ink">{contactInfo.address ?? '—'}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
