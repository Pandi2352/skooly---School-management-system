import { ImageIcon } from '@phosphor-icons/react'
import { useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './Button'
import { FieldMessages } from './FieldMessages'
import { fieldDescribedBy } from './fieldStyles'

type ImageUploadFieldProps = {
  label: string
  hint?: string
  /** Comma-separated MIME types, e.g. "image/png,image/jpeg". */
  accept: string
  maxBytes: number
  /** Existing image URL, or a data URL for a newly chosen file. */
  value: string | null
  onChange: (value: string | null) => void
  error?: string
  previewShape?: 'square' | 'wide'
  /** More ways to set the image, shown beside Choose and Remove (e.g. a webcam button). */
  actions?: ReactNode
}

const typeNames: Record<string, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/svg+xml': 'SVG',
  'image/webp': 'WebP',
  'image/x-icon': 'ICO',
  'image/vnd.microsoft.icon': 'ICO',
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${Math.round(bytes / 1024 / 1024)} MB` : `${Math.round(bytes / 1024)} KB`

/** Picks one image, checks its type and size before reading it, and shows a preview. */
export function ImageUploadField({
  label,
  hint,
  accept,
  maxBytes,
  value,
  onChange,
  error,
  previewShape = 'square',
  actions,
}: ImageUploadFieldProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string>()
  // The chosen file's name, shown only while that file is still the value (not after a webcam shot).
  const [picked, setPicked] = useState<{ name: string; value: string }>()
  const shownError = fileError ?? error
  const allowedTypes = accept.split(',').map((type) => type.trim())
  const allowedNames = [...new Set(allowedTypes.map((type) => typeNames[type] ?? type))].join(', ')

  const pick = (file: File | undefined) => {
    if (!file) return
    if (!allowedTypes.includes(file.type)) {
      setFileError(`Choose a ${allowedNames} image.`)
      return
    }
    if (file.size > maxBytes) {
      setFileError(`Choose an image smaller than ${formatSize(maxBytes)}.`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setFileError(undefined)
      setPicked({ name: file.name, value: reader.result })
      onChange(reader.result)
    }
    reader.onerror = () => {
      setFileError('That file couldn’t be read. Try another image.')
    }
    reader.readAsDataURL(file)
  }

  const clear = () => {
    setFileError(undefined)
    setPicked(undefined)
    onChange(null)
  }

  return (
    <div className="grid content-start justify-items-center gap-2 text-center">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <div
        className={cn(
          'grid place-items-center overflow-hidden rounded-md border border-line bg-canvas',
          previewShape === 'wide' ? 'h-24 w-44' : 'size-24',
        )}
      >
        {value ? (
          <img src={value} alt={`${label} preview`} className="size-full object-contain p-1.5" />
        ) : (
          <ImageIcon className="size-8 text-ink-muted" aria-hidden="true" />
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          pick(event.target.files?.[0])
          // Allows choosing the same file again after removing it.
          event.target.value = ''
        }}
      />
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          aria-describedby={fieldDescribedBy(id, hint, shownError)}
          onClick={() => inputRef.current?.click()}
        >
          {value ? 'Replace' : 'Choose image'}
          <span className="sr-only">: {label}</span>
        </Button>
        {value && (
          <Button variant="ghost" size="sm" onClick={clear}>
            Remove
            <span className="sr-only">: {label}</span>
          </Button>
        )}
        {actions}
      </div>
      {picked?.value === value && (
        <p className="max-w-full truncate text-xs text-ink-muted">{picked.name}</p>
      )}
      <FieldMessages id={id} hint={hint} error={shownError} />
    </div>
  )
}
