import { Link } from 'react-router-dom'

export type LinkListItem = { to: string; label: string; meta?: string }

/** A responsive list of links: one column on phones, more as width allows. */
export function LinkList({ items }: { items: LinkListItem[] }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-x-8">
      {items.map((item) => (
        <li key={`${item.to}-${item.label}`}>
          <Link
            to={item.to}
            className="group flex min-h-12 items-center justify-between gap-3 border-b border-line px-1 py-2.5 active:bg-line"
          >
            <span className="group-hover:text-primary group-hover:underline">{item.label}</span>
            {item.meta && <span className="flex-none text-sm text-ink-muted">{item.meta}</span>}
          </Link>
        </li>
      ))}
    </ul>
  )
}
