import { SearchInput } from '@/components/ui/SearchInput'
import { cn } from '@/lib/cn'
import { TEMPLATE_CATEGORIES, TEMPLATE_CATEGORY_LABELS } from '../constants'
import type { TemplateCategory } from '../types/template.types'

type CategoryChoice = TemplateCategory | 'all'

type TemplateFilterBarProps = {
  search: string
  onSearchChange: (search: string) => void
  category: CategoryChoice
  onCategoryChange: (category: CategoryChoice) => void
  counts: Record<TemplateCategory, number>
  total: number
  showCategories: boolean
}

export function TemplateFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  counts,
  total,
  showCategories,
}: TemplateFilterBarProps) {
  // Empty categories are hidden unless selected, so every chip leads somewhere.
  const chips: { value: CategoryChoice; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: total },
    ...TEMPLATE_CATEGORIES.filter((item) => counts[item] > 0 || item === category).map((item) => ({
      value: item,
      label: TEMPLATE_CATEGORY_LABELS[item],
      count: counts[item],
    })),
  ]

  return (
    <div
      className={cn(
        'grid gap-3 rounded-md border border-line bg-surface p-3',
        showCategories
          ? 'lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center'
          : 'sm:grid-cols-[minmax(0,24rem)]',
      )}
    >
      <SearchInput
        label="Search templates"
        placeholder="Search templates…"
        value={search}
        onValueChange={onSearchChange}
      />
      {showCategories && (
        <div
          role="group"
          aria-label="Filter by category"
          className="flex min-w-0 gap-2 overflow-x-auto pb-1"
        >
          {chips.map((chip) => {
            const active = chip.value === category
            return (
              <button
                key={chip.value}
                type="button"
                aria-pressed={active}
                onClick={() => onCategoryChange(chip.value)}
                className={cn(
                  'inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-semibold pointer-coarse:h-11',
                  active
                    ? 'border-primary bg-primary text-surface'
                    : 'border-line bg-surface text-ink hover:border-primary/40 hover:bg-primary/5',
                )}
              >
                {chip.label}
                <span
                  className={cn(
                    'min-w-6 rounded-full px-1.5 text-center text-xs',
                    active ? 'bg-surface/20 text-surface' : 'bg-canvas text-ink-muted',
                  )}
                >
                  {chip.count}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
