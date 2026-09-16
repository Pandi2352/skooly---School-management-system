import { z } from 'zod'
import {
  FONT_FAMILIES,
  FONT_STYLES,
  IMAGE_FIELD_KEYS,
  SIZE_IDS,
  TEMPLATE_AUDIENCES,
  TEMPLATE_CATEGORIES,
  TEMPLATE_SOURCES,
  TEXT_ALIGNS,
} from '../constants'

// Every position and size is in millimetres, so a design prints at its real size.
const geometry = {
  id: z.string(),
  name: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number(),
}

export const textElementSchema = z.object({
  ...geometry,
  type: z.literal('text'),
  /** May contain {{field}} tokens. */
  text: z.string(),
  fontSize: z.number().positive(),
  fontFamily: z.enum(FONT_FAMILIES),
  fontStyle: z.enum(FONT_STYLES),
  align: z.enum(TEXT_ALIGNS),
  fill: z.string(),
})

export const rectElementSchema = z.object({
  ...geometry,
  type: z.literal('rect'),
  fill: z.string(),
  stroke: z.string(),
  strokeWidth: z.number().nonnegative(),
  cornerRadius: z.number().nonnegative(),
})

export const ellipseElementSchema = z.object({
  ...geometry,
  type: z.literal('ellipse'),
  fill: z.string(),
  stroke: z.string(),
  strokeWidth: z.number().nonnegative(),
})

/** A straight bar: `width` is its length and `height` its thickness. */
export const lineElementSchema = z.object({
  ...geometry,
  type: z.literal('line'),
  stroke: z.string(),
})

/** An uploaded image (`src`), or a placeholder for a field such as the student's photo. */
export const imageElementSchema = z.object({
  ...geometry,
  type: z.literal('image'),
  src: z.string().nullable(),
  field: z.enum(IMAGE_FIELD_KEYS).nullable(),
  cornerRadius: z.number().nonnegative(),
})

export const designElementSchema = z.discriminatedUnion('type', [
  textElementSchema,
  rectElementSchema,
  ellipseElementSchema,
  lineElementSchema,
  imageElementSchema,
])

export const cardSideSchema = z.object({
  background: z.string(),
  elements: z.array(designElementSchema),
})

const sideLength = z.number().min(20, 'Use at least 20 mm').max(420, 'Use 420 mm or less')

/** What the designer edits and saves. */
export const templateDraftSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Give the design a name before saving')
    .max(80, 'Use 80 characters or fewer'),
  category: z.enum(TEMPLATE_CATEGORIES),
  audience: z.enum(TEMPLATE_AUDIENCES),
  sizeId: z.enum(SIZE_IDS),
  widthMm: sideLength,
  heightMm: sideLength,
  front: cardSideSchema,
  back: cardSideSchema,
})

export const templateSchema = templateDraftSchema.extend({
  id: z.string(),
  source: z.enum(TEMPLATE_SOURCES),
  updatedAt: z.string(),
})

export const templateListSchema = z.array(templateSchema)
