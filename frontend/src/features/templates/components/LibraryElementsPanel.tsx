import {
  CircleIcon,
  MinusIcon,
  RectangleIcon,
  SquareIcon,
  TextHIcon,
  TextTIcon,
  type Icon,
} from '@phosphor-icons/react'
import type { CardDimensions, DesignElement } from '../types/template.types'
import {
  createEllipseElement,
  createLineElement,
  createRectElement,
  createTextElement,
} from '../utils/designElements'
import { LibraryItemButton } from './LibraryItemButton'

const items: {
  key: string
  label: string
  icon: Icon
  create: (card: CardDimensions) => DesignElement
}[] = [
  {
    key: 'heading',
    label: 'Heading',
    icon: TextHIcon,
    create: (card) =>
      createTextElement(card, {
        text: 'Heading',
        name: 'Heading',
        fontStyle: 'bold',
        sizeFactor: 1.4,
      }),
  },
  {
    key: 'text',
    label: 'Body text',
    icon: TextTIcon,
    create: (card) => createTextElement(card, { text: 'Text', name: 'Text' }),
  },
  {
    key: 'rect',
    label: 'Rectangle',
    icon: RectangleIcon,
    create: (card) => createRectElement(card, { rounded: false }),
  },
  {
    key: 'rounded',
    label: 'Rounded box',
    icon: SquareIcon,
    create: (card) => createRectElement(card, { rounded: true }),
  },
  { key: 'circle', label: 'Circle', icon: CircleIcon, create: createEllipseElement },
  { key: 'line', label: 'Line', icon: MinusIcon, create: createLineElement },
]

type LibraryElementsPanelProps = { card: CardDimensions; onAdd: (element: DesignElement) => void }

export function LibraryElementsPanel({ card, onAdd }: LibraryElementsPanelProps) {
  return (
    <ul className="grid gap-1">
      {items.map((item) => (
        <li key={item.key}>
          <LibraryItemButton
            label={item.label}
            icon={item.icon}
            onClick={() => onAdd(item.create(card))}
          />
        </li>
      ))}
    </ul>
  )
}
