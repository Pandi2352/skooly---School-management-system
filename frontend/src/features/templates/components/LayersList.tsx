import {
  ArrowDownIcon,
  ArrowUpIcon,
  CircleIcon,
  ImageIcon,
  MinusIcon,
  SquareIcon,
  StackIcon,
  TextTIcon,
  type Icon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/cn'
import type { DesignElement, DesignElementType } from '../types/template.types'
import { ToolButton } from './ToolButton'

const typeIcons: Record<DesignElementType, Icon> = {
  text: TextTIcon,
  rect: SquareIcon,
  ellipse: CircleIcon,
  line: MinusIcon,
  image: ImageIcon,
}

type LayersListProps = {
  elements: DesignElement[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (id: string, direction: 'forward' | 'backward') => void
}

/** Top layer first, the way it looks on the card. */
export function LayersList({ elements, selectedId, onSelect, onReorder }: LayersListProps) {
  const layers = [...elements].reverse()

  return (
    <section aria-labelledby="layers-heading" className="grid gap-2 p-4">
      <h2 id="layers-heading" className="flex items-center gap-2 text-sm font-bold text-ink">
        <StackIcon className="size-4.5 text-primary" weight="fill" aria-hidden="true" />
        Layers
      </h2>
      {layers.length === 0 ? (
        <p className="text-sm text-ink-muted">Nothing on this side yet.</p>
      ) : (
        <ul className="grid gap-1">
          {layers.map((element, index) => {
            const LayerIcon = typeIcons[element.type]
            const selected = element.id === selectedId
            return (
              <li
                key={element.id}
                className={cn(
                  'flex items-center gap-0.5 rounded-md border pe-0.5',
                  selected
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent hover:bg-primary/5',
                )}
              >
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(element.id)}
                  className="flex min-h-8 min-w-0 flex-1 cursor-pointer items-center gap-2 px-2 text-start text-sm text-ink"
                >
                  <LayerIcon className="size-4 flex-none text-ink-muted" aria-hidden="true" />
                  <span className="truncate">{element.name}</span>
                </button>
                <ToolButton
                  label={`Bring ${element.name} forward`}
                  icon={ArrowUpIcon}
                  disabled={index === 0}
                  onClick={() => onReorder(element.id, 'forward')}
                />
                <ToolButton
                  label={`Send ${element.name} backward`}
                  icon={ArrowDownIcon}
                  disabled={index === layers.length - 1}
                  onClick={() => onReorder(element.id, 'backward')}
                />
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
