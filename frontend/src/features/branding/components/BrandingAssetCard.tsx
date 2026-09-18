import { ImageIcon, TrashIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { useId, useRef, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { cn } from '@/lib/cn'
import { ASSET_PREVIEW_SHAPES } from '../constants'
import { useRemoveBrandingAsset, useUploadBrandingAsset } from '../hooks/useBranding'
import type { BrandingAsset, BrandingAssetRule } from '../types/branding.types'
import {
  acceptAttribute,
  checkAssetDimensions,
  checkAssetFile,
  describeAsset,
  describeRule,
  normalizeFileType,
} from '../utils/brandingAssets'
import { readImageDimensions } from '../utils/imageDimensions'

const previewHeights = { square: 'h-40', wide: 'h-28', banner: 'h-40' }

type BrandingAssetCardProps = { rule: BrandingAssetRule; asset: BrandingAsset | null }

/** One branding image: preview, requirements, and upload by button or drag and drop. */
export function BrandingAssetCard({ rule, asset }: BrandingAssetCardProps) {
  const { toast } = useToast()
  const upload = useUploadBrandingAsset()
  const remove = useRemoveBrandingAsset()
  const inputRef = useRef<HTMLInputElement>(null)
  const headingId = useId()
  const problemId = useId()
  const [problem, setProblem] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const busy = upload.isPending || remove.isPending
  const shape = ASSET_PREVIEW_SHAPES[rule.type]
  const label = rule.label.toLowerCase()

  const handleFile = async (file: File | undefined) => {
    if (!file || busy) return
    const fileProblem = checkAssetFile(file, rule)
    if (fileProblem) {
      setProblem(fileProblem)
      return
    }
    const size = await readImageDimensions(file)
    const sizeProblem = size ? checkAssetDimensions(size, rule, normalizeFileType(file)) : null
    if (sizeProblem) {
      setProblem(sizeProblem)
      return
    }
    setProblem(null)
    try {
      await upload.mutateAsync({ type: rule.type, file })
      toast.success(`${rule.label} ${asset ? 'replaced' : 'uploaded'}`, 'It now shows wherever the school’s branding appears.')
    } catch (error) {
      setProblem(getErrorMessage(error))
    }
  }

  return (
    <section aria-labelledby={headingId} className="grid content-start gap-3 rounded-md border border-line bg-surface p-4">
      <div className="grid gap-0.5">
        <h3 id={headingId} className="font-semibold text-ink">
          {rule.label}
        </h3>
        <p className="text-sm text-ink-muted">{rule.description}</p>
      </div>

      {/* Drag and drop is a shortcut; the Upload button below does the same for keyboard users. */}
      <div
        onDragOver={(event) => {
          event.preventDefault()
          if (!busy) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          void handleFile(event.dataTransfer.files[0])
        }}
        className={cn(
          'relative grid place-items-center overflow-hidden rounded-md border border-dashed',
          // Checkerboard, so transparent parts of an image are visible.
          'bg-[repeating-conic-gradient(var(--color-line)_0_25%,var(--color-surface)_0_50%)] bg-size-[16px_16px]',
          previewHeights[shape],
          dragging ? 'border-primary ring-2 ring-primary/30' : 'border-control',
        )}
      >
        {asset ? (
          <img
            src={asset.url}
            alt={`Current ${label}`}
            className={cn(shape === 'banner' ? 'size-full object-cover' : 'max-h-full max-w-full object-contain p-3')}
          />
        ) : (
          <div className="grid justify-items-center gap-1 bg-surface/85 px-4 py-2 text-center text-sm text-ink-muted">
            <ImageIcon className="size-7" aria-hidden="true" />
            <span className="font-semibold">No {label} yet</span>
            <span className="text-xs">Drop an image here or use Upload</span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-surface/70">
            <Spinner />
          </div>
        )}
      </div>

      {rule.type === 'favicon' && asset && (
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <span>At tab size:</span>
          <img src={asset.url} alt="" className="size-4" />
          <img src={asset.url} alt="" className="size-8" />
        </div>
      )}

      {asset && (
        <p className="truncate text-xs text-ink-muted" title={asset.originalName}>
          {describeAsset(asset)}
        </p>
      )}

      <ul aria-label={`${rule.label} requirements`} className="flex flex-wrap gap-1.5">
        {describeRule(rule).map((item) => (
          <li key={item}>
            <Badge>{item}</Badge>
          </li>
        ))}
      </ul>

      {problem && (
        <p id={problemId} role="alert" className="text-sm font-semibold text-danger">
          {problem}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={acceptAttribute(rule)}
        onChange={(event) => {
          const file = event.target.files?.[0]
          // Lets the same file be chosen again after fixing it.
          event.target.value = ''
          void handleFile(file)
        }}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          loading={upload.isPending}
          disabled={busy}
          aria-describedby={problem ? problemId : undefined}
          onClick={() => inputRef.current?.click()}
        >
          {!upload.isPending && <UploadSimpleIcon className="size-4" aria-hidden="true" />}
          {asset ? 'Replace' : 'Upload'}
          <span className="sr-only">: {rule.label}</span>
        </Button>
        {asset && (
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            className="text-danger hover:bg-danger-soft hover:text-danger"
            onClick={() => setConfirmOpen(true)}
          >
            <TrashIcon className="size-4" aria-hidden="true" />
            Remove
            <span className="sr-only">: {rule.label}</span>
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove the ${label}?`}
        description="The image is deleted from the server. Places that show it go back to their default until a new one is uploaded."
        confirmLabel="Remove image"
        onConfirm={async () => {
          try {
            await remove.mutateAsync(rule.type)
            setProblem(null)
            toast.success(`${rule.label} removed`)
          } catch (error) {
            toast.error(`Couldn’t remove the ${label}`, getErrorMessage(error))
          }
        }}
      />
    </section>
  )
}
