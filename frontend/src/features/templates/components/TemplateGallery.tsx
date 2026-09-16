import { SquaresFourIcon } from '@phosphor-icons/react'
import { EmptyState } from '@/components/page/EmptyState'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { Button } from '@/components/ui/Button'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useTemplateFilters } from '../hooks/useTemplateFilters'
import { useTemplates } from '../hooks/useTemplates'
import type { TemplateCategory } from '../types/template.types'
import { countTemplatesByCategory, filterTemplates } from '../utils/templateFilters'
import { TemplateCard } from './TemplateCard'
import { TemplateFilterBar } from './TemplateFilterBar'

type TemplateGalleryProps = {
  /** Shows one category only and hides the category chips. */
  lockedCategory?: TemplateCategory
}

export function TemplateGallery({ lockedCategory }: TemplateGalleryProps) {
  const templates = useTemplates()
  const { filters, isFiltered, setSearch, setCategory, clear } = useTemplateFilters(lockedCategory)
  const all = templates.data ?? []
  const visible = filterTemplates(all, filters)

  let body
  if (templates.isPending) body = <LoadingState label="Loading templates" />
  else if (templates.isError) {
    body = (
      <ErrorState
        title="Couldn’t load templates"
        description={getErrorMessage(templates.error)}
        onRetry={() => void templates.refetch()}
      />
    )
  } else if (visible.length === 0) {
    body = isFiltered ? (
      <EmptyState
        icon={SquaresFourIcon}
        title="No templates match"
        description="Try another word, or clear the search and category."
        action={
          <Button variant="secondary" onClick={clear}>
            Clear filters
          </Button>
        }
      />
    ) : (
      <EmptyState
        icon={SquaresFourIcon}
        title="No designs yet"
        description="Open the Canvas Designer to create one."
      />
    )
  } else {
    body = (
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visible.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </ul>
    )
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5">
      <TemplateFilterBar
        search={filters.search}
        onSearchChange={setSearch}
        category={filters.category}
        onCategoryChange={setCategory}
        counts={countTemplatesByCategory(all)}
        total={all.length}
        showCategories={lockedCategory === undefined}
      />
      {body}
    </div>
  )
}
