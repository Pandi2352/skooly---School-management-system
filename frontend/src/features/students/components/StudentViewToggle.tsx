import { ListBulletsIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { iconButtonClasses } from '@/components/ui/buttonStyles'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/cn'
import type { StudentView } from '../types/student.types'

const views = [
  { value: 'list', label: 'Table view', icon: ListBulletsIcon },
  { value: 'grid', label: 'Card view', icon: SquaresFourIcon },
] as const

type StudentViewToggleProps = {
  value: StudentView
  onChange: (view: StudentView) => void
}

export function StudentViewToggle({ value, onChange }: StudentViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Layout"
      className="flex rounded-md border border-control p-0.5 print:hidden"
    >
      {views.map(({ value: view, label, icon: ViewIcon }) => (
        <Tooltip key={view} content={label}>
          <button
            type="button"
            aria-label={label}
            aria-pressed={value === view}
            onClick={() => onChange(view)}
            className={cn(
              iconButtonClasses({ size: 'sm' }),
              value === view && 'bg-primary text-surface hover:bg-primary hover:text-surface',
            )}
          >
            <ViewIcon className="size-4.5" aria-hidden="true" />
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
