import { TEMPLATE_CATEGORY_LABELS } from '../constants'
import type { Template, TemplateCategory, TemplateFilters } from '../types/template.types'

export function filterTemplates(templates: Template[], filters: TemplateFilters) {
  const query = filters.search.trim().toLowerCase()
  return templates.filter((template) => {
    if (filters.category !== 'all' && template.category !== filters.category) return false
    if (query === '') return true
    return (
      template.name.toLowerCase().includes(query) ||
      TEMPLATE_CATEGORY_LABELS[template.category].toLowerCase().includes(query)
    )
  })
}

export function countTemplatesByCategory(templates: Template[]): Record<TemplateCategory, number> {
  const counts: Record<TemplateCategory, number> = {
    'id-card': 0,
    certificate: 0,
    'fee-receipt': 0,
    'admit-card': 0,
    general: 0,
  }
  for (const template of templates) counts[template.category] += 1
  return counts
}
