import type Konva from 'konva'
import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { Layer, Rect, Stage, Transformer } from 'react-konva'
import { MM_TO_PX } from '../constants'
import type { CardSide, ElementChanges, RenderMode } from '../types/template.types'
import { CanvasElement } from './CanvasElement'

type DesignCanvasProps = {
  side: CardSide
  widthMm: number
  heightMm: number
  zoom: number
  mode: RenderMode
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: (id: string, changes: ElementChanges) => void
  /** The scrolling area, measured by "Fit to screen". */
  areaRef: RefObject<HTMLDivElement | null>
}

// Selection handles use a fixed blue: canvas drawing can't read the CSS theme tokens.
const HANDLE_COLOUR = '#2563eb'

export function DesignCanvas({
  side,
  widthMm,
  heightMm,
  zoom,
  mode,
  selectedId,
  onSelect,
  onChange,
  areaRef,
}: DesignCanvasProps) {
  const scale = MM_TO_PX * zoom
  const transformerRef = useRef<Konva.Transformer>(null)
  const nodesRef = useRef(new Map<string, Konva.Group>())

  const registerNode = useCallback((id: string, node: Konva.Group | null) => {
    if (node) nodesRef.current.set(id, node)
    else nodesRef.current.delete(id)
  }, [])

  // Attach the resize handles to the selected element after every render that could move it.
  useEffect(() => {
    const transformer = transformerRef.current
    if (!transformer) return
    const node = selectedId === null ? undefined : nodesRef.current.get(selectedId)
    transformer.nodes(node ? [node] : [])
    transformer.getLayer()?.batchDraw()
  }, [selectedId, side, scale, mode])

  const stageWidth = Math.round(widthMm * scale)
  const stageHeight = Math.round(heightMm * scale)

  return (
    <div
      ref={areaRef}
      className="min-h-0 flex-1 overflow-auto bg-canvas bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[16px_16px]"
    >
      <div className="grid min-h-full min-w-max place-items-center p-10">
        <div className="grid justify-items-center gap-2">
          <div className="bg-surface shadow-lg ring-1 ring-line">
            <Stage
              width={stageWidth}
              height={stageHeight}
              onMouseDown={(event) => {
                if (event.target === event.target.getStage()) onSelect(null)
              }}
            >
              <Layer>
                <Rect
                  width={stageWidth}
                  height={stageHeight}
                  fill={side.background}
                  onMouseDown={() => onSelect(null)}
                  onTouchStart={() => onSelect(null)}
                />
                {side.elements.map((element) => (
                  <CanvasElement
                    key={element.id}
                    element={element}
                    scale={scale}
                    mode={mode}
                    onSelect={onSelect}
                    onChange={onChange}
                    registerNode={registerNode}
                  />
                ))}
                {mode === 'design' && (
                  <Transformer
                    ref={transformerRef}
                    flipEnabled={false}
                    rotationSnaps={[0, 90, 180, 270]}
                    anchorSize={8}
                    anchorCornerRadius={2}
                    anchorStroke={HANDLE_COLOUR}
                    borderStroke={HANDLE_COLOUR}
                    boundBoxFunc={(oldBox, newBox) =>
                      Math.abs(newBox.width) < 4 || Math.abs(newBox.height) < 2 ? oldBox : newBox
                    }
                  />
                )}
              </Layer>
            </Stage>
          </div>
          <p className="text-xs text-ink-muted">
            {widthMm} × {heightMm} mm
          </p>
        </div>
      </div>
    </div>
  )
}
