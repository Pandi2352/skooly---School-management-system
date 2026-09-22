import type { ReactNode } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Table, type TableColumn } from '@/components/ui/Table'
import { cn } from '@/lib/cn'
import type { Student } from '../types/student.types'
import { STUDENT_COLUMNS, type StudentColumnKey } from '../utils/studentColumns'
import { formatClassSection } from '../utils/studentStatus'
import { EnrollmentBadge, FeeAssigned, FeeDue, SiblingCount, StudentNameLink } from './studentCells'
import { StudentRowActions } from './StudentRowActions'

const cells: Record<StudentColumnKey, (s: Student) => ReactNode> = {
  admissionNo: (s) => <span className="whitespace-nowrap tabular-nums">{s.admissionNo}</span>,
  rollNo: (s) => <span className="tabular-nums">{s.rollNo}</span>,
  photo: (s) => <Avatar name={s.name} src={s.photoUrl ?? undefined} size="sm" />,
  name: (s) => (
    <div className="min-w-40">
      <StudentNameLink student={s} />
    </div>
  ),
  class: (s) => <span className="whitespace-nowrap">{formatClassSection(s)}</span>,
  outcome: (s) => <EnrollmentBadge student={s} />,
  siblings: (s) => <SiblingCount student={s} />,
  fatherName: (s) => <span className="whitespace-nowrap">{s.fatherName}</span>,
  fatherPhone: (s) => <span className="whitespace-nowrap tabular-nums">{s.fatherPhone}</span>,
  totalAssigned: (s) => <FeeAssigned student={s} />,
  totalDue: (s) => <FeeDue student={s} />,
}

type StudentTableProps = {
  students: Student[]
  visibleKeys: StudentColumnKey[]
  selectedIds: ReadonlySet<string>
  onSelectionChange: (ids: Set<string>) => void
  /** First load, nothing to show yet. */
  isLoading: boolean
  /** A new page or filter is loading while the previous rows stay visible. */
  isRefreshing: boolean
  error?: string
  onRetry: () => void
  empty: ReactNode
}

export function StudentTable({
  students,
  visibleKeys,
  selectedIds,
  onSelectionChange,
  isLoading,
  isRefreshing,
  error,
  onRetry,
  empty,
}: StudentTableProps) {
  const visibleColumns = STUDENT_COLUMNS.filter((column) => visibleKeys.includes(column.key))

  const columns: TableColumn<Student>[] = [
    ...visibleColumns.map((column) => ({
      key: column.key,
      header: column.label,
      align: column.align,
      cell: cells[column.key],
    })),
    {
      key: 'actions',
      header: 'Actions',
      align: 'end',
      cell: (s) => <StudentRowActions student={s} />,
    },
  ]

  return (
    <div
      aria-busy={isRefreshing || undefined}
      className={cn(
        'transition-opacity motion-reduce:transition-none',
        isRefreshing && 'opacity-60',
      )}
    >
      <Table
        caption="Students"
        hideCaption
        bordered={false}
        columns={columns}
        primaryKey="name"
        rows={students}
        getRowKey={(s) => s.id}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        empty={empty}
        selection={{
          selectedKeys: selectedIds,
          onChange: onSelectionChange,
          getRowLabel: (s) => s.name,
        }}
      />
    </div>
  )
}
