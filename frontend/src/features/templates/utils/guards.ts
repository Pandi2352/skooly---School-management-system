import { CARD_SIZES, FONT_FAMILIES, TEMPLATE_AUDIENCES, TEMPLATE_CATEGORIES } from '../constants'
import type {
  FontFamily,
  PresetSizeId,
  TemplateAudience,
  TemplateCategory,
} from '../types/template.types'

export const isTemplateCategory = (value: string): value is TemplateCategory =>
  TEMPLATE_CATEGORIES.some((category) => category === value)

export const isTemplateAudience = (value: string): value is TemplateAudience =>
  TEMPLATE_AUDIENCES.some((audience) => audience === value)

export const isFontFamily = (value: string): value is FontFamily =>
  FONT_FAMILIES.some((family) => family === value)

export const isPresetSizeId = (value: string): value is PresetSizeId =>
  CARD_SIZES.some((size) => size.id === value)

export const findCardSize = (value: string) => CARD_SIZES.find((size) => size.id === value)
