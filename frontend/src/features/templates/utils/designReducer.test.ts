import { describe, expect, it } from 'vitest'
import { makeRect, makeText } from './designElements'
import {
  createEditorState,
  editorReducer,
  hasUnsavedChanges,
  type EditorState,
} from './designReducer'
import { createBlankDraft } from './templateDraft'

const text = makeText({ name: 'Title', x: 2, y: 2, width: 30, text: 'Hello', fontSize: 3 })
const box = makeRect({ name: 'Box', x: 5, y: 5, width: 10, height: 10 })

const withElements = (): EditorState => {
  let state = createEditorState(createBlankDraft('cr80-portrait'))
  state = editorReducer(state, { type: 'add', element: text })
  return editorReducer(state, { type: 'add', element: box })
}

describe('editorReducer', () => {
  it('adds and selects an element, then undoes and redoes it', () => {
    let state = createEditorState(createBlankDraft('cr80-portrait'))
    state = editorReducer(state, { type: 'add', element: text })
    expect(state.design.front.elements).toHaveLength(1)
    expect(state.selectedId).toBe(text.id)
    expect(hasUnsavedChanges(state)).toBe(true)

    state = editorReducer(state, { type: 'undo' })
    expect(state.design.front.elements).toHaveLength(0)
    expect(state.selectedId).toBeNull()
    expect(hasUnsavedChanges(state)).toBe(false)

    state = editorReducer(state, { type: 'redo' })
    expect(state.design.front.elements).toHaveLength(1)
  })

  it('updates, nudges and keeps sizes above the minimum', () => {
    let state = withElements()
    state = editorReducer(state, {
      type: 'update',
      id: box.id,
      changes: { width: 0, fill: '#000000' },
    })
    state = editorReducer(state, { type: 'nudge', id: box.id, dx: 1, dy: -5 })
    const updated = state.design.front.elements.find((element) => element.id === box.id)
    expect(updated).toMatchObject({ width: 0.2, x: 6, y: 0, fill: '#000000' })
  })

  it('reorders within bounds and ignores moves past the ends', () => {
    let state = withElements()
    expect(editorReducer(state, { type: 'reorder', id: box.id, direction: 'forward' })).toBe(state)
    state = editorReducer(state, { type: 'reorder', id: box.id, direction: 'backward' })
    expect(state.design.front.elements.map((element) => element.name)).toEqual(['Box', 'Title'])
  })

  it('duplicates next to the original and removes with the selection cleared', () => {
    let state = withElements()
    state = editorReducer(state, { type: 'duplicate', id: text.id, newId: 'copy-1' })
    expect(state.design.front.elements.map((element) => element.name)).toEqual([
      'Title',
      'Title copy',
      'Box',
    ])
    expect(state.selectedId).toBe('copy-1')
    state = editorReducer(state, { type: 'remove', id: 'copy-1' })
    expect(state.selectedId).toBeNull()
    expect(state.design.front.elements).toHaveLength(2)
  })

  it('edits only the side being shown', () => {
    let state = withElements()
    state = editorReducer(state, { type: 'switchSide', side: 'back' })
    state = editorReducer(state, { type: 'setBackground', color: '#000000' })
    expect(state.design.back.background).toBe('#000000')
    expect(state.design.front.background).toBe('#ffffff')
    expect(state.design.back.elements).toHaveLength(0)
  })

  it('treats the saved design as clean', () => {
    let state = withElements()
    state = editorReducer(state, { type: 'markSaved', design: state.design })
    expect(hasUnsavedChanges(state)).toBe(false)
  })
})
