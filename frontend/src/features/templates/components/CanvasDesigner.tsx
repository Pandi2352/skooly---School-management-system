import { useReducer, useRef, useState } from 'react'
import { useBlocker, useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useDesignerShortcuts } from '../hooks/useDesignerShortcuts'
import { useSaveTemplate } from '../hooks/useTemplates'
import { templateDraftSchema } from '../schemas/template.schema'
import type {
  DesignElement,
  ElementChanges,
  RenderMode,
  TemplateDraft,
} from '../types/template.types'
import {
  createEllipseElement,
  createImageElement,
  createLineElement,
  createRectElement,
  createTextElement,
} from '../utils/designElements'
import { createEditorState, editorReducer, hasUnsavedChanges } from '../utils/designReducer'
import { fitZoom, zoomIn, zoomOut } from '../utils/templateDraft'
import { DesignCanvas } from './DesignCanvas'
import { DesignerLibrary } from './DesignerLibrary'
import { DesignerToolbar } from './DesignerToolbar'
import { DesignerTopBar } from './DesignerTopBar'
import { PropertiesPanel } from './PropertiesPanel'

type CanvasDesignerProps = {
  initialDraft: TemplateDraft
  /** The saved custom design being edited, or null for a new design (blank or from a starter). */
  templateId: string | null
}

// Space the library, properties panel and bars take up, for the first "fit to screen".
const PANELS_WIDTH = 720
const BARS_HEIGHT = 260

