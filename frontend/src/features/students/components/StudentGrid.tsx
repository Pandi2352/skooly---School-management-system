import type { ReactNode } from 'react'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'
import type { Student } from '../types/student.types'
import { formatClassSection } from '../utils/studentStatus'
import { EnrollmentBadge, FeeDue, StudentNameLink } from './studentCells'
import { StudentRowActions } from './StudentRowActions'

type StudentGridProps = {
  students: Student[]
  isLoading: boolean
  isRefreshing: boolean
  error?: string
  onRetry: () => void
  empty: ReactNode
}

/** Compact cards: identity, class and status, father and phone, then fee due and actions. */
export function StudentGrid({
  students,
  isLoading,
  isRefreshing,
  error,
  onRetry,
  empty,
}: StudentGridProps) {
  if (isLoading) return <LoadingState label="Loading students" />
  if (error)
    return <ErrorState title="Couldn't load students" description={error} onRetry={onRetry} />
  if (students.length === 0) return <>{empty}</>

  return (
    <ul
      aria-label="Students"
      aria-busy={isRefreshing || undefined}
      className={cn(
        'grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-3 p-3 transition-opacity motion-reduce:transition-none sm:gap-4 sm:p-4',
        isRefreshing && 'opacity-60',
      )}
    >
      {students.map((student) => (
        <li
          key={student.id}
          className="grid content-start gap-3 rounded-md border border-line bg-surface p-4 hover:border-control"
        >
          {/* Identity */}
          <div className="flex items-center gap-3">
            <Avatar name={student.name} src={student.photoUrl ?? undefined} />
            <div className="grid min-w-0 flex-1">
              <span className="truncate">
                <StudentNameLink student={student} />
              </span>
              <span className="truncate text-sm text-ink-muted tabular-nums">
                {student.admissionNo} · Roll {student.rollNo}
              </span>
            </div>
          </div>

          {/* Class and status */}
          <div className="flex items-center justify-between gap-2 text-sm">
            <span>{formatClassSection(student)}</span>
            <EnrollmentBadge student={student} />
          </div>

          {/* Father */}
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="min-w-0 truncate text-ink-muted" title={student.fatherName}>
              {student.fatherName}
            </span>
            <span className="whitespace-nowrap tabular-nums">{student.fatherPhone}</span>
          </div>

          {/* Fee due and actions */}
          <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
            <span className="flex items-center gap-1.5 text-sm">
              <span className="sr-only">Fee due:</span>
              <FeeDue student={student} />
            </span>
            <StudentRowActions student={student} />
          </div>
        </li>
      ))}
    </ul>
  )
}
