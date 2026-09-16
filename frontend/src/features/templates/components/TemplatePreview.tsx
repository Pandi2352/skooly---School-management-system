import { ImageIcon } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { TEXT_LINE_HEIGHT } from '../constants'
import type { DesignElement, Template } from '../types/template.types'
import { resolveFieldText } from '../utils/fieldText'

type TemplatePreviewProps = {
  template: Pick<Template, 'widthMm' | 'heightMm' | 'front'>
  className?: string
}

/**
 * The front of a design drawn with plain HTML (no canvas), for gallery thumbnails. Positions are
 * percentages and text sizes container units, so it scales to whatever box it's given.
 * Positions and colours come from the design data, so they're inline styles.
 */
export function TemplatePreview({ template, className }: TemplatePreviewProps) {
  const { widthMm, heightMm, front } = template
  return (
    <div
      aria-hidden="true"
      className={cn('@container relative overflow-hidden shadow-md ring-1 ring-line', className)}
      style={{ aspectRatio: `${widthMm} / ${heightMm}`, backgroundColor: front.background }}
    >
      {front.elements.map((element) => (
        <PreviewElement key={element.id} element={element} widthMm={widthMm} heightMm={heightMm} />
      ))}
    </div>
  )
}

type PreviewElementProps = { element: DesignElement; widthMm: number; heightMm: number }

function PreviewElement({ element, widthMm, heightMm }: PreviewElementProps) {
  const acrossWidth = (mm: number) => `${(mm / widthMm) * 100}%`
  const acrossHeight = (mm: number) => `${(mm / heightMm) * 100}%`
  const scaled = (mm: number) => `${(mm / widthMm) * 100}cqw`
  const border = (strokeWidth: number, stroke: string) =>
    strokeWidth > 0 ? `${scaled(strokeWidth)} solid ${stroke}` : undefined

  const box: CSSProperties = {
    left: acrossWidth(element.x),
    top: acrossHeight(element.y),
    width: acrossWidth(element.width),
    height: acrossHeight(element.height),
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
  }
  const base = 'absolute origin-top-left'

  switch (element.type) {
    case 'text':
      return (
        <p
          className={cn(base, 'wrap-break-word whitespace-pre-wrap')}
          style={{
            ...box,
            height: undefined,
            fontSize: scaled(element.fontSize),
            lineHeight: TEXT_LINE_HEIGHT,
            fontFamily: element.fontFamily,
            fontWeight: element.fontStyle.includes('bold') ? 700 : 400,
            fontStyle: element.fontStyle.includes('italic') ? 'italic' : 'normal',
            textAlign: element.align,
            color: element.fill,
          }}
        >
          {resolveFieldText(element.text, 'preview')}
        </p>
      )
    case 'rect':
      return (
        <div
          className={base}
          style={{
            ...box,
            backgroundColor: element.fill,
            border: border(element.strokeWidth, element.stroke),
            borderRadius: scaled(element.cornerRadius),
          }}
        />
      )
    case 'ellipse':
      return (
        <div
          className={cn(base, 'rounded-[50%]')}
          style={{
            ...box,
            backgroundColor: element.fill,
            border: border(element.strokeWidth, element.stroke),
          }}
        />
      )
    case 'line':
      return <div className={base} style={{ ...box, backgroundColor: element.stroke }} />
    case 'image':
      return element.src ? (
        <img
          src={element.src}
          alt=""
          className={cn(base, 'object-cover')}
          style={{ ...box, borderRadius: scaled(element.cornerRadius) }}
        />
      ) : (
        <div
          className={cn(
            base,
            'grid place-items-center border border-dashed border-[#94a3b8] bg-[#e2e8f0] text-[#475569]',
          )}
          style={{ ...box, borderRadius: scaled(element.cornerRadius) }}
        >
          <ImageIcon className="size-1/2 max-h-8 max-w-8" aria-hidden="true" />
        </div>
      )
  }
}
