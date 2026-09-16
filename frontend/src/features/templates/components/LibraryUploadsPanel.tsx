import { UploadSimpleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import type { CardDimensions, DesignElement } from '../types/template.types'
import { createImageElement } from '../utils/designElements'
import { ImagePicker } from './ImagePicker'

type LibraryUploadsPanelProps = {
  card: CardDimensions
  uploads: string[]
  onAdd: (element: DesignElement) => void
  onUpload: (src: string) => void
}

export function LibraryUploadsPanel({ card, uploads, onAdd, onUpload }: LibraryUploadsPanelProps) {
  return (
    <div className="grid gap-3">
      <ImagePicker onPick={onUpload}>
        {(openPicker) => (
          <Button variant="secondary" className="w-full" onClick={openPicker}>
            <UploadSimpleIcon className="size-4.5" aria-hidden="true" />
            Upload image
          </Button>
        )}
      </ImagePicker>
      <p className="text-xs text-ink-muted">
        PNG, JPG, SVG or WebP, up to 2 MB. Uploads stay here while this page is open.
      </p>
      {uploads.length === 0 ? (
        <p className="text-sm text-ink-muted">No uploads yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2">
          {uploads.map((src, index) => (
            <li key={`${String(index)}-${src.slice(-24)}`}>
              <button
                type="button"
                onClick={() =>
                  onAdd(
                    createImageElement(card, {
                      name: `Upload ${String(index + 1)}`,
                      src,
                      field: null,
                    }),
                  )
                }
                className="grid aspect-square w-full cursor-pointer place-items-center overflow-hidden rounded-md border border-line bg-canvas p-1 hover:border-primary"
              >
                <img
                  src={src}
                  alt={`Add upload ${String(index + 1)} to the card`}
                  className="max-h-full max-w-full object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
