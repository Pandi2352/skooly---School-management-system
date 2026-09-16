import { Link } from 'react-router-dom'

export type BreadcrumbItem = { label: string; to?: string }

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.9375rem]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li
              key={`${item.label}-${index}`}
              className="not-first:before:me-1.5 not-first:before:text-ink-muted not-first:before:content-['/']"
            >
              {isLast ? (
                <span aria-current="page" className="font-semibold">
                  {item.label}
                </span>
              ) : item.to ? (
                <Link to={item.to} className="text-ink-muted hover:text-ink hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink-muted">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
