import { MM_TO_PX, ZOOM_FACTOR, ZOOM_MAX, ZOOM_MIN } from '../constants'
import { templateDraftSchema } from '../schemas/template.schema'
import type {
  CardDimensions,
  PresetSizeId,
  SizeId,
  Template,
  TemplateAudience,
  TemplateCategory,
  TemplateDraft,
} from '../types/template.types'
import { findCardSize } from './guards'

export function categoryForSize(sizeId: SizeId): TemplateCategory {
  switch (sizeId) {
    case 'cr80-portrait':
    case 'cr80-landscape':
      return 'id-card'
    case 'a4-portrait':
    case 'a4-landscape':
      return 'certificate'
    case 'a5-landscape':
      return 'fee-receipt'
    case 'custom':
      return 'general'
  }
}

export function createBlankDraft(
  sizeId: PresetSizeId,
  audience: TemplateAudience = 'student',
): TemplateDraft {
  const size = findCardSize(sizeId)
  return {
    name: '',
    category: categoryForSize(sizeId),
    audience,
    sizeId,
    widthMm: size?.widthMm ?? 54,
    heightMm: size?.heightMm ?? 85.6,
    front: { background: '#ffffff', elements: [] },
    back: { background: '#ffffff', elements: [] },
  }
}

/** The editable part of a template, without its id and save details. */
export const toTemplateDraft = (template: Template): TemplateDraft =>
  templateDraftSchema.parse(template)

export const clampZoom = (zoom: number) =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(zoom * 100) / 100))

export const zoomIn = (zoom: number) => clampZoom(zoom * ZOOM_FACTOR)
export const zoomOut = (zoom: number) => clampZoom(zoom / ZOOM_FACTOR)

/** The zoom that fits the whole design inside an area, with a little room around it. */
export function fitZoom(card: CardDimensions, area: { width: number; height: number }) {
  const zoom = Math.min(
    area.width / (card.widthMm * MM_TO_PX),
    area.height / (card.heightMm * MM_TO_PX),
  )
  return clampZoom(zoom * 0.9)
}
