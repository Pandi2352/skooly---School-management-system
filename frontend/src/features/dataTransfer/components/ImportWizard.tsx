import { useState, type ChangeEvent, type DragEvent } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  FileCsvIcon,
  FunnelIcon,
  UploadSimpleIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { parseCsv } from '@/lib/csvParser'
import {
  useCommitImport,
  useImportTemplate,
  usePreviewImport,
} from '../hooks/useDataTransfer'
import type {
  CommitImportResponse,
  EntityType,
  ImportPreviewResponse,
} from '../schemas/dataTransfer.schema'
import { autoMapColumns, remapRecords } from '../utils/columnMapping'
import { validateMappedRows } from '../utils/importValidator'

type WizardStep = 1 | 2 | 3 | 4

const ENTITY_LABELS: Record<EntityType, string> = {
  students: 'Students Roster',
  parents: 'Parent Guardians',
  staff: 'Faculty & Staff',
}

async function readTextFromFile(file: File): Promise<string> {
  if (typeof file.text === 'function') {
    try {
      return await file.text()
    } catch {
      // Fallback to FileReader
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}

export function ImportWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('students')
  const [fileName, setFileName] = useState<string>('')
  const [rawHeaders, setRawHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([])
  const [columnMap, setColumnMap] = useState<Record<string, string>>({})
  const [isDragOver, setIsDragOver] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [previewResult, setPreviewResult] = useState<ImportPreviewResponse | null>(null)
  const [commitResult, setCommitResult] = useState<CommitImportResponse | null>(null)
  const [showOnlyErrors, setShowOnlyErrors] = useState(false)

  const { data: template, isLoading: isTemplateLoading } = useImportTemplate(selectedEntity)
  const previewMutation = usePreviewImport()
  const commitMutation = useCommitImport()

  const handleProcessFile = async (file: File) => {
    setParseError(null)
    setFileName(file.name)

    try {
      const text = await readTextFromFile(file)
      if (!text || text.trim() === '') {
        setParseError('The selected file is empty.')
        return
      }

      const parsedRows = parseCsv(text)
      if (parsedRows.length < 2) {
        setParseError('CSV file must contain at least a header row and one data row.')
        return
      }

      const [headers = [], ...dataRows] = parsedRows
      if (headers.length === 0 || dataRows.length === 0) {
        setParseError('CSV file must contain at least a header row and one data row.')
        return
      }

      const records: Record<string, string>[] = dataRows.map((row) => {
        const rec: Record<string, string> = {}
        headers.forEach((h, idx) => {
          rec[h] = row[idx] ?? ''
        })
        return rec
      })

      setRawHeaders(headers)
      setRawRows(records)

      // Auto map columns with target template
      if (template) {
        const initialMap = autoMapColumns(template.columns, headers)
        setColumnMap(initialMap)
      }
      setCurrentStep(2)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setParseError(`Failed to read file: ${msg}`)
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      void handleProcessFile(file)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      void handleProcessFile(file)
    }
  }

  const handleColumnMappingChange = (targetKey: string, sourceHeader: string) => {
    setColumnMap((prev) => ({
      ...prev,
      [targetKey]: sourceHeader,
    }))
  }

  const handleProceedToValidation = () => {
    if (!template) {
      return
    }

    // Remap rows according to user's column mappings
    const remapped = remapRecords(rawRows, columnMap)

    // Run client validation first
    const clientValidation = validateMappedRows(selectedEntity, remapped)

    // Set client validation results as immediate preview
    setPreviewResult({
      totalCount: remapped.length,
      validCount: clientValidation.validCount,
      invalidCount: clientValidation.invalidCount,
      errors: clientValidation.allErrors,
      previewItems: clientValidation.validatedRows.map((vr) => ({
        ...vr.data,
        _rowNumber: vr.rowNumber,
        _isValid: vr.isValid,
        _errors: vr.errors,
      })),
    })

    // Also trigger server dry-run preview in background
    previewMutation.mutate(
      {
        entityType: selectedEntity,
        records: remapped,
      },
      {
        onSuccess: (serverResult) => {
          setPreviewResult(serverResult)
        },
      },
    )

    setCurrentStep(3)
  }

  const handleCommitImport = () => {
    if (!template || !previewResult) {
      return
    }

    const remapped = remapRecords(rawRows, columnMap)
    commitMutation.mutate(
      {
        entityType: selectedEntity,
        records: remapped,
      },
      {
        onSuccess: (res) => {
          setCommitResult(res)
          setCurrentStep(4)
        },
      },
    )
  }

  const handleReset = () => {
    setCurrentStep(1)
    setFileName('')
    setRawHeaders([])
    setRawRows([])
    setColumnMap({})
    setParseError(null)
    setPreviewResult(null)
    setCommitResult(null)
    setShowOnlyErrors(false)
  }

  // Check if all required fields are mapped
  const missingRequiredFields =
    template?.columns
      .filter((col) => col.required)
      .filter((col) => !columnMap[col.key] || columnMap[col.key] === '')
      .map((col) => col.label) ?? []

  return (
    <div className="rounded-md border border-border bg-card p-6 shadow-sm">
      {/* Step Stepper Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Bulk Data Import Wizard</h2>
            <p className="text-sm text-ink-muted">
              Step {currentStep} of 4: {
                currentStep === 1 ? 'Select Entity & Upload CSV' :
                currentStep === 2 ? 'Map Columns' :
                currentStep === 3 ? 'Validate & Preview' : 'Import Complete'
              }
            </p>
          </div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-ink-muted hover:text-ink transition-colors"
            >
              Cancel & Start Over
            </button>
          )}
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-6 flex items-center gap-2">
          {[
            { step: 1, label: 'Upload' },
            { step: 2, label: 'Map Columns' },
            { step: 3, label: 'Preview & Verify' },
            { step: 4, label: 'Complete' },
          ].map((item) => (
            <div key={item.step} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  currentStep === item.step
                    ? 'bg-primary text-primary-contrast'
                    : currentStep > item.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-surface-subtle text-ink-muted'
                }`}
              >
                {currentStep > item.step ? '✓' : item.step}
              </div>
              <span className="hidden text-xs font-medium text-ink sm:inline">
                {item.label}
              </span>
              {item.step < 4 && (
                <div
                  className={`h-0.5 flex-1 ${
                    currentStep > item.step ? 'bg-emerald-600' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Upload CSV */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              1. Select What You Are Importing
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(['students', 'parents', 'staff'] as EntityType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedEntity(type)}
                  className={`flex flex-col items-start rounded-md border p-4 text-left transition-all ${
                    selectedEntity === type
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card text-ink hover:border-ink-muted/40'
                  }`}
                >
                  <span className="font-medium text-sm text-ink">{ENTITY_LABELS[type]}</span>
                  <span className="text-xs text-ink-muted mt-1">
                    {type === 'students' && 'Names, grades, sections, admission numbers'}
                    {type === 'parents' && 'Guardian names, contacts, linked admission IDs'}
                    {type === 'staff' && 'Faculty members, school emails, staff roles'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              2. Upload CSV File
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-surface-subtle/40 hover:bg-surface-subtle/80'
              }`}
            >
              <UploadSimpleIcon className="h-10 w-10 text-ink-muted mb-2" />
              <p className="text-sm font-medium text-ink">
                Drag and drop your CSV file here, or{' '}
                <label className="cursor-pointer text-primary hover:underline">
                  browse
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-ink-muted mt-1">
                Standard comma-delimited or semicolon-delimited CSV formats supported.
              </p>
            </div>
          </div>

          {parseError && (
            <div className="flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
              <XCircleIcon className="h-5 w-5 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Map Columns */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink flex items-center gap-2">
                <FileCsvIcon className="h-5 w-5 text-primary" />
                Match Columns for: {fileName}
              </h3>
              <p className="text-sm text-ink-muted">
                Map each column from your CSV file to the corresponding school system attribute.
              </p>
            </div>
            <div className="text-xs font-medium text-ink-muted">
              {rawRows.length} data row(s) found
            </div>
          </div>

          {isTemplateLoading ? (
            <div className="py-8 text-center text-sm text-ink-muted">
              Loading schema parameters...
            </div>
          ) : template ? (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-subtle text-xs uppercase text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Destination Field</th>
                    <th className="px-4 py-3 font-semibold">Requirement</th>
                    <th className="px-4 py-3 font-semibold">Source CSV Column</th>
                    <th className="px-4 py-3 font-semibold">Sample Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {template.columns.map((col) => {
                    const mappedValue = columnMap[col.key] ?? ''
                    const isMapped = mappedValue !== ''

                    return (
                      <tr key={col.key} className="hover:bg-surface-hover/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-ink">{col.label}</div>
                          <div className="font-mono text-xs text-ink-muted">{col.key}</div>
                        </td>
                        <td className="px-4 py-3">
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
                        <td className="px-4 py-3">
                          <select
                            value={mappedValue}
                            onChange={(e) => handleColumnMappingChange(col.key, e.target.value)}
                            className="w-full max-w-xs rounded-md border border-border bg-card px-3 py-1.5 text-sm text-ink focus:border-primary focus:outline-none"
                          >
                            <option value="">-- Do Not Import / Skip --</option>
                            {rawHeaders.map((hdr) => (
                              <option key={hdr} value={hdr}>
                                {hdr}
                              </option>
                            ))}
                          </select>
                          {isMapped && (
                            <span className="ml-2 inline-flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                              ✓ Mapped
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                          {col.example}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : null}

          {missingRequiredFields.length > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              <WarningCircleIcon className="h-5 w-5 shrink-0" />
              <span>
                Please map all required fields to continue:{' '}
                <strong>{missingRequiredFields.join(', ')}</strong>
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface-hover"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              disabled={missingRequiredFields.length > 0}
              onClick={handleProceedToValidation}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-contrast transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              Verify & Preview
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview & Verify */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">Validation Preview</h3>
              <p className="text-sm text-ink-muted">
                Review verified rows and validation issues before committing records to the database.
              </p>
            </div>

            {previewResult && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOnlyErrors((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    showOnlyErrors
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                      : 'border border-border bg-card text-ink hover:bg-surface-hover'
                  }`}
                >
                  <FunnelIcon className="h-3.5 w-3.5" />
                  {showOnlyErrors ? 'Showing Errors Only' : 'Show Errors Only'}
                </button>
              </div>
            )}
          </div>

          {/* Validation Metrics Summary */}
          {previewResult && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-md border border-border bg-surface-subtle p-4">
                <div className="text-xs font-medium text-ink-muted uppercase">Total Rows</div>
                <div className="text-2xl font-bold text-ink mt-1">
                  {previewResult.totalCount}
                </div>
              </div>

              <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
                  Ready to Import
                </div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  {previewResult.validCount}
                </div>
              </div>

              <div className="rounded-md border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
                <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase">
                  Validation Errors
                </div>
                <div className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">
                  {previewResult.invalidCount}
                </div>
              </div>
            </div>
          )}

          {/* Error Summary List if any */}
          {previewResult && previewResult.errors.length > 0 && (
            <div className="rounded-md border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
              <div className="flex items-center gap-2 font-medium text-sm text-rose-800 dark:text-rose-200 mb-2">
                <WarningCircleIcon className="h-5 w-5" />
                <span>Found {previewResult.errors.length} issue(s) that require attention:</span>
              </div>
              <ul className="list-inside list-disc text-xs text-rose-700 dark:text-rose-300 space-y-1">
                {previewResult.errors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>
                    Row {err.rowNumber}: {err.message}
                  </li>
                ))}
                {previewResult.errors.length > 5 && (
                  <li>...and {previewResult.errors.length - 5} more issues.</li>
                )}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          {previewResult && template && (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-subtle text-xs uppercase text-ink-muted">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold w-16">Row #</th>
                    <th className="px-3 py-2.5 font-semibold w-24">Status</th>
                    {template.columns.map((col) => (
                      <th key={col.key} className="px-3 py-2.5 font-semibold">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {previewResult.previewItems
                    .filter((item) => {
                      if (!showOnlyErrors) {
                        return true
                      }
                      return !item._isValid
                    })
                    .slice(0, 10)
                    .map((item, index) => {
                      const rowNum = (item._rowNumber as number) || index + 1
                      const isValid = Boolean(item._isValid)
                      const errors = (item._errors as string[])

                      return (
                        <tr
                          key={index}
                          className={
                            isValid
                              ? 'hover:bg-surface-hover/40 transition-colors'
                              : 'bg-rose-50/40 hover:bg-rose-50/70 dark:bg-rose-950/20'
                          }
                        >
                          <td className="px-3 py-2.5 font-mono text-xs text-ink-muted">
                            {rowNum}
                          </td>
                          <td className="px-3 py-2.5">
                            {isValid ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                                Valid
                              </span>
                            ) : (
                              <span
                                title={errors.join('; ')}
                                className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                              >
                                <XCircleIcon className="h-3.5 w-3.5" />
                                Error
                              </span>
                            )}
                          </td>
                          {template.columns.map((col) => {
                            const rawVal = item[col.key]
                            const cellText =
                              typeof rawVal === 'string' || typeof rawVal === 'number'
                                ? String(rawVal)
                                : ''

                            return (
                              <td key={col.key} className="px-3 py-2.5 text-xs text-ink">
                                {cellText}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface-hover"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Adjust Mapping
            </button>

            <button
              type="button"
              disabled={
                !previewResult ||
                previewResult.validCount === 0 ||
                commitMutation.isPending
              }
              onClick={handleCommitImport}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-contrast transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {commitMutation.isPending ? (
                <span>Importing Records...</span>
              ) : (
                <>
                  <UploadSimpleIcon className="h-4 w-4" />
                  <span>
                    Commit & Onboard ({previewResult?.validCount ?? 0} Records)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success & Summary */}
      {currentStep === 4 && commitResult && (
        <div className="py-8 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <CheckCircleIcon className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-ink">Import Completed Successfully!</h3>
            <p className="text-sm text-ink-muted mt-1">{commitResult.message}</p>
          </div>

          <div className="mx-auto max-w-sm rounded-md border border-border bg-surface-subtle p-4 text-left">
            <div className="flex justify-between py-1 text-sm border-b border-border">
              <span className="text-ink-muted">Inserted Records:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {commitResult.insertedCount}
              </span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span className="text-ink-muted">Skipped / Errors:</span>
              <span className="font-semibold text-ink">{commitResult.failedCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-contrast transition-colors hover:bg-primary-hover"
            >
              Import Another File
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
