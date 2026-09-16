import { FolderOpenIcon, PlusIcon } from '@phosphor-icons/react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { AdmissionFormValues } from '../../types/admission.types'
import { AdditionalDetails } from '../AdditionalDetails'
import { DocumentUploadRow } from '../DocumentUploadRow'

export function DocumentsStep() {
  const { control } = useFormContext<AdmissionFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'documents.files' })

  return (
    <div className="grid gap-6">
      <AdditionalDetails />

      <section aria-labelledby="documents-heading" className="grid gap-4">
        <SectionHeading id="documents-heading" icon={FolderOpenIcon}>
          Upload documents
        </SectionHeading>
        <p className="text-sm text-ink-muted">
          Add a row for each document: PDF, JPG or PNG, up to 5 MB. Empty rows are ignored.
        </p>

        <div className="grid gap-2 rounded-md border border-line bg-canvas p-3">
          {/* Column headings for wider panels; each row also has its own labels for screen readers. */}
          <div
            aria-hidden="true"
            className="hidden gap-3 px-3 text-xs font-bold tracking-wide text-primary uppercase @2xl:grid @2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem]"
          >
            <span>Document name (e.g. Birth Certificate)</span>
            <span>File</span>
            <span className="text-end">Action</span>
          </div>
          {fields.length === 0 ? (
            <p className="px-3 py-2 text-sm text-ink-muted">No documents added.</p>
          ) : (
            <ul className="grid gap-2">
              {fields.map((row, index) => (
                <DocumentUploadRow key={row.id} index={index} onRemove={() => remove(index)} />
              ))}
            </ul>
          )}
          <div>
            <Button variant="secondary" size="sm" onClick={() => append({ name: '', file: null })}>
              <PlusIcon className="size-4" weight="bold" aria-hidden="true" />
              Add Document
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
