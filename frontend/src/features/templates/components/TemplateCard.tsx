import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Badge } from '@/components/ui/Badge'
import { TEMPLATE_CATEGORY_LABELS } from '../constants'
import type { Template } from '../types/template.types'
import { TemplatePreview } from './TemplatePreview'

export function TemplateCard({ template }: { template: Template }) {
  const isCustom = template.source === 'custom'
  // Tall designs fill the preview box's height, wide ones its width.
  const previewFit = template.heightMm / template.widthMm > 0.62 ? 'h-full' : 'w-full'

  return (
    <li className="grid min-w-0 grid-rows-[auto_1fr] overflow-hidden rounded-md border border-line bg-surface">
      <div className="grid h-56 place-items-center bg-canvas p-4">
        <TemplatePreview template={template} className={previewFit} />
      </div>
      <div className="grid content-between gap-3 border-t border-line p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="min-w-0 font-semibold text-ink">{template.name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {isCustom && <Badge tone="info">Your design</Badge>}
            <Badge>{TEMPLATE_CATEGORY_LABELS[template.category]}</Badge>
          </div>
        </div>
        <Link
          to={paths.canvasDesigner(template.id)}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary/10 px-3 text-sm font-semibold text-primary hover:bg-primary/15 pointer-coarse:h-11"
        >
          {isCustom ? 'Edit design' : 'Use this template'}
          <span className="sr-only">: {template.name}</span>
        </Link>
      </div>
    </li>
  )
}
