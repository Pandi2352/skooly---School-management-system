import type Konva from 'konva'
import { Ellipse, Group, Image as KonvaImage, Rect, Text } from 'react-konva'
import { TEXT_LINE_HEIGHT } from '../constants'
import { useHtmlImage } from '../hooks/useHtmlImage'
import type { DesignElement, ElementChanges, RenderMode } from '../types/template.types'
import { roundMm } from '../utils/designElements'
import { imageFieldLabel, resolveFieldText } from '../utils/fieldText'

type CanvasElementProps = {
  element: DesignElement
  /** Pixels per millimetre at the current zoom. */
  scale: number
  mode: RenderMode
  onSelect: (id: string) => void
  onChange: (id: string, changes: ElementChanges) => void
  registerNode: (id: string, node: Konva.Group | null) => void
}

/**
 * One element on the canvas, wrapped in a group so the transformer can move, resize and rotate
 * every element type the same way. Changes are reported in millimetres when a drag or resize ends.
 */
export function CanvasElement({
  element,
  scale,
  mode,
  onSelect,
  onChange,
  registerNode,
}: CanvasElementProps) {
  const editable = mode === 'design'
  const select = () => onSelect(element.id)

  return (
    <Group
      ref={(node) => {
        registerNode(element.id, node)
      }}
      x={element.x * scale}
      y={element.y * scale}
      rotation={element.rotation}
      draggable={editable}
      listening={editable}
      onMouseDown={select}
      onTouchStart={select}
      onDragEnd={(event) => {
        const x = roundMm(event.target.x() / scale)
        const y = roundMm(event.target.y() / scale)
        if (x !== element.x || y !== element.y) onChange(element.id, { x, y })
      }}
      onTransformEnd={(event) => {
        const node = event.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        // The new size goes into the element's own width and height, not the group's scale.
        node.scaleX(1)
        node.scaleY(1)
        onChange(element.id, {
          x: roundMm(node.x() / scale),
          y: roundMm(node.y() / scale),
          rotation: Math.round(node.rotation()),
          width: roundMm(element.width * scaleX),
          height: roundMm(element.height * scaleY),
        })
      }}
    >
      <ElementShape element={element} scale={scale} mode={mode} />
    </Group>
  )
}

function ElementShape({
  element,
  scale,
  mode,
}: {
  element: DesignElement
  scale: number
  mode: RenderMode
}) {
  const width = element.width * scale
  const height = element.height * scale

  switch (element.type) {
    case 'text':
      return (
        <Text
          width={width}
          text={resolveFieldText(element.text, mode)}
          fontSize={element.fontSize * scale}
          fontFamily={element.fontFamily}
          fontStyle={element.fontStyle}
          align={element.align}
          fill={element.fill}
          lineHeight={TEXT_LINE_HEIGHT}
          wrap="word"
        />
      )
    case 'rect':
      return (
        <Rect
          width={width}
          height={height}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth * scale}
          strokeEnabled={element.strokeWidth > 0}
          cornerRadius={element.cornerRadius * scale}
        />
      )
    case 'ellipse':
      return (
        <Ellipse
          x={width / 2}
          y={height / 2}
          radiusX={width / 2}
          radiusY={height / 2}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth * scale}
          strokeEnabled={element.strokeWidth > 0}
        />
      )
    case 'line':
      return <Rect width={width} height={Math.max(1, height)} fill={element.stroke} />
    case 'image':
      return element.src ? (
        <CanvasImage
          src={element.src}
          width={width}
          height={height}
          cornerRadius={element.cornerRadius * scale}
        />
      ) : (
        <ImagePlaceholder
          width={width}
          height={height}
          cornerRadius={element.cornerRadius * scale}
          label={element.field ? imageFieldLabel(element.field) : 'Image'}
        />
      )
  }
}

type ImageBoxProps = { width: number; height: number; cornerRadius: number }

function CanvasImage({ src, width, height, cornerRadius }: ImageBoxProps & { src: string }) {
  const image = useHtmlImage(src)
  return image ? (
    <KonvaImage image={image} width={width} height={height} cornerRadius={cornerRadius} />
  ) : (
    <Rect width={width} height={height} fill="#f1f5f9" cornerRadius={cornerRadius} />
  )
}

/** Stands in for a field image (photo, logo, QR code) that is filled in per person later. */
function ImagePlaceholder({
  width,
  height,
  cornerRadius,
  label,
}: ImageBoxProps & { label: string }) {
  return (
    <>
      <Rect
        width={width}
        height={height}
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth={1}
        dash={[4, 3]}
        cornerRadius={cornerRadius}
      />
      <Text
        width={width}
        height={height}
        text={label}
        align="center"
        verticalAlign="middle"
        fontSize={Math.max(7, Math.min(width, height) / 6)}
        fill="#475569"
        padding={2}
        listening={false}
      />
    </>
  )
}
