import { UsersThreeIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { formatMoney } from '@/lib/format'
import type { EnrollmentStatus, Student } from '../types/student.types'
import { enrollmentLabels } from '../utils/studentColumns'
import { formatSiblingCount, hasFeeDue } from '../utils/studentStatus'

// Cell renderers shared by the table and card views, so both show a student the same way.

export function StudentNameLink({ student }: { student: Student }) {
  return (
    <Link
      to={paths.student(student.id)}
      className="font-semibold text-ink underline-offset-2 hover:text-primary hover:underline"
    >
      {student.name}
    </Link>
  )
}

// Studying is green, admission pending amber, left school grey. The label text carries the meaning.
const enrollmentTones: Record<EnrollmentStatus, BadgeTone> = {
  enrolled: 'success',
  pending: 'planned',
  left: 'neutral',
}

export function EnrollmentBadge({ student }: { student: Student }) {
  return (
    <Badge tone={enrollmentTones[student.enrollmentStatus]} className="whitespace-nowrap">
      {enrollmentLabels[student.enrollmentStatus]}
    </Badge>
  )
}

export function SiblingCount({ student }: { student: Student }) {
  if (student.siblingCount === 0) return <span className="text-ink-muted">None</span>
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <UsersThreeIcon className="size-4 text-ink-muted" aria-hidden="true" />
      {formatSiblingCount(student.siblingCount)}
    </span>
  )
}

/** Total assigned: a quiet grey chip. */
export function FeeAssigned({ student }: { student: Student }) {
  return (
    <Badge tone="neutral" className="font-medium whitespace-nowrap text-ink tabular-nums">
      {formatMoney(student.totalAssignedPaise)}
    </Badge>
  )
}

/** Total due: green pill when nothing is owed, red pill when money is due. Never wraps. */
export function FeeDue({ student }: { student: Student }) {
  const due = hasFeeDue(student)
  return (
    <Badge
      tone={due ? 'danger' : 'success'}
      className="rounded-full px-2.5 whitespace-nowrap tabular-nums"
    >
      <span className="sr-only">{due ? 'Due: ' : 'Nothing due: '}</span>
      {formatMoney(student.totalDuePaise)}
    </Badge>
  )
}
