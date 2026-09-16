import { PaperclipIcon, XIcon } from '@phosphor-icons/react'
import { useId, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Tooltip } from '@/components/ui/Tooltip'
import { ACCEPTED_DOCUMENT_TYPES } from '../constants'
import type { AdmissionFormValues } from '../types/admission.types'
import { formatFileSize, validateDocumentFile } from '../utils/documentFiles'

type DocumentUploadRowProps = { index: number; onRemove: () => void }

/** One document: a name and a file. Type and size are checked before the file is kept. */
export function DocumentUploadRow({ index, onRemove }: DocumentUploadRowProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdmissionFormValues>()
  const inputRef = useRef<HTMLInputElement>(null)
  const messageId = useId()
  const [fileProblem, setFileProblem] = useState<string | null>(null)
  const number = index + 1
  const rowErrors = errors.documents?.files?.[index]

  return (
    <li className="grid items-start gap-3 rounded-md border border-line bg-surface p-3 @2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem]">
      <Input
        label={`Document ${String(number)} name`}
        hideLabel
        autoComplete="off"
        placeholder="e.g. Birth Certificate"
        error={rowErrors?.name?.message}
        {...register(`documents.files.${index}.name`)}
      />

      <Controller
        control={control}
        name={`documents.files.${index}.file`}
        render={({ field }) => {
          const message = fileProblem ?? rowErrors?.file?.message
          return (
            <div className="grid gap-1">
              <div className="flex min-w-0 items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED_DOCUMENT_TYPES.join(',')}
                  hidden
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    // Lets the same file be chosen again.
                    event.target.value = ''
                    if (!file) return
                    const problem = validateDocumentFile(file)
                    setFileProblem(problem)
                    if (problem === null) field.onChange(file)
                  }}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-10 flex-none"
                  aria-describedby={message ? messageId : undefined}
                  onClick={() => inputRef.current?.click()}
                >
                  <PaperclipIcon className="size-4" aria-hidden="true" />
                  {field.value ? 'Replace' : 'Choose file'}
                  <span className="sr-only">: document {number}</span>
                </Button>
                <span className="min-w-0 truncate text-sm text-ink-muted">
                  {field.value
                    ? `${field.value.name} · ${formatFileSize(field.value.size)}`
                    : 'No file chosen'}
                </span>
              </div>
              {message && (
                <p id={messageId} className="text-sm font-semibold text-danger">
                  {message}
                </p>
              )}
            </div>
          )
        }}
      />

      <Tooltip content="Remove">
        <IconButton
          label={`Remove document ${String(number)}`}
          icon={XIcon}
          className="justify-self-end text-danger hover:bg-danger-soft hover:text-danger"
          onClick={onRemove}
        />
      </Tooltip>
    </li>
  )
}
