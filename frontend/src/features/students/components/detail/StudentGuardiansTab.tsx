import { ArrowSquareOutIcon, EnvelopeIcon, PhoneIcon, UsersIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Card } from '@/components/ui/Card'
import type { StudentDetail } from '../../types/student.types'

export function StudentGuardiansTab({ student }: { student: StudentDetail }) {
  const { primaryGuardian, secondaryGuardian, siblings } = student

  return (
    <div className="grid gap-6">
      {/* Primary & Secondary Guardians */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Primary Guardian */}
        <Card
          title="Primary Guardian"
          description={`Primary emergency contact and billing point of contact.`}
        >
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-ink">{primaryGuardian.name}</span>
              <span className="rounded-md border border-line bg-canvas px-2 py-0.5 text-xs font-semibold text-ink-muted">
                {primaryGuardian.relation}
              </span>
            </div>

            <div className="flex items-center gap-2 text-ink-muted">
              <PhoneIcon className="size-4 flex-none" aria-hidden="true" />
              <span className="font-medium text-ink tabular-nums">{primaryGuardian.phone}</span>
            </div>

            {primaryGuardian.email && (
              <div className="flex items-center gap-2 text-ink-muted">
                <EnvelopeIcon className="size-4 flex-none" aria-hidden="true" />
                <span className="text-ink">{primaryGuardian.email}</span>
              </div>
            )}

            {primaryGuardian.occupation && (
              <div className="text-xs text-ink-muted">
                Occupation:{' '}
                <span className="font-medium text-ink">{primaryGuardian.occupation}</span>
              </div>
            )}

            {primaryGuardian.address && (
              <div className="border-t border-line pt-2 text-xs text-ink-muted">
                {primaryGuardian.address}
              </div>
            )}
          </div>
        </Card>

        {/* Secondary Guardian */}
        {secondaryGuardian ? (
          <Card title="Secondary Guardian" description="Alternate family contact.">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-ink">{secondaryGuardian.name}</span>
                <span className="rounded-md border border-line bg-canvas px-2 py-0.5 text-xs font-semibold text-ink-muted">
                  {secondaryGuardian.relation}
                </span>
              </div>

              <div className="flex items-center gap-2 text-ink-muted">
                <PhoneIcon className="size-4 flex-none" aria-hidden="true" />
                <span className="font-medium text-ink tabular-nums">{secondaryGuardian.phone}</span>
              </div>

              {secondaryGuardian.email && (
                <div className="flex items-center gap-2 text-ink-muted">
                  <EnvelopeIcon className="size-4 flex-none" aria-hidden="true" />
                  <span className="text-ink">{secondaryGuardian.email}</span>
                </div>
              )}

              {secondaryGuardian.occupation && (
                <div className="text-xs text-ink-muted">
                  Occupation:{' '}
                  <span className="font-medium text-ink">{secondaryGuardian.occupation}</span>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card title="Secondary Guardian" description="No secondary contact registered.">
            <p className="text-xs text-ink-muted">
              Only primary guardian contact information is currently on file.
            </p>
          </Card>
        )}
      </div>

      {/* Sibling Linkage Section */}
      <Card
        title="Enrolled Siblings"
        description="Brothers or sisters currently studying in this school. Enables family fee concessions."
      >
        {siblings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((sib) => (
              <Link
                key={sib.id}
                to={paths.student(sib.id)}
                className="group flex items-center justify-between rounded-md border border-line bg-surface p-3.5 shadow-2xs transition-colors hover:border-primary hover:bg-canvas focus-visible:outline-accent"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 flex-none items-center justify-center rounded-md border border-line bg-canvas text-sm font-bold text-ink-muted group-hover:border-primary">
                    <UsersIcon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="grid min-w-0">
                    <span className="truncate text-sm font-semibold text-ink group-hover:text-primary">
                      {sib.name}
                    </span>
                    <span className="text-xs text-ink-muted">
                      Class {sib.grade}-{sib.section} · {sib.relationship}
                    </span>
                  </div>
                </div>
                <ArrowSquareOutIcon
                  className="size-4 flex-none text-ink-muted group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-line p-6 text-center text-xs text-ink-muted">
            No enrolled siblings found for this student.
          </div>
        )}
      </Card>
    </div>
  )
}
