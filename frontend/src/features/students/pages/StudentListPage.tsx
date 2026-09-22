import { UsersThreeIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { PageContainer } from '@/components/page/PageContainer'
import { RecordsCard } from '@/components/page/RecordsCard'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { Tooltip } from '@/components/ui/Tooltip'
import { useDebounce } from '@/hooks/useDebounce'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { copyText, downloadTextFile } from '@/lib/browserFiles'
import { downloadPdfTable, downloadXlsxTable } from '@/lib/exportFiles'
import { logger } from '@/lib/logger'
import { PAGE_SIZE_OPTIONS } from '../constants'
import { StudentFilterPanel } from '../components/StudentFilterPanel'
import { StudentGrid } from '../components/StudentGrid'
import { StudentListActions } from '../components/StudentListActions'
import { StudentRecordsToolbar } from '../components/StudentRecordsToolbar'
import { StudentsEmptyState } from '../components/StudentsEmptyState'
import { StudentStats } from '../components/StudentStats'
import { StudentSummaryRail } from '../components/StudentSummaryRail'
import { StudentTable } from '../components/StudentTable'
import { StudentViewToggle } from '../components/StudentViewToggle'
import { useClassOptions } from '../hooks/useClassOptions'
import { useStudentColumns } from '../hooks/useStudentColumns'
import { useStudentFilters } from '../hooks/useStudentFilters'
import { useStudents } from '../hooks/useStudents'
import { useStudentSummary } from '../hooks/useStudentSummary'
import type { StudentFilters } from '../types/student.types'
import { studentsToTable, toCsv, toTsv } from '../utils/exportStudents'

// The page composes: filters from the URL, data from query hooks, rendering from components.
export function StudentListPage() {
  const { filters, view, update, setView, reset, isFiltered } = useStudentFilters()
  const search = useDebounce(filters.search, 300)
  const students = useStudents({ ...filters, search })
  const classOptions = useClassOptions()
  const summary = useStudentSummary()
  const columns = useStudentColumns()
  const { toast } = useToast()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const page = students.data
  const rows = page?.rows ?? []
  const error = students.isError ? getErrorMessage(students.error) : undefined

  // Selection belongs to one set of results: changing filters clears it, paging keeps it.
  const changeFilters = (changes: Partial<StudentFilters>) => {
    setSelectedIds(new Set())
    update(changes)
  }
  const clearFilters = () => {
    setSelectedIds(new Set())
    reset()
  }

  const exportRows = () => studentsToTable(rows, columns.visibleKeys)

  const copyPage = async () => {
    try {
      await copyText(toTsv(exportRows()))
      toast({ title: `Copied ${rows.length} students`, description: 'Paste into a spreadsheet.' })
    } catch {
      toast({
        tone: 'error',
        title: 'Couldn’t copy',
        description: 'The browser blocked clipboard access. Download the CSV instead.',
      })
    }
  }

  const downloadCsv = () => {
    // The byte-order mark makes Excel read ₹ and other non-ASCII characters correctly.
    downloadTextFile(
      `students-page-${page?.page ?? 1}.csv`,
      `\uFEFF${toCsv(exportRows())}`,
      'text/csv;charset=utf-8',
    )
    toast({ title: `Downloaded ${rows.length} students as CSV` })
  }

  const exportFileName = `students-page-${page?.page ?? 1}`

  const exportFile = async (format: 'Excel' | 'PDF') => {
    try {
      if (format === 'Excel') await downloadXlsxTable(`${exportFileName}.xlsx`, exportRows())
      else await downloadPdfTable(`${exportFileName}.pdf`, 'Student List', exportRows())
      toast({ title: `Downloaded ${rows.length} students as ${format}` })
    } catch (exportError) {
      logger.error(`${format} export failed`, exportError)
      toast({
        tone: 'error',
        title: `Couldn’t create the ${format} file`,
        description: 'Try again, or download the CSV instead.',
      })
    }
  }

  // TODO(api): replace with the bulk edit form and a ConfirmDialog-guarded delete.
  const announceBulk = (action: string) => {
    toast({
      title: `${action} is coming soon`,
      description: `${selectedIds.size} students are selected. Bulk changes need the student API.`,
    })
  }

  const empty = <StudentsEmptyState isFiltered={isFiltered} onClearFilters={clearFilters} />
  const applied = {
    classGrade: filters.classGrade,
    section: filters.section,
    siblings: filters.siblings,
    status: filters.status,
  }

  return (
    <PageContainer
      title="Student List"
      status={
        <Tooltip content="Rows come from a sample file until the student API is connected.">
          <Badge tone="planned" tabIndex={0}>
            Sample data
          </Badge>
        </Tooltip>
      }
      actions={<StudentListActions />}
      fullWidth
    >
      {/* grid-cols-1 is minmax(0, 1fr): without it the column grows to the table's full width
          and the whole page scrolls sideways instead of the table. */}
      <div className="grid min-w-0 grid-cols-1 gap-4">
        {summary.data && <StudentSummaryRail summary={summary.data} />}

        <StudentFilterPanel
          key={JSON.stringify(applied)}
          applied={applied}
          classOptions={classOptions.data}
          onApply={changeFilters}
          onClear={clearFilters}
        />

        <RecordsCard
          title="Student records"
          icon={UsersThreeIcon}
          badges={page && <StudentStats counts={page.counts} />}
          headerEnd={<StudentViewToggle value={view} onChange={setView} />}
          toolbar={
            <StudentRecordsToolbar
              pageSize={filters.pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageSizeChange={(pageSize) => update({ pageSize })}
              canExport={rows.length > 0 && !students.isPlaceholderData}
              onCopy={() => void copyPage()}
              onDownloadCsv={downloadCsv}
              onDownloadExcel={() => void exportFile('Excel')}
              onDownloadPdf={() => void exportFile('PDF')}
              onPrint={() => window.print()}
              isColumnVisible={columns.isVisible}
              onToggleColumn={columns.toggle}
              onShowAllColumns={columns.showAll}
              selectedCount={selectedIds.size}
              onClearSelection={() => setSelectedIds(new Set())}
              onBulkEdit={() => announceBulk('Bulk edit')}
              onBulkDelete={() => announceBulk('Bulk delete')}
              search={filters.search}
              onSearchChange={(value) => changeFilters({ search: value })}
            />
          }
          footer={
            page && page.total > 0 ? (
              <Pagination
                page={page.page}
                pageCount={page.pageCount}
                total={page.total}
                pageSize={filters.pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageChange={(next) => update({ page: next })}
                onPageSizeChange={(pageSize) => update({ pageSize })}
                itemLabel="students"
              />
            ) : undefined
          }
        >
          {view === 'list' ? (
            <StudentTable
              students={rows}
              visibleKeys={columns.visibleKeys}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              isLoading={students.isPending}
              isRefreshing={students.isPlaceholderData}
              error={error}
              onRetry={() => void students.refetch()}
              empty={empty}
            />
          ) : (
            <StudentGrid
              students={rows}
              isLoading={students.isPending}
              isRefreshing={students.isPlaceholderData}
              error={error}
              onRetry={() => void students.refetch()}
              empty={empty}
            />
          )}
        </RecordsCard>
      </div>
    </PageContainer>
  )
}
