import {
  DotsThreeVerticalIcon,
  EyeIcon,
  GraduationCapIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { ADMISSION_PERMISSIONS } from '../constants/admissionPermissions'
import type { AdmissionApplication } from '../schemas/admissionPipeline.schema'

export type AdmissionAction = 'review' | 'edit' | 'enroll' | 'delete'

type AdmissionRowActionsProps = {
  application: AdmissionApplication
  onAction: (action: AdmissionAction, application: AdmissionApplication) => void
}

/**
 * Review is the everyday action, so it stays a button; the rest are one click further in. Actions a
 * rule or a permission forbids stay visible but disabled, with the reason, so "why can't I enrol
 * this applicant?" is answered where it is asked.
 */
export function AdmissionRowActions({ application, onAction }: AdmissionRowActionsProps) {
  const { can } = usePermissions()
  const mayEdit = can(ADMISSION_PERMISSIONS.edit)
  const mayDelete = can(ADMISSION_PERMISSIONS.delete)
  const isEnrolled = application.status === 'enrolled'
  const name = `${application.student.firstName} ${application.student.lastName}`

  const enrolReason = !mayEdit
    ? 'Your role can view applications but not change them.'
    : isEnrolled
      ? 'This applicant is already enrolled.'
      : application.status !== 'approved'
        ? 'Approve the application first.'
        : null

  const deleteReason = !mayDelete
    ? 'Your role can’t delete applications.'
    : isEnrolled
      ? 'Enrolled applications are kept: the student record points back to this one.'
      : null

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="secondary" size="sm" onClick={() => onAction('review', application)}>
        <EyeIcon className="size-4" aria-hidden="true" />
        Review
      </Button>

      <Dropdown trigger={<IconButton label={`More actions for ${name}`} icon={DotsThreeVerticalIcon} size="sm" />}>
        <DropdownItem
          icon={PencilSimpleIcon}
          disabled={!mayEdit}
          onSelect={mayEdit ? () => onAction('edit', application) : undefined}
        >
          <span className="grid">
            <span>Edit details</span>
            {!mayEdit && (
              <span className="text-xs font-normal text-ink-muted">
                Your role can view applications but not change them.
              </span>
            )}
          </span>
        </DropdownItem>

        <DropdownItem
          icon={GraduationCapIcon}
          disabled={enrolReason !== null}
          onSelect={enrolReason === null ? () => onAction('enroll', application) : undefined}
        >
          <span className="grid">
            <span>Enrol as a student</span>
            {enrolReason && <span className="text-xs font-normal text-ink-muted">{enrolReason}</span>}
          </span>
        </DropdownItem>

        <DropdownSeparator />

        <DropdownItem
          icon={TrashIcon}
          tone="danger"
          disabled={deleteReason !== null}
          onSelect={deleteReason === null ? () => onAction('delete', application) : undefined}
        >
          <span className="grid">
            <span>Delete application</span>
            {deleteReason && <span className="text-xs font-normal text-ink-muted">{deleteReason}</span>}
          </span>
        </DropdownItem>
      </Dropdown>
    </div>
  )
}