export function CanvasDesigner({ initialDraft, templateId }: CanvasDesignerProps) {
  const [state, dispatch] = useReducer(editorReducer, initialDraft, createEditorState)
  const [mode, setMode] = useState<RenderMode>('design')
  const [libraryOpen, setLibraryOpen] = useState(true)
  const [uploads, setUploads] = useState<string[]>([])
  const [zoom, setZoom] = useState(() =>
    fitZoom(initialDraft, {
      width: window.innerWidth - PANELS_WIDTH,
      height: window.innerHeight - BARS_HEIGHT,
    }),
  )
  const areaRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const saveTemplate = useSaveTemplate()

  const { design, selectedId } = state
  const side = design[state.side]
  const card = { widthMm: design.widthMm, heightMm: design.heightMm }
  const selectedIndex = side.elements.findIndex((element) => element.id === selectedId)
  const selected = side.elements[selectedIndex] ?? null
  const isDirty = hasUnsavedChanges(state)

  // Leaving for another page with unsaved changes asks first; saving (same page) doesn't.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  )
  useDesignerShortcuts({ dispatch, selectedId, enabled: mode === 'design' })

  const add = (element: DesignElement) => dispatch({ type: 'add', element })
  const change = (id: string, changes: ElementChanges) => dispatch({ type: 'update', id, changes })
  const upload = (src: string) => {
    setUploads((current) => [src, ...current])
    add(createImageElement(card, { name: 'Uploaded image', src, field: null }))
  }

  const fit = () => {
    const area = areaRef.current
    if (!area) return
    setZoom(fitZoom(card, { width: area.clientWidth - 80, height: area.clientHeight - 100 }))
  }

  const save = async () => {
    const parsed = templateDraftSchema.safeParse(design)
    if (!parsed.success) {
      toast({
        tone: 'error',
        title: 'Couldn’t save the design',
        description: parsed.error.issues[0]?.message ?? 'Check the design and try again.',
      })
      return
    }
    try {
      const saved = await saveTemplate.mutateAsync({ id: templateId, draft: parsed.data })
      dispatch({ type: 'markSaved', design })
      toast({
        title: 'Design saved',
        description: `“${saved.name}” is in the Template Gallery. Sample data: it resets when the page reloads.`,
      })
      if (saved.id !== templateId) void navigate(paths.canvasDesigner(saved.id), { replace: true })
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Couldn’t save the design',
        description: getErrorMessage(error),
      })
    }
  }

  const withSelected = (run: (id: string) => void) => () => {
    if (selected) run(selected.id)
  }

  return (
    // Fills the content area edge to edge: the negative margins undo <main>'s desktop padding.
    <div className="-mx-5 -mt-6 -mb-10 flex h-[calc(100dvh-var(--spacing-navbar))] min-h-[36rem] flex-col">
      <title>{`${design.name.trim() || 'Untitled design'} · Canvas Designer · Skooly`}</title>
      <h1 className="sr-only">Canvas Designer</h1>
      <DesignerTopBar
        name={design.name}
        onRename={(name) => dispatch({ type: 'rename', name })}
        audience={design.audience}
        onAudienceChange={(audience) => dispatch({ type: 'setAudience', audience })}
        sizeId={design.sizeId}
        widthMm={design.widthMm}
        heightMm={design.heightMm}
        onSizeChange={(sizeId, widthMm, heightMm) =>
          dispatch({ type: 'setSize', sizeId, widthMm, heightMm })
        }
        isDirty={isDirty}
        saving={saveTemplate.isPending}
        onSave={() => void save()}
      />

      <div className="flex min-h-0 flex-1">
        {libraryOpen && (
          <DesignerLibrary
            card={card}
            audience={design.audience}
            uploads={uploads}
            onAdd={add}
            onApplyLayout={(elements) => dispatch({ type: 'replaceElements', elements })}
            onUpload={upload}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <DesignerToolbar
            libraryOpen={libraryOpen}
            onToggleLibrary={() => setLibraryOpen((open) => !open)}
            side={state.side}
            onSideChange={(nextSide) => dispatch({ type: 'switchSide', side: nextSide })}
            onAddText={() => add(createTextElement(card, { text: 'Text', name: 'Text' }))}
            onAddRect={() => add(createRectElement(card, { rounded: false }))}
            onAddEllipse={() => add(createEllipseElement(card))}
            onAddLine={() => add(createLineElement(card))}
            onAddImage={upload}
            canUndo={state.past.length > 0}
            canRedo={state.future.length > 0}
            onUndo={() => dispatch({ type: 'undo' })}
            onRedo={() => dispatch({ type: 'redo' })}
            hasSelection={selected !== null}
            canForward={selectedIndex >= 0 && selectedIndex < side.elements.length - 1}
            canBackward={selectedIndex > 0}
            onForward={withSelected((id) =>
              dispatch({ type: 'reorder', id, direction: 'forward' }),
            )}
            onBackward={withSelected((id) =>
              dispatch({ type: 'reorder', id, direction: 'backward' }),
            )}
            onDuplicate={withSelected((id) =>
              dispatch({ type: 'duplicate', id, newId: crypto.randomUUID() }),
            )}
            onDelete={withSelected((id) => dispatch({ type: 'remove', id }))}
            preview={mode === 'preview'}
            onPreviewChange={(preview) => setMode(preview ? 'preview' : 'design')}
            zoom={zoom}
            onZoomIn={() => setZoom(zoomIn)}
            onZoomOut={() => setZoom(zoomOut)}
            onFit={fit}
          />
          <DesignCanvas
            side={side}
            widthMm={design.widthMm}
            heightMm={design.heightMm}
            zoom={zoom}
            mode={mode}
            selectedId={selectedId}
            onSelect={(id) => dispatch({ type: 'select', id })}
            onChange={change}
            areaRef={areaRef}
          />
        </div>

        <PropertiesPanel
          background={side.background}
          onBackgroundChange={(color) => dispatch({ type: 'setBackground', color })}
          selected={mode === 'design' ? selected : null}
          audience={design.audience}
          onChange={(changes) => {
            if (selected) change(selected.id, changes)
          }}
          onDuplicate={withSelected((id) =>
            dispatch({ type: 'duplicate', id, newId: crypto.randomUUID() }),
          )}
          onDelete={withSelected((id) => dispatch({ type: 'remove', id }))}
          elements={side.elements}
          selectedId={selectedId}
          onSelect={(id) => dispatch({ type: 'select', id })}
          onReorder={(id, direction) => dispatch({ type: 'reorder', id, direction })}
        />
      </div>

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        onOpenChange={(open) => {
          if (!open && blocker.state === 'blocked') blocker.reset()
        }}
        title="Leave without saving?"
        description="Changes to this design since you last saved will be lost."
        confirmLabel="Leave without saving"
        onConfirm={() => {
          if (blocker.state === 'blocked') blocker.proceed()
        }}
      />
    </div>
  )
}
