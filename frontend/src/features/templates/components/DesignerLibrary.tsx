import { ShapesIcon, TextTIcon, UploadSimpleIcon, type Icon } from '@phosphor-icons/react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { CardDimensions, DesignElement, TemplateAudience } from '../types/template.types'
import { LibraryElementsPanel } from './LibraryElementsPanel'
import { LibraryFieldsPanel } from './LibraryFieldsPanel'
import { LibraryUploadsPanel } from './LibraryUploadsPanel'

type LibrarySection = 'fields' | 'elements' | 'uploads'

const sections: { id: LibrarySection; label: string; icon: Icon }[] = [
  { id: 'fields', label: 'Fields', icon: TextTIcon },
  { id: 'elements', label: 'Elements', icon: ShapesIcon },
  { id: 'uploads', label: 'Uploads', icon: UploadSimpleIcon },
]

type DesignerLibraryProps = {
  card: CardDimensions
  audience: TemplateAudience
  uploads: string[]
  onAdd: (element: DesignElement) => void
  onApplyLayout: (elements: DesignElement[]) => void
  onUpload: (src: string) => void
}

export function DesignerLibrary({
  card,
  audience,
  uploads,
  onAdd,
  onApplyLayout,
  onUpload,
}: DesignerLibraryProps) {
  const [section, setSection] = useState<LibrarySection>('fields')

  return (
    <aside
      aria-label="Design library"
      className="flex w-64 flex-none flex-col border-e border-line bg-surface"
    >
      <div
        role="group"
        aria-label="Library sections"
        className="grid grid-cols-3 gap-1 border-b border-line p-2"
      >
        {sections.map((item) => {
          const SectionIcon = item.icon
          const active = section === item.id
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSection(item.id)}
              className={cn(
                'flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border text-[0.8125rem] font-semibold',
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-line text-ink hover:bg-primary/5',
              )}
            >
              <SectionIcon className="size-4" weight="fill" aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {section === 'fields' && (
          <LibraryFieldsPanel
            card={card}
            audience={audience}
            onAdd={onAdd}
            onApplyLayout={onApplyLayout}
          />
        )}
        {section === 'elements' && <LibraryElementsPanel card={card} onAdd={onAdd} />}
        {section === 'uploads' && (
          <LibraryUploadsPanel card={card} uploads={uploads} onAdd={onAdd} onUpload={onUpload} />
        )}
      </div>
    </aside>
  )
}
