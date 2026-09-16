import { Tabs as RadixTabs } from 'radix-ui'
import type { ReactNode } from 'react'

export type TabItem = { value: string; label: ReactNode; content: ReactNode; disabled?: boolean }

type TabsProps = {
  /** Names the tab list for screen readers. */
  label: string
  items: TabItem[]
  /** Control `value` when the tab should live in the URL. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export function Tabs({ label, items, value, defaultValue, onValueChange }: TabsProps) {
  return (
    <RadixTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
    >
      <RadixTabs.List
        aria-label={label}
        className="flex gap-1 overflow-x-auto border-b border-line"
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="relative h-10 cursor-pointer px-3 text-sm whitespace-nowrap text-ink-muted hover:text-ink data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=active]:font-semibold data-[state=active]:text-ink data-[state=active]:after:absolute data-[state=active]:after:inset-x-3 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary pointer-coarse:h-11"
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="pt-4">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
