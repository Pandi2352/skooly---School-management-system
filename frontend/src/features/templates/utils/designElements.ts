import { TEXT_LINE_HEIGHT } from '../constants'
import type {
  CardDimensions,
  DesignElement,
  FontFamily,
  FontStyle,
  ImageFieldKey,
  TextAlign,
} from '../types/template.types'
import { fieldToken } from './fieldText'

export const roundMm = (value: number) => Math.round(value * 10) / 10

export const newElementId = () => crypto.randomUUID()

type Placement = { name: string; x: number; y: number; width: number; rotation?: number }

type TextOptions = Placement & {
  text: string
  fontSize: number
  height?: number
  fontFamily?: FontFamily
  fontStyle?: FontStyle
  align?: TextAlign
  fill?: string
}

export function makeText(options: TextOptions): DesignElement {
  const lines = options.text.split('\n').length
  return {
    id: newElementId(),
    type: 'text',
    name: options.name,
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height ?? roundMm(options.fontSize * TEXT_LINE_HEIGHT * lines),
    rotation: options.rotation ?? 0,
    text: options.text,
    fontSize: options.fontSize,
    fontFamily: options.fontFamily ?? 'Arial',
    fontStyle: options.fontStyle ?? 'normal',
    align: options.align ?? 'left',
    fill: options.fill ?? '#1a2233',
  }
}

type BoxOptions = Placement & { height: number }

export function makeRect(
  options: BoxOptions & {
    fill?: string
    stroke?: string
    strokeWidth?: number
    cornerRadius?: number
  },
): DesignElement {
  return {
    id: newElementId(),
    type: 'rect',
    name: options.name,
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    rotation: options.rotation ?? 0,
    fill: options.fill ?? '#e8eef6',
    stroke: options.stroke ?? '#1f3a5f',
    strokeWidth: options.strokeWidth ?? 0,
    cornerRadius: options.cornerRadius ?? 0,
  }
}

export function makeEllipse(
  options: BoxOptions & { fill?: string; stroke?: string; strokeWidth?: number },
): DesignElement {
  return {
    id: newElementId(),
    type: 'ellipse',
    name: options.name,
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    rotation: options.rotation ?? 0,
    fill: options.fill ?? '#e0e7ff',
    stroke: options.stroke ?? '#1f3a5f',
    strokeWidth: options.strokeWidth ?? 0,
  }
}

export function makeLine(
  options: Omit<Placement, 'name'> & { name?: string; thickness?: number; stroke?: string },
): DesignElement {
  return {
    id: newElementId(),
    type: 'line',
    name: options.name ?? 'Line',
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.thickness ?? 0.4,
    rotation: options.rotation ?? 0,
    stroke: options.stroke ?? '#1f3a5f',
  }
}

export function makeImage(
  options: BoxOptions & {
    field?: ImageFieldKey | null
    src?: string | null
    cornerRadius?: number
  },
): DesignElement {
  return {
    id: newElementId(),
    type: 'image',
    name: options.name,
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    rotation: options.rotation ?? 0,
    src: options.src ?? null,
    field: options.field ?? null,
    cornerRadius: options.cornerRadius ?? 0,
  }
}

// New elements from the toolbar and library land in the middle of the card, sized to it.

const centre = (card: CardDimensions, width: number, height: number) => ({
  x: roundMm((card.widthMm - width) / 2),
  y: roundMm((card.heightMm - height) / 2),
})

export const baseFontSize = (card: CardDimensions) =>
  roundMm(Math.min(8, Math.max(2.4, card.widthMm / 18)))

export function createTextElement(
  card: CardDimensions,
  options: { text: string; name: string; fontStyle?: FontStyle; sizeFactor?: number },
) {
  const fontSize = roundMm(baseFontSize(card) * (options.sizeFactor ?? 1))
  const width = roundMm(card.widthMm * 0.8)
  return makeText({
    ...centre(card, width, fontSize * TEXT_LINE_HEIGHT),
    name: options.name,
    width,
    text: options.text,
    fontSize,
    fontStyle: options.fontStyle ?? 'normal',
    align: 'center',
  })
}

export const createFieldTextElement = (
  card: CardDimensions,
  field: { key: string; label: string },
) => createTextElement(card, { text: fieldToken(field.key), name: field.label })

export function createRectElement(card: CardDimensions, { rounded }: { rounded: boolean }) {
  const width = roundMm(card.widthMm * 0.5)
  const height = roundMm(card.heightMm * 0.2)
  return makeRect({
    ...centre(card, width, height),
    name: rounded ? 'Rounded box' : 'Rectangle',
    width,
    height,
    cornerRadius: rounded ? roundMm(Math.min(width, height) * 0.15) : 0,
  })
}

export function createEllipseElement(card: CardDimensions) {
  const size = roundMm(Math.min(card.widthMm, card.heightMm) * 0.3)
  return makeEllipse({ ...centre(card, size, size), name: 'Circle', width: size, height: size })
}

export function createLineElement(card: CardDimensions) {
  const width = roundMm(card.widthMm * 0.6)
  return makeLine({ ...centre(card, width, 0.4), width })
}

export function createImageElement(
  card: CardDimensions,
  options: { name: string; field: ImageFieldKey | null; src: string | null },
) {
  const width = roundMm(Math.min(card.widthMm, card.heightMm) * 0.4)
  const isPhoto = options.field === 'studentPhoto' || options.field === 'staffPhoto'
  const height = roundMm(isPhoto ? width * 1.25 : width)
  return makeImage({ ...centre(card, width, height), ...options, width, height })
}
