import type {
  CardDimensions,
  DesignElement,
  ImageFieldKey,
  TemplateAudience,
} from '../types/template.types'
import { baseFontSize, makeImage, makeRect, makeText, roundMm } from './designElements'
import { fieldToken } from './fieldText'

export const LAYOUT_PRESETS = [
  { id: 'photo-top', label: 'Photo on top' },
  { id: 'photo-left', label: 'Photo on left' },
  { id: 'coloured-header', label: 'Coloured header' },
] as const

export type LayoutPresetId = (typeof LAYOUT_PRESETS)[number]['id']

type PersonFields = {
  name: string
  photo: ImageFieldKey
  details: string
}

function personFields(audience: TemplateAudience): PersonFields {
  return audience === 'student'
    ? {
        name: fieldToken('studentName'),
        photo: 'studentPhoto',
        details: `Class: ${fieldToken('classSection')}\nAdm No: ${fieldToken('admissionNo')}\nBlood Group: ${fieldToken('bloodGroup')}`,
      }
    : {
        name: fieldToken('staffName'),
        photo: 'staffPhoto',
        details: `${fieldToken('designation')}\nEmp ID: ${fieldToken('employeeId')}\nBlood Group: ${fieldToken('bloodGroup')}`,
      }
}

const NAVY = '#1f3a5f'
const WHITE = '#ffffff'

/** Starting layouts, sized in proportion to the card so they work at any size. */
export function buildLayout(
  preset: LayoutPresetId,
  card: CardDimensions,
  audience: TemplateAudience,
): DesignElement[] {
  const { widthMm: w, heightMm: h } = card
  const person = personFields(audience)
  const fontSize = baseFontSize(card)
  const margin = roundMm(w * 0.06)

  switch (preset) {
    case 'photo-top': {
      const photoWidth = roundMm(Math.min(w, h) * 0.38)
      const photoHeight = roundMm(photoWidth * 1.25)
      const photoY = roundMm(h * 0.16)
      const nameY = roundMm(photoY + photoHeight + h * 0.03)
      return [
        makeText({
          name: 'School Name',
          x: margin,
          y: roundMm(h * 0.04),
          width: roundMm(w - margin * 2),
          text: fieldToken('schoolName'),
          fontSize,
          fontStyle: 'bold',
          align: 'center',
          fill: NAVY,
        }),
        makeImage({
          name: 'Photo',
          x: roundMm((w - photoWidth) / 2),
          y: photoY,
          width: photoWidth,
          height: photoHeight,
          field: person.photo,
        }),
        makeText({
          name: 'Name',
          x: margin,
          y: nameY,
          width: roundMm(w - margin * 2),
          text: person.name,
          fontSize: roundMm(fontSize * 1.15),
          fontStyle: 'bold',
          align: 'center',
        }),
        makeText({
          name: 'Details',
          x: margin,
          y: roundMm(nameY + fontSize * 1.9),
          width: roundMm(w - margin * 2),
          text: person.details,
          fontSize: roundMm(fontSize * 0.8),
          align: 'center',
        }),
      ]
    }
    case 'photo-left': {
      const photoWidth = roundMm(Math.min(w * 0.3, h * 0.55))
      const photoHeight = roundMm(photoWidth * 1.25)
      const top = roundMm(h * 0.24)
      const textX = roundMm(margin + photoWidth + w * 0.04)
      const textWidth = roundMm(w - textX - margin)
      return [
        makeText({
          name: 'School Name',
          x: margin,
          y: roundMm(h * 0.06),
          width: roundMm(w - margin * 2),
          text: fieldToken('schoolName'),
          fontSize,
          fontStyle: 'bold',
          align: 'left',
          fill: NAVY,
        }),
        makeImage({
          name: 'Photo',
          x: margin,
          y: top,
          width: photoWidth,
          height: photoHeight,
          field: person.photo,
        }),
        makeText({
          name: 'Name',
          x: textX,
          y: top,
          width: textWidth,
          text: person.name,
          fontSize: roundMm(fontSize * 1.1),
          fontStyle: 'bold',
        }),
        makeText({
          name: 'Details',
          x: textX,
          y: roundMm(top + fontSize * 1.8),
          width: textWidth,
          text: person.details,
          fontSize: roundMm(fontSize * 0.8),
        }),
      ]
    }
    case 'coloured-header': {
      const headerHeight = roundMm(h * 0.22)
      const photoWidth = roundMm(Math.min(w, h) * 0.36)
      const photoHeight = roundMm(photoWidth * 1.25)
      const photoY = roundMm(headerHeight * 0.7)
      const nameY = roundMm(photoY + photoHeight + h * 0.03)
      return [
        makeRect({ name: 'Header', x: 0, y: 0, width: w, height: headerHeight, fill: NAVY }),
        makeText({
          name: 'School Name',
          x: margin,
          y: roundMm(headerHeight * 0.18),
          width: roundMm(w - margin * 2),
          text: fieldToken('schoolName'),
          fontSize,
          fontStyle: 'bold',
          align: 'center',
          fill: WHITE,
        }),
        makeImage({
          name: 'Photo',
          x: roundMm((w - photoWidth) / 2),
          y: photoY,
          width: photoWidth,
          height: photoHeight,
          field: person.photo,
          cornerRadius: 1,
        }),
        makeText({
          name: 'Name',
          x: margin,
          y: nameY,
          width: roundMm(w - margin * 2),
          text: person.name,
          fontSize: roundMm(fontSize * 1.15),
          fontStyle: 'bold',
          align: 'center',
          fill: NAVY,
        }),
        makeText({
          name: 'Details',
          x: margin,
          y: roundMm(nameY + fontSize * 1.9),
          width: roundMm(w - margin * 2),
          text: person.details,
          fontSize: roundMm(fontSize * 0.8),
          align: 'center',
        }),
        makeRect({
          name: 'Footer',
          x: 0,
          y: roundMm(h * 0.96),
          width: w,
          height: roundMm(h * 0.04),
          fill: NAVY,
        }),
      ]
    }
  }
}
