import { EmptyState } from '@/components/page/EmptyState'
import { Button } from '@/components/ui/Button'

type StudentsEmptyStateProps = {
  isFiltered: boolean
  onClearFilters: () => void
}

export function StudentsEmptyState({ isFiltered, onClearFilters }: StudentsEmptyStateProps) {
  if (isFiltered) {
    return (
      <EmptyState
        title="No students match these filters"
        description="Try another class, section or status, or search by admission number."
        action={
          <Button variant="secondary" onClick={onClearFilters}>
            Clear filters
          </Button>
        }
      />
    )
  }

  return (
    <EmptyState
      title="No students yet"
      description="Students appear here once they are admitted."
    />
  )
}
