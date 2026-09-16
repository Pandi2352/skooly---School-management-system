import { HISTORY_LIMIT, MIN_ELEMENT_MM } from '../constants'
import type {
  CardSide,
  CardSideName,
  DesignElement,
  ElementChanges,
  SizeId,
  TemplateAudience,
  TemplateDraft,
} from '../types/template.types'
import { roundMm } from './designElements'

export type EditorState = {
  design: TemplateDraft
  /** The design as last opened or saved; there are unsaved changes when `design` is a different object. */
  saved: TemplateDraft
  side: CardSideName
  selectedId: string | null
  past: TemplateDraft[]
  future: TemplateDraft[]
}

export type EditorAction =
  | { type: 'markSaved'; design: TemplateDraft }
  | { type: 'rename'; name: string }
  | { type: 'setAudience'; audience: TemplateAudience }
  | { type: 'setSize'; sizeId: SizeId; widthMm: number; heightMm: number }
  | { type: 'setBackground'; color: string }
  | { type: 'switchSide'; side: CardSideName }
  | { type: 'select'; id: string | null }
  | { type: 'add'; element: DesignElement }
  | { type: 'replaceElements'; elements: DesignElement[] }
  | { type: 'update'; id: string; changes: ElementChanges }
  | { type: 'nudge'; id: string; dx: number; dy: number }
  | { type: 'remove'; id: string }
  | { type: 'duplicate'; id: string; newId: string }
  | { type: 'reorder'; id: string; direction: 'forward' | 'backward' }
  | { type: 'undo' }
  | { type: 'redo' }

export const createEditorState = (design: TemplateDraft): EditorState => ({
  design,
  saved: design,
  side: 'front',
  selectedId: null,
  past: [],
  future: [],
})

export const hasUnsavedChanges = (state: EditorState) => state.design !== state.saved

export function applyChanges(element: DesignElement, changes: ElementChanges): DesignElement {
  const next = { ...element, ...changes }
  return {
    ...next,
    width: Math.max(MIN_ELEMENT_MM, next.width),
    height: Math.max(MIN_ELEMENT_MM, next.height),
  }
}

const commit = (
  state: EditorState,
  design: TemplateDraft,
  selectedId: string | null = state.selectedId,
): EditorState => ({
  ...state,
  design,
  selectedId,
  past: [...state.past, state.design].slice(-HISTORY_LIMIT),
  future: [],
})

const updateSide = (
  design: TemplateDraft,
  side: CardSideName,
  update: (current: CardSide) => CardSide,
): TemplateDraft =>
  side === 'front'
    ? { ...design, front: update(design.front) }
    : { ...design, back: update(design.back) }

const updateElements = (
  state: EditorState,
  update: (elements: DesignElement[]) => DesignElement[],
) =>
  updateSide(state.design, state.side, (current) => ({
    ...current,
    elements: update(current.elements),
  }))

const keepSelection = (design: TemplateDraft, side: CardSideName, id: string | null) =>
  id !== null && design[side].elements.some((element) => element.id === id) ? id : null

/** Every design change goes through here, so undo and redo cover all of them. */
export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'markSaved':
      return { ...state, saved: action.design }
    case 'rename':
      // Typing a name isn't an undo step.
      return { ...state, design: { ...state.design, name: action.name } }
    case 'setAudience':
      return commit(state, { ...state.design, audience: action.audience })
    case 'setSize':
      return commit(state, {
        ...state.design,
        sizeId: action.sizeId,
        widthMm: action.widthMm,
        heightMm: action.heightMm,
      })
    case 'setBackground':
      return commit(
        state,
        updateSide(state.design, state.side, (current) => ({
          ...current,
          background: action.color,
        })),
      )
    case 'switchSide':
      return { ...state, side: action.side, selectedId: null }
    case 'select':
      return { ...state, selectedId: action.id }
    case 'add':
      return commit(
        state,
        updateElements(state, (elements) => [...elements, action.element]),
        action.element.id,
      )
    case 'replaceElements':
      return commit(
        state,
        updateElements(state, () => action.elements),
        null,
      )
    case 'update':
      return commit(
        state,
        updateElements(state, (elements) =>
          elements.map((element) =>
            element.id === action.id ? applyChanges(element, action.changes) : element,
          ),
        ),
      )
    case 'nudge':
      return commit(
        state,
        updateElements(state, (elements) =>
          elements.map((element) =>
            element.id === action.id
              ? { ...element, x: roundMm(element.x + action.dx), y: roundMm(element.y + action.dy) }
              : element,
          ),
        ),
      )
    case 'remove':
      return commit(
        state,
        updateElements(state, (elements) => elements.filter((element) => element.id !== action.id)),
        state.selectedId === action.id ? null : state.selectedId,
      )
    case 'duplicate': {
      const elements = state.design[state.side].elements
      const index = elements.findIndex((element) => element.id === action.id)
      const source = elements[index]
      if (!source) return state
      const copy: DesignElement = {
        ...source,
        id: action.newId,
        name: `${source.name} copy`,
        x: roundMm(source.x + 2),
        y: roundMm(source.y + 2),
      }
      return commit(
        state,
        updateElements(state, (current) => [
          ...current.slice(0, index + 1),
          copy,
          ...current.slice(index + 1),
        ]),
        copy.id,
      )
    }
    case 'reorder': {
      const elements = [...state.design[state.side].elements]
      const index = elements.findIndex((element) => element.id === action.id)
      const target = action.direction === 'forward' ? index + 1 : index - 1
      const moved = elements[index]
      if (!moved || target < 0 || target >= elements.length) return state
      elements.splice(index, 1)
      elements.splice(target, 0, moved)
      return commit(
        state,
        updateElements(state, () => elements),
      )
    }
    case 'undo': {
      const previous = state.past[state.past.length - 1]
      if (!previous) return state
      return {
        ...state,
        design: previous,
        past: state.past.slice(0, -1),
        future: [state.design, ...state.future],
        selectedId: keepSelection(previous, state.side, state.selectedId),
      }
    }
    case 'redo': {
      const [next, ...rest] = state.future
      if (!next) return state
      return {
        ...state,
        design: next,
        past: [...state.past, state.design].slice(-HISTORY_LIMIT),
        future: rest,
        selectedId: keepSelection(next, state.side, state.selectedId),
      }
    }
  }
}
