import { ArrowLeftIcon } from '@phosphor-icons/react'
import { Link, useParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { StudentAttendanceTab } from '../components/detail/StudentAttendanceTab'
import { StudentDemographicsTab } from '../components/detail/StudentDemographicsTab'
import { StudentDocumentsTab } from '../components/detail/StudentDocumentsTab'
import { StudentFeesTab } from '../components/detail/StudentFeesTab'
import { StudentGuardiansTab } from '../components/detail/StudentGuardiansTab'
import { StudentHeader } from '../components/detail/StudentHeader'
import { useStudent } from '../hooks/useStudent'
import { formatClassSection } from '../utils/studentStatus'

export function StudentDetailPage() {
  const { studentId = '' } = useParams<{ studentId: string }>()
  const studentQuery = useStudent(studentId)

  if (studentQuery.isPending) {
    return (
      <PageContainer
        title="Student Profile"
        eyebrow={
          <Link
            to={paths.students}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted transition-colors hover:text-primary"
          >
            <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
            Back to Students
          </Link>
        }
      >
        <LoadingState label="Loading student profile" />
      </PageContainer>
    )
  }

  if (studentQuery.isError) {
    return (
      <PageContainer
        title="Student Profile"
        eyebrow={
          <Link
            to={paths.students}
            className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted transition-colors hover:text-primary"
          >
            <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
            Back to Students
          </Link>
        }
      >
        <ErrorState
          title="Could not load student profile"
          description={getErrorMessage(studentQuery.error)}
          onRetry={() => void studentQuery.refetch()}
        />
      </PageContainer>
    )
  }

  const student = studentQuery.data

  const tabItems: TabItem[] = [
    {
      value: 'demographics',
      label: 'Demographics & Medical',
      content: <StudentDemographicsTab student={student} />,
    },
    {
      value: 'guardians',
      label: `Guardians & Siblings (${student.siblings.length})`,
      content: <StudentGuardiansTab student={student} />,
    },
    {
      value: 'fees',
      label: `Fees & Ledger (${student.invoices.length})`,
      content: <StudentFeesTab student={student} />,
    },
    {
      value: 'attendance',
      label: `Attendance (${student.attendanceSummary.percentage}%)`,
      content: <StudentAttendanceTab student={student} />,
    },
    {
      value: 'documents',
      label: `Documents (${student.documents.length})`,
      content: <StudentDocumentsTab student={student} />,
    },
  ]

  return (
    <PageContainer
      title={student.name}
      eyebrow={
        <Link
          to={paths.students}
          className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted transition-colors hover:text-primary"
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
          Back to Students
        </Link>
      }
      description={`Admission No: ${student.admissionNo} · Class ${formatClassSection(student)}`}
    >
      <div className="grid gap-6">
        <StudentHeader student={student} />
        <Tabs label="Student Profile Sections" items={tabItems} defaultValue="demographics" />
      </div>
    </PageContainer>
  )
}
