import { useState } from 'react'
import {
  ClockCounterClockwiseIcon,
  CurrencyInrIcon,
  DownloadSimpleIcon,
  FileCsvIcon,
  FileXlsIcon,
  GraduationCapIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { downloadCsvFile, downloadXlsxTable } from '@/lib/exportFiles'
import { useExportDataset } from '../hooks/useDataTransfer'
import type { ExportDatasetType } from '../schemas/dataTransfer.schema'

type ExportOption = {
  id: ExportDatasetType
  title: string
  description: string
  icon: typeof GraduationCapIcon
  hasGradeFilter?: boolean
  hasStatusFilter?: boolean
  statusOptions?: { value: string; label: string }[]
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'students',
    title: 'Student Master Rosters',
    description:
      'Complete student directory with admission numbers, assigned grade & section, roll number, and guardian contact numbers.',
    icon: GraduationCapIcon,
    hasGradeFilter: true,
    hasStatusFilter: true,
    statusOptions: [
      { value: 'all', label: 'All Statuses' },
      { value: 'studying', label: 'Enrolled / Studying' },
      { value: 'pending', label: 'Pending Verification' },
      { value: 'left', label: 'Alumni / Left' },
    ],
  },
  {
    id: 'fees',
    title: 'Fee Collection & Dues Status',
    description:
      'Class-wise student fee balances, assigned fee group breakdown, total paid amounts, and outstanding balances.',
    icon: CurrencyInrIcon,
    hasGradeFilter: true,
    hasStatusFilter: true,
    statusOptions: [
      { value: 'all', label: 'All Payment Statuses' },
      { value: 'paid', label: 'Fully Paid' },
      { value: 'partial', label: 'Partial Dues' },
      { value: 'overdue', label: 'Overdue / Unpaid' },
    ],
  },
  {
    id: 'staff',
    title: 'Faculty & Staff Directory',
    description:
      'School faculty and administrative user records, designations, department tags, and official school portal email logins.',
    icon: UsersIcon,
    hasGradeFilter: false,
    hasStatusFilter: true,
    statusOptions: [
      { value: 'all', label: 'All Roles' },
      { value: 'Teacher', label: 'Teachers' },
      { value: 'Staff', label: 'Support Staff' },
      { value: 'Administrator', label: 'Administrators' },
    ],
  },
  {
    id: 'audit',
    title: 'User Activity & Audit Logs',
    description:
      'Security audit trail of user logins, password changes, student profile updates, and sensitive administrative actions.',
    icon: ClockCounterClockwiseIcon,
    hasGradeFilter: false,
    hasStatusFilter: true,
    statusOptions: [
      { value: 'all', label: 'All Actions' },
      { value: 'login', label: 'Logins & Sessions' },
      { value: 'updates', label: 'Profile Updates' },
      { value: 'security', label: 'Security Alterations' },
    ],
  },
]

export function ExportCenterPanel() {
  const exportMutation = useExportDataset()
  const [filters, setFilters] = useState<
    Record<ExportDatasetType, { grade: string; status: string }>
  >({
    students: { grade: 'all', status: 'all' },
    fees: { grade: 'all', status: 'all' },
    staff: { grade: 'all', status: 'all' },
    audit: { grade: 'all', status: 'all' },
  })

  const [activeExporting, setActiveExporting] = useState<string | null>(null)

  const handleFilterChange = (
    datasetId: ExportDatasetType,
    field: 'grade' | 'status',
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [datasetId]: {
        ...prev[datasetId],
        [field]: value,
      },
    }))
  }

  const handleExport = async (datasetId: ExportDatasetType, format: 'xlsx' | 'csv') => {
    const datasetFilters = filters[datasetId]
    setActiveExporting(`${datasetId}-${format}`)

    try {
      const data = await exportMutation.mutateAsync({
        datasetType: datasetId,
        filters: {
          grade: datasetFilters.grade !== 'all' ? datasetFilters.grade : undefined,
          status: datasetFilters.status !== 'all' ? datasetFilters.status : undefined,
        },
      })

      const rows = [data.headers, ...data.rows]

      if (format === 'xlsx') {
        await downloadXlsxTable(`${data.filename}.xlsx`, rows)
      } else {
        downloadCsvFile(`${data.filename}.csv`, rows)
      }
    } catch (err) {
      console.error('Failed to export dataset:', err)
    } finally {
      setActiveExporting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-border bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-ink flex items-center gap-2">
          <DownloadSimpleIcon className="h-5 w-5 text-primary" />
          School Data Export Center
        </h3>
        <p className="text-sm text-ink-muted mt-1">
          Export full rosters, fee ledgers, and staff logs for external compliance, spreadsheet analysis, or offline backups.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {EXPORT_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const currentFilter = filters[opt.id]
            const isXlsxLoading = activeExporting === `${opt.id}-xlsx`
            const isCsvLoading = activeExporting === `${opt.id}-csv`
            const isAnyLoading = isXlsxLoading || isCsvLoading

            return (
              <div
                key={opt.id}
                className="flex flex-col justify-between rounded-md border border-border bg-surface-subtle/30 p-5 hover:border-ink-muted/30 transition-all"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-ink">{opt.title}</h4>
                      <span className="text-xs font-mono text-ink-muted">
                        dataset: {opt.id}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                    {opt.description}
                  </p>

                  {/* Filter Selectors */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {opt.hasGradeFilter && (
                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Grade / Class
                        </label>
                        <select
                          value={currentFilter.grade}
                          onChange={(e) =>
                            handleFilterChange(opt.id, 'grade', e.target.value)
                          }
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                        >
                          <option value="all">All Grades (1-12)</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                            <option key={g} value={String(g)}>
                              Grade {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {opt.hasStatusFilter && opt.statusOptions && (
                      <div className={opt.hasGradeFilter ? '' : 'col-span-2'}>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Filter Criteria
                        </label>
                        <select
                          value={currentFilter.status}
                          onChange={(e) =>
                            handleFilterChange(opt.id, 'status', e.target.value)
                          }
                          className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                        >
                          {opt.statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Export Action Buttons */}
                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                  <button
                    type="button"
                    disabled={isAnyLoading}
                    onClick={() => {
                      void handleExport(opt.id, 'xlsx')
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-ink shadow-sm transition-colors hover:bg-surface-hover hover:border-emerald-600 disabled:opacity-50"
                  >
                    <FileXlsIcon className="h-4 w-4 text-emerald-600" />
                    <span>{isXlsxLoading ? 'Generating...' : 'Excel (.xlsx)'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAnyLoading}
                    onClick={() => {
                      void handleExport(opt.id, 'csv')
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-ink shadow-sm transition-colors hover:bg-surface-hover hover:border-primary disabled:opacity-50"
                  >
                    <FileCsvIcon className="h-4 w-4 text-primary" />
                    <span>{isCsvLoading ? 'Generating...' : 'CSV (.csv)'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
