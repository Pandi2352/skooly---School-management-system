import { useEffect, type Dispatch } from 'react'
import type { EditorAction } from '../utils/designReducer'

const NUDGES: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

// Shortcuts stay out of the way while typing in a field or using a menu or dialog.
const isBusyTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    target.closest(
      'input, textarea, select, [role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]',
    ) !== null)

type ShortcutOptions = {
  dispatch: Dispatch<EditorAction>
  selectedId: string | null
  enabled: boolean
}

/** Ctrl/Cmd+Z undo, Ctrl+Y or Ctrl+Shift+Z redo, Ctrl+D duplicate, Delete removes, arrows nudge 1 mm (Shift: 5 mm), Escape deselects. */
export function useDesignerShortcuts({ dispatch, selectedId, enabled }: ShortcutOptions) {
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isBusyTarget(event.target)) return
      const withModifier = event.ctrlKey || event.metaKey
      const key = event.key.toLowerCase()

      if (withModifier && (key === 'z' || key === 'y')) {
        event.preventDefault()
        dispatch(key === 'y' || event.shiftKey ? { type: 'redo' } : { type: 'undo' })
        return
      }
      if (selectedId === null) return

      if (withModifier && key === 'd') {
        event.preventDefault()
        dispatch({ type: 'duplicate', id: selectedId, newId: crypto.randomUUID() })
        return
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        dispatch({ type: 'remove', id: selectedId })
        return
      }
      if (event.key === 'Escape') {
        dispatch({ type: 'select', id: null })
        return
      }
      const nudge = NUDGES[event.key]
      if (!nudge || withModifier) return
      event.preventDefault()
      const step = event.shiftKey ? 5 : 1
      dispatch({ type: 'nudge', id: selectedId, dx: nudge[0] * step, dy: nudge[1] * step })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [dispatch, selectedId, enabled])
}
