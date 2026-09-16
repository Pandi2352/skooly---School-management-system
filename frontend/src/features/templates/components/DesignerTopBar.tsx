import { CaretLeftIcon, FloppyDiskIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NumberField } from '@/components/ui/NumberField'
import { Select } from '@/components/ui/Select'
import { AUDIENCE_OPTIONS, CARD_SIZES } from '../constants'
import type { SizeId, TemplateAudience } from '../types/template.types'
import { roundMm } from '../utils/designElements'
import { findCardSize, isTemplateAudience } from '../utils/guards'

const sizeOptions = [
  ...CARD_SIZES.map((size) => ({ value: size.id, label: size.label })),
  // Shown once width or height is typed in; picked by editing those, not from the list.
  { value: 'custom', label: 'Custom size', disabled: true },
]

type DesignerTopBarProps = {
  name: string
  onRename: (name: string) => void
  audience: TemplateAudience
  onAudienceChange: (audience: TemplateAudience) => void
  sizeId: SizeId
  widthMm: number
  heightMm: number
  onSizeChange: (sizeId: SizeId, widthMm: number, heightMm: number) => void
  isDirty: boolean
  saving: boolean
  onSave: () => void
}

export function DesignerTopBar({
  name,
  onRename,
  audience,
  onAudienceChange,
  sizeId,
  widthMm,
  heightMm,
  onSizeChange,
  isDirty,
  saving,
  onSave,
}: DesignerTopBarProps) {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-primary px-4 py-2 text-surface">
      <Link
        to={paths.templateGallery}
        className="inline-flex h-8 flex-none items-center gap-1.5 rounded-md border border-surface/40 px-2.5 text-sm font-semibold hover:bg-surface/10"
      >
        <CaretLeftIcon className="size-4" weight="bold" aria-hidden="true" />
        Templates
      </Link>
      <div className="w-72 min-w-0">
        <Input
          label="Design name"
          hideLabel
          value={name}
          maxLength={80}
          placeholder="Untitled design — name it here"
          onChange={(event) => onRename(event.target.value)}
          className="h-8 border-transparent bg-transparent font-bold text-surface placeholder:text-surface/80 hover:border-surface/50 focus-visible:border-surface"
        />
      </div>
      {isDirty && <span className="text-sm text-surface/90">Unsaved changes</span>}

      <div className="ms-auto flex flex-wrap items-center gap-2">
        <span className="text-sm text-surface/90" aria-hidden="true">
          For
        </span>
        <div className="w-28">
          <Select
            label="Design for"
            hideLabel
            size="sm"
            options={AUDIENCE_OPTIONS}
            value={audience}
            onValueChange={(value) => {
              if (isTemplateAudience(value)) onAudienceChange(value)
            }}
          />
        </div>
        <span className="text-sm text-surface/90" aria-hidden="true">
          Size (mm)
        </span>
        <div className="w-60">
          <Select
            label="Card size"
            hideLabel
            size="sm"
            options={sizeOptions}
            value={sizeId}
            onValueChange={(value) => {
              const size = findCardSize(value)
              if (size) onSizeChange(size.id, size.widthMm, size.heightMm)
            }}
          />
        </div>
        <NumberField
          label="Width in millimetres"
          hideLabel
          value={widthMm}
          min={20}
          max={420}
          step={0.1}
          className="h-8 w-20"
          onCommit={(width) => onSizeChange('custom', roundMm(width), heightMm)}
        />
        <span aria-hidden="true">×</span>
        <NumberField
          label="Height in millimetres"
          hideLabel
          value={heightMm}
          min={20}
          max={420}
          step={0.1}
          className="h-8 w-20"
          onCommit={(height) => onSizeChange('custom', widthMm, roundMm(height))}
        />
        <Button
          size="sm"
          loading={saving}
          onClick={onSave}
          className="bg-surface text-primary hover:bg-surface/90 active:bg-surface/80"
        >
          {!saving && <FloppyDiskIcon className="size-4" aria-hidden="true" />}
          Save
        </Button>
      </div>
    </header>
  )
}
