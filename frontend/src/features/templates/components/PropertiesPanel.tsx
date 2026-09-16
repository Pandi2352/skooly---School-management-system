import {
  ArrowCounterClockwiseIcon,
  ArrowUpIcon,
  EyeIcon,
  SelectionIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import { CARD_SWATCHES } from '../constants'
import type { DesignElement, ElementChanges, TemplateAudience } from '../types/template.types'
import { ColorField } from './ColorField'
import { ElementProperties } from './ElementProperties'
import { LayersList } from './LayersList'

type PropertiesPanelProps = {
  background: string
  onBackgroundChange: (color: string) => void
  selected: DesignElement | null
  audience: TemplateAudience
  onChange: (changes: ElementChanges) => void
  onDuplicate: () => void
  onDelete: () => void
  elements: DesignElement[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (id: string, direction: 'forward' | 'backward') => void
}

const tips = [
  { icon: EyeIcon, text: 'Preview shows sample data' },
  { icon: SelectionIcon, text: 'Drag to move; handles resize and rotate' },
  { icon: ArrowUpIcon, text: 'Arrow keys nudge 1 mm (Shift: 5 mm) · Delete removes' },
  { icon: ArrowCounterClockwiseIcon, text: 'Ctrl+Z undo · Ctrl+Y redo · Ctrl+D duplicate' },
]

export function PropertiesPanel({
  background,
  onBackgroundChange,
  selected,
  audience,
  onChange,
  onDuplicate,
  onDelete,
  elements,
  selectedId,
  onSelect,
  onReorder,
}: PropertiesPanelProps) {
  const currentBackground = background.toLowerCase()

  return (
    <aside
      aria-label="Properties"
      className="flex w-72 flex-none flex-col overflow-y-auto border-s border-line bg-surface"
    >
      <section
        aria-labelledby="card-background-heading"
        className="grid gap-3 border-b border-line p-4"
      >
        <h2 id="card-background-heading" className="text-sm font-bold text-ink">
          Card background
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {CARD_SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Background ${color}`}
              aria-pressed={currentBackground === color}
              onClick={() => onBackgroundChange(color)}
              className={cn(
                'size-7 cursor-pointer rounded-md ring-1 ring-line',
                currentBackground === color &&
                  'ring-2 ring-primary ring-offset-2 ring-offset-surface',
              )}
              // The swatch shows its own colour, which comes from data.
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <ColorField label="Custom colour" value={background} onChange={onBackgroundChange} />
      </section>

      {selected ? (
        <ElementProperties
          key={selected.id}
          element={selected}
          audience={audience}
          onChange={onChange}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ) : (
        <section
          aria-label="Tips"
          className="grid gap-2 border-b border-line p-4 text-sm text-ink-muted"
        >
          <p>Select an element on the card, or in Layers, to edit it.</p>
          <ul className="grid gap-1.5">
            {tips.map(({ icon: TipIcon, text }) => (
              <li key={text} className="flex gap-2">
                <TipIcon className="mt-0.5 size-4 flex-none" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </section>
      )}

      <LayersList
        elements={elements}
        selectedId={selectedId}
        onSelect={onSelect}
        onReorder={onReorder}
      />
    </aside>
  )
}
