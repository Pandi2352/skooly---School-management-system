import {
  CopyIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextItalicIcon,
  TrashIcon,
  UploadSimpleIcon,
  type Icon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { NumberField } from '@/components/ui/NumberField'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { FONT_FAMILIES, TEXT_ALIGNS } from '../constants'
import type {
  DesignElement,
  DesignElementType,
  ElementChanges,
  FontStyle,
  TemplateAudience,
  TextAlign,
  TextElement,
} from '../types/template.types'
import { roundMm } from '../utils/designElements'
import { fieldToken, imageFieldLabel, schoolTextFields, textFieldsFor } from '../utils/fieldText'
import { isFontFamily } from '../utils/guards'
import { ColorField } from './ColorField'
import { ImagePicker } from './ImagePicker'
import { ToolButton } from './ToolButton'

const typeLabels: Record<DesignElementType, string> = {
  text: 'Text',
  rect: 'Rectangle',
  ellipse: 'Circle',
  line: 'Line',
  image: 'Image',
}

const alignIcons: Record<TextAlign, Icon> = {
  left: TextAlignLeftIcon,
  center: TextAlignCenterIcon,
  right: TextAlignRightIcon,
}

const fontOptions = FONT_FAMILIES.map((family) => ({ value: family, label: family }))

type Change = (changes: ElementChanges) => void

type ElementPropertiesProps = {
  element: DesignElement
  audience: TemplateAudience
  onChange: Change
  onDuplicate: () => void
  onDelete: () => void
}

export function ElementProperties({
  element,
  audience,
  onChange,
  onDuplicate,
  onDelete,
}: ElementPropertiesProps) {
  return (
    <section
      aria-labelledby="element-properties-heading"
      className="grid gap-4 border-b border-line p-4"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="element-properties-heading" className="text-sm font-bold text-ink">
          {typeLabels[element.type]}
        </h2>
        <span className="truncate text-xs text-ink-muted">{element.name}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="X (mm)"
          value={element.x}
          min={-500}
          max={500}
          step={0.5}
          onCommit={(x) => onChange({ x: roundMm(x) })}
        />
        <NumberField
          label="Y (mm)"
          value={element.y}
          min={-500}
          max={500}
          step={0.5}
          onCommit={(y) => onChange({ y: roundMm(y) })}
        />
        <NumberField
          label="Width (mm)"
          value={element.width}
          min={0.2}
          max={500}
          step={0.5}
          onCommit={(width) => onChange({ width: roundMm(width) })}
        />
        {element.type === 'line' ? (
          <NumberField
            label="Thickness (mm)"
            value={element.height}
            min={0.1}
            max={20}
            step={0.1}
            onCommit={(height) => onChange({ height: roundMm(height) })}
          />
        ) : (
          <NumberField
            label="Height (mm)"
            value={element.height}
            min={0.2}
            max={500}
            step={0.5}
            onCommit={(height) => onChange({ height: roundMm(height) })}
          />
        )}
        <NumberField
          label="Rotation (°)"
          value={element.rotation}
          min={-360}
          max={360}
          step={1}
          onCommit={(rotation) => onChange({ rotation: Math.round(rotation) })}
        />
      </div>

      {element.type === 'text' && (
        <TextProperties element={element} audience={audience} onChange={onChange} />
      )}
      {(element.type === 'rect' || element.type === 'ellipse') && (
        <div className="grid gap-3">
          <ColorField
            label="Fill"
            value={element.fill}
            allowNone
            onChange={(fill) => onChange({ fill })}
          />
          <ColorField
            label="Border colour"
            value={element.stroke}
            onChange={(stroke) => onChange({ stroke })}
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Border (mm)"
              value={element.strokeWidth}
              min={0}
              max={20}
              step={0.1}
              onCommit={(strokeWidth) => onChange({ strokeWidth: roundMm(strokeWidth) })}
            />
            {element.type === 'rect' && (
              <NumberField
                label="Corners (mm)"
                value={element.cornerRadius}
                min={0}
                max={100}
                step={0.5}
                onCommit={(cornerRadius) => onChange({ cornerRadius: roundMm(cornerRadius) })}
              />
            )}
          </div>
        </div>
      )}
      {element.type === 'line' && (
        <ColorField
          label="Colour"
          value={element.stroke}
          onChange={(stroke) => onChange({ stroke })}
        />
      )}
      {element.type === 'image' && (
        <div className="grid gap-3">
          <p className="text-sm text-ink-muted">
            {element.field
              ? `Placeholder for the ${imageFieldLabel(element.field)}. Upload an image to use a fixed picture instead.`
              : element.src
                ? 'Uploaded image.'
                : 'No image yet.'}
          </p>
          <ImagePicker onPick={(src) => onChange({ src, field: null })}>
            {(openPicker) => (
              <Button variant="secondary" size="sm" onClick={openPicker}>
                <UploadSimpleIcon className="size-4" aria-hidden="true" />
                {element.src ? 'Replace image' : 'Upload image'}
              </Button>
            )}
          </ImagePicker>
          <NumberField
            label="Corners (mm)"
            value={element.cornerRadius}
            min={0}
            max={100}
            step={0.5}
            onCommit={(cornerRadius) => onChange({ cornerRadius: roundMm(cornerRadius) })}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onDuplicate}>
          <CopyIcon className="size-4" aria-hidden="true" />
          Duplicate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-danger hover:text-danger"
          onClick={onDelete}
        >
          <TrashIcon className="size-4" aria-hidden="true" />
          Delete
        </Button>
      </div>
    </section>
  )
}

function fontStyleFor(bold: boolean, italic: boolean): FontStyle {
  if (bold && italic) return 'bold italic'
  if (bold) return 'bold'
  return italic ? 'italic' : 'normal'
}

function TextProperties({
  element,
  audience,
  onChange,
}: {
  element: TextElement
  audience: TemplateAudience
  onChange: Change
}) {
  const bold = element.fontStyle.includes('bold')
  const italic = element.fontStyle.includes('italic')
  const fieldOptions = [...textFieldsFor(audience), ...schoolTextFields].map((field) => ({
    value: field.key,
    label: field.label,
  }))

  return (
    <div className="grid gap-3">
      <Textarea
        label="Text"
        rows={3}
        value={element.text}
        hint="Fields show as [Field Name]; Preview shows sample values."
        onChange={(event) => onChange({ text: event.target.value })}
      />
      <Select
        label="Insert a field"
        size="sm"
        placeholder="Choose a field"
        options={fieldOptions}
        value=""
        onValueChange={(key) => onChange({ text: `${element.text}${fieldToken(key)}` })}
      />
      <Select
        label="Font"
        size="sm"
        options={fontOptions}
        value={element.fontFamily}
        onValueChange={(value) => {
          if (isFontFamily(value)) onChange({ fontFamily: value })
        }}
      />
      <div className="grid grid-cols-2 items-end gap-3">
        <NumberField
          label="Size (mm)"
          value={element.fontSize}
          min={0.5}
          max={60}
          step={0.1}
          onCommit={(fontSize) => onChange({ fontSize: roundMm(fontSize) })}
        />
        <div role="group" aria-label="Text style" className="flex h-10 items-center gap-1">
          <ToolButton
            label="Bold"
            icon={TextBIcon}
            pressed={bold}
            onClick={() => onChange({ fontStyle: fontStyleFor(!bold, italic) })}
          />
          <ToolButton
            label="Italic"
            icon={TextItalicIcon}
            pressed={italic}
            onClick={() => onChange({ fontStyle: fontStyleFor(bold, !italic) })}
          />
        </div>
      </div>
      <div role="group" aria-label="Text alignment" className="flex gap-1">
        {TEXT_ALIGNS.map((align) => (
          <ToolButton
            key={align}
            label={`Align ${align === 'center' ? 'centre' : align}`}
            icon={alignIcons[align]}
            pressed={element.align === align}
            onClick={() => onChange({ align })}
          />
        ))}
      </div>
      <ColorField
        label="Text colour"
        value={element.fill}
        onChange={(fill) => onChange({ fill })}
      />
    </div>
  )
}
