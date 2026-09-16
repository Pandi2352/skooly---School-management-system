import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge the DESIGN.md token names, so `text-ink` is read as a colour
// (not a font size) and `bg-canvas bg-surface` resolves to the later class.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'canvas',
        'surface',
        'ink',
        'ink-muted',
        'line',
        'control',
        'field',
        'primary',
        'danger',
        'danger-soft',
        'success',
        'success-soft',
        'table-head',
        'side',
        'side-ink',
        'side-muted',
        'side-hover',
        'side-active',
        'side-input',
        'side-input-line',
        'side-line',
        'accent',
        'status',
        'status-ink',
        'backdrop',
      ],
      spacing: ['sidebar', 'sidebar-collapsed', 'navbar'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
