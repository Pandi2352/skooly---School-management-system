import { useState } from 'react'
import {
  DownloadSimpleIcon,
  FileArrowDownIcon,
  FileCsvIcon,
  InfoIcon,
} from '@phosphor-icons/react'
import { downloadCsvFile } from '@/lib/exportFiles'
import { useImportTemplate } from '../hooks/useDataTransfer'
import type { EntityType } from '../schemas/dataTransfer.schema'

const ENTITY_OPTIONS: { key: EntityType; label: string; description: string }[] = [
  {
    key: 'students',
    label: 'Students Roster',
    description: 'Bulk register enrolled students, class assignments, and parent phones.',
  },
  {
    key: 'parents',
    label: 'Parent Guardians',
    description: 'Link parents and guardians to existing student admission numbers.',
  },
  {
    key: 'staff',
    label: 'Faculty & Staff',
    description: 'Create user accounts and designations for teachers and school staff.',
  },
]

export function TemplateDownloadCard() {
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('students')
  const { data: template, isLoading } = useImportTemplate(selectedEntity)

  const handleDownloadTemplate = () => {
    if (!template) {
      return
    }

    const headers = template.columns.map((col) => col.key)
    const sampleRow = template.columns.map((col) => col.example)
    const rows = [headers, sampleRow]

    downloadCsvFile(`${selectedEntity}_import_template.csv`, rows)
  }

  return (
    <div className="rounded-md border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink flex items-center gap-2">
            <FileArrowDownIcon className="h-5 w-5 text-primary" />
            Standard Import Templates
          </h3>
          <p className="text-sm text-ink-muted mt-1">
            Download pre-formatted CSV template files with sample headers and allowed column formats.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          disabled={isLoading || !template}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-contrast transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          <DownloadSimpleIcon className="h-4 w-4" />
          Download Sample CSV
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-b border-border pb-3">
        {ENTITY_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setSelectedEntity(option.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedEntity === option.key
                ? 'bg-primary text-primary-contrast'
                : 'bg-surface-subtle text-ink hover:bg-surface-hover'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-ink-muted">
            Loading template specifications...
          </div>
        ) : template ? (
          <div>
            <div className="mb-3 flex items-center gap-1.5 text-xs text-ink-muted">
              <InfoIcon className="h-4 w-4 text-primary" />
              <span>
                All headers in the downloaded file must match either the exact key or standard field name.
              </span>
            </div>

            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-subtle text-xs uppercase text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Column Key</th>
                    <th className="px-4 py-3 font-semibold">Header Name</th>
                    <th className="px-4 py-3 font-semibold">Requirement</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold">Sample Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {template.columns.map((col) => (
                    <tr key={col.key} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-xs text-ink font-medium">
                        {col.key}
                      </td>
                      <td className="px-4 py-2.5 text-ink font-medium">
                        {col.label}
                      </td>
                      <td className="px-4 py-2.5">
                        {col.required ? (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-surface-subtle px-2 py-0.5 text-xs font-medium text-ink-muted">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-ink-muted">
                        {col.description}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-ink-muted">
                        {col.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
              <FileCsvIcon className="h-4 w-4 text-primary" />
              <span>
                Includes 1 pre-filled sample row ready for direct editing in Microsoft Excel, Apple Numbers, or Google Sheets.
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
