import type { z } from 'zod'
import type {
  FONT_FAMILIES,
  FONT_STYLES,
  IMAGE_FIELD_KEYS,
  SIZE_IDS,
  TEMPLATE_AUDIENCES,
  TEMPLATE_CATEGORIES,
  TEXT_ALIGNS,
} from '../constants'
import type {
  cardSideSchema,
  designElementSchema,
  templateDraftSchema,
  templateSchema,
} from '../schemas/template.schema'

export type Template = z.infer<typeof templateSchema>
export type TemplateDraft = z.infer<typeof templateDraftSchema>
export type CardSide = z.infer<typeof cardSideSchema>
export type DesignElement = z.infer<typeof designElementSchema>
export type DesignElementType = DesignElement['type']
export type TextElement = Extract<DesignElement, { type: 'text' }>

export type CardSideName = 'front' | 'back'
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]
export type TemplateAudience = (typeof TEMPLATE_AUDIENCES)[number]
export type SizeId = (typeof SIZE_IDS)[number]
export type PresetSizeId = Exclude<SizeId, 'custom'>
export type FontFamily = (typeof FONT_FAMILIES)[number]
export type FontStyle = (typeof FONT_STYLES)[number]
export type TextAlign = (typeof TEXT_ALIGNS)[number]
export type ImageFieldKey = (typeof IMAGE_FIELD_KEYS)[number]

export type CardDimensions = { widthMm: number; heightMm: number }

/** `design` shows field names in brackets; `preview` fills in sample values. */
export type RenderMode = 'design' | 'preview'

/** Any subset of element properties; only the ones the element has are meaningful. */
export type ElementChanges = Partial<{
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  text: string
  fontSize: number
  fontFamily: FontFamily
  fontStyle: FontStyle
  align: TextAlign
  fill: string
  stroke: string
  strokeWidth: number
  cornerRadius: number
  src: string | null
  field: ImageFieldKey | null
}>

export type TemplateFilters = { search: string; category: TemplateCategory | 'all' }
