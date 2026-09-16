import {
  IdentificationCardIcon,
  ImageIcon,
  LayoutIcon,
  RectangleIcon,
  TextTIcon,
  type Icon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { SearchInput } from '@/components/ui/SearchInput'
import type { CardDimensions, DesignElement, TemplateAudience } from '../types/template.types'
import { createFieldTextElement, createImageElement } from '../utils/designElements'
import { imageFieldsFor, schoolTextFields, textFieldsFor } from '../utils/fieldText'
import { buildLayout, LAYOUT_PRESETS, type LayoutPresetId } from '../utils/layoutPresets'
import { LibraryItemButton } from './LibraryItemButton'

const layoutIcons: Record<LayoutPresetId, Icon> = {
  'photo-top': LayoutIcon,
  'photo-left': IdentificationCardIcon,
  'coloured-header': RectangleIcon,
}

const groupHeading = 'text-xs font-bold tracking-wide text-ink-muted uppercase'

type LibraryItem = { key: string; label: string; icon: Icon; create: () => DesignElement }

type LibraryFieldsPanelProps = {
  card: CardDimensions
  audience: TemplateAudience
  onAdd: (element: DesignElement) => void
  onApplyLayout: (elements: DesignElement[]) => void
}

export function LibraryFieldsPanel({
  card,
  audience,
  onAdd,
  onApplyLayout,
}: LibraryFieldsPanelProps) {
  const [query, setQuery] = useState('')
  const matches = (label: string) => label.toLowerCase().includes(query.trim().toLowerCase())

  const groups: { title: string; items: LibraryItem[] }[] = [
    {
      title: 'Images',
      items: imageFieldsFor(audience)
        .filter((field) => matches(field.label))
        .map((field) => ({
          key: field.key,
          label: field.label,
          icon: ImageIcon,
          create: () =>
            createImageElement(card, { name: field.label, field: field.key, src: null }),
        })),
    },
    {
      title: audience === 'student' ? 'Student' : 'Staff',
      items: textFieldsFor(audience)
        .filter((field) => matches(field.label))
        .map((field) => ({
          key: field.key,
          label: field.label,
          icon: TextTIcon,
          create: () => createFieldTextElement(card, field),
        })),
    },
    {
      title: 'School',
      items: schoolTextFields
        .filter((field) => matches(field.label))
        .map((field) => ({
          key: field.key,
          label: field.label,
          icon: TextTIcon,
          create: () => createFieldTextElement(card, field),
        })),
    },
  ]
  const nothingMatches = groups.every((group) => group.items.length === 0)

  return (
    <div className="grid gap-4">
      <section aria-labelledby="library-layouts" className="grid gap-2">
        <h2 id="library-layouts" className={groupHeading}>
          Start with a layout
        </h2>
        <div className="grid grid-cols-3 gap-1.5">
          {LAYOUT_PRESETS.map((preset) => {
            const PresetIcon = layoutIcons[preset.id]
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyLayout(buildLayout(preset.id, card, audience))}
                className="grid h-16 cursor-pointer content-center justify-items-center gap-1 rounded-md border border-line px-1 text-center text-xs leading-tight text-ink hover:border-primary/40 hover:bg-primary/5"
              >
                <PresetIcon className="size-5 text-primary" weight="fill" aria-hidden="true" />
                {preset.label}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-ink-muted">A layout replaces this side. Undo with Ctrl+Z.</p>
      </section>

      <SearchInput
        label="Search fields"
        placeholder="Search fields…"
        value={query}
        onValueChange={setQuery}
      />

      {groups.map(
        (group) =>
          group.items.length > 0 && (
            <section key={group.title} aria-label={group.title} className="grid gap-1.5">
              <h2 className={groupHeading}>{group.title}</h2>
              <ul className="grid gap-1">
                {group.items.map((item) => (
                  <li key={item.key}>
                    <LibraryItemButton
                      label={item.label}
                      icon={item.icon}
                      onClick={() => onAdd(item.create())}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ),
      )}
      {nothingMatches && <p className="text-sm text-ink-muted">No fields match “{query}”.</p>}
    </div>
  )
}
