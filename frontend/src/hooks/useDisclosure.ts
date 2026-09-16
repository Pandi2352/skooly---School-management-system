import { useCallback, useState } from 'react'

/** Open/closed state for drawers, menus and dialogs. */
export function useDisclosure(initialOpen = false) {
  const [isOpen, setOpen] = useState(initialOpen)
  const open = useCallback(() => {
    setOpen(true)
  }, [])
  const close = useCallback(() => {
    setOpen(false)
  }, [])
  const toggle = useCallback(() => {
    setOpen((current) => !current)
  }, [])
  return { isOpen, open, close, toggle, setOpen }
}
