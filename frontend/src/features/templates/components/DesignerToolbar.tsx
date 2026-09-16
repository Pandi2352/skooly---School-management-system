import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CircleIcon,
  CopyIcon,
  CornersOutIcon,
  EyeIcon,
  EyeSlashIcon,
  ImageIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  MinusIcon,
  SquareIcon,
  TextTIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { CARD_SIDES, ZOOM_MAX, ZOOM_MIN } from '../constants'
import type { CardSideName } from '../types/template.types'
import { ImagePicker } from './ImagePicker'
import { ToolButton } from './ToolButton'

type DesignerToolbarProps = {
  libraryOpen: boolean
  onToggleLibrary: () => void
  side: CardSideName
  onSideChange: (side: CardSideName) => void
  onAddText: () => void
  onAddRect: () => void
  onAddEllipse: () => void
  onAddLine: () => void
  onAddImage: (src: string) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  hasSelection: boolean
  canForward: boolean
  canBackward: boolean
  onForward: () => void
  onBackward: () => void
  onDuplicate: () => void
  onDelete: () => void
  preview: boolean
  onPreviewChange: (preview: boolean) => void
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
}

const Divider = () => <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />

export function DesignerToolbar(props: DesignerToolbarProps) {
  const editing = !props.preview

  return (
    <div
      role="group"
      aria-label="Design tools"
      className="flex flex-wrap items-center gap-1 border-b border-line bg-surface px-3 py-1.5"
    >
      <ToolButton
        label={props.libraryOpen ? 'Hide library' : 'Show library'}
        icon={props.libraryOpen ? CaretDoubleLeftIcon : CaretDoubleRightIcon}
        onClick={props.onToggleLibrary}
      />
      <Divider />
      <div
        role="group"
        aria-label="Card side"
        className="flex rounded-md border border-control p-0.5"
      >
        {CARD_SIDES.map((side) => (
          <button
            key={side}
            type="button"
            aria-pressed={props.side === side}
            onClick={() => props.onSideChange(side)}
            className={cn(
              'h-7 cursor-pointer rounded-sm px-3 text-sm font-semibold capitalize',
              props.side === side ? 'bg-primary text-surface' : 'text-ink hover:bg-primary/5',
            )}
          >
            {side}
          </button>
        ))}
      </div>
      <Divider />
      <ToolButton label="Add text" icon={TextTIcon} onClick={props.onAddText} disabled={!editing} />
      <ToolButton
        label="Add rectangle"
        icon={SquareIcon}
        onClick={props.onAddRect}
        disabled={!editing}
      />
      <ToolButton
        label="Add circle"
        icon={CircleIcon}
        onClick={props.onAddEllipse}
        disabled={!editing}
      />
      <ToolButton label="Add line" icon={MinusIcon} onClick={props.onAddLine} disabled={!editing} />
      <ImagePicker onPick={props.onAddImage}>
        {(openPicker) => (
          <ToolButton
            label="Upload image"
            icon={ImageIcon}
            onClick={openPicker}
            disabled={!editing}
          />
        )}
      </ImagePicker>
      <Divider />
      <ToolButton
        label="Undo (Ctrl+Z)"
        icon={ArrowCounterClockwiseIcon}
        onClick={props.onUndo}
        disabled={!editing || !props.canUndo}
      />
      <ToolButton
        label="Redo (Ctrl+Y)"
        icon={ArrowClockwiseIcon}
        onClick={props.onRedo}
        disabled={!editing || !props.canRedo}
      />
      <Divider />
      <ToolButton
        label="Bring forward"
        icon={ArrowUpIcon}
        onClick={props.onForward}
        disabled={!editing || !props.canForward}
      />
      <ToolButton
        label="Send backward"
        icon={ArrowDownIcon}
        onClick={props.onBackward}
        disabled={!editing || !props.canBackward}
      />
      <ToolButton
        label="Duplicate (Ctrl+D)"
        icon={CopyIcon}
        onClick={props.onDuplicate}
        disabled={!editing || !props.hasSelection}
      />
      <ToolButton
        label="Delete (Del)"
        icon={TrashIcon}
        onClick={props.onDelete}
        disabled={!editing || !props.hasSelection}
      />
      <Divider />
      <Button
        variant={props.preview ? 'primary' : 'secondary'}
        size="sm"
        aria-pressed={props.preview}
        onClick={() => props.onPreviewChange(!props.preview)}
      >
        {props.preview ? (
          <EyeSlashIcon className="size-4" aria-hidden="true" />
        ) : (
          <EyeIcon className="size-4" aria-hidden="true" />
        )}
        {props.preview ? 'Exit preview' : 'Preview'}
      </Button>

      <div className="ms-auto flex items-center gap-1">
        <ToolButton
          label="Zoom out"
          icon={MagnifyingGlassMinusIcon}
          onClick={props.onZoomOut}
          disabled={props.zoom <= ZOOM_MIN}
        />
        <span className="w-12 text-center text-sm text-ink-muted tabular-nums">
          {Math.round(props.zoom * 100)}%
        </span>
        <ToolButton
          label="Zoom in"
          icon={MagnifyingGlassPlusIcon}
          onClick={props.onZoomIn}
          disabled={props.zoom >= ZOOM_MAX}
        />
        <ToolButton label="Fit to screen" icon={CornersOutIcon} onClick={props.onFit} />
      </div>
    </div>
  )
}
