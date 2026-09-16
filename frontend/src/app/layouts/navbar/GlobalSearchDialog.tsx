import { GraduationCapIcon, MagnifyingGlassIcon, SlidersIcon, XIcon } from '@phosphor-icons/react'
import { Dialog as RadixDialog } from 'radix-ui'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { sampleStudents } from '@/features/students/api/sample/sampleStudents'

type SearchItem = {
  id: string
  title: string
  subtitle: string
  category: 'Student' | 'Page' | 'Action'
  route: string
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'p-students',
    title: 'Student List',
    subtitle: 'View all enrolled students',
    category: 'Page',
    route: paths.students,
  },
  {
    id: 'p-admission',
    title: 'Student Admission',
    subtitle: 'Register and admit new students',
    category: 'Page',
    route: '/students/admission',
  },
  {
    id: 'p-fees',
    title: 'Fee Collection',
    subtitle: 'Collect and record fee payments',
    category: 'Page',
    route: '/fees-finance/fee-collection',
  },
  {
    id: 'p-attendance',
    title: 'Student Attendance',
    subtitle: 'Mark daily roll call',
    category: 'Page',
    route: '/students/student-attendance',
  },
  {
    id: 'p-exams',
    title: 'Examinations',
    subtitle: 'Online and term exams',
    category: 'Page',
    route: '/academic-management/online-exams',
  },
  {
    id: 'p-settings',
    title: 'General Settings',
    subtitle: 'System preferences and school config',
    category: 'Page',
    route: paths.settingsGeneral,
  },
]

type GlobalSearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery('')
    }
    onOpenChange(nextOpen)
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return STATIC_SEARCH_ITEMS

    const matchingStudents: SearchItem[] = sampleStudents
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          s.rollNo.includes(q),
      )
      .slice(0, 5)
      .map((s) => ({
        id: `s-${s.id}`,
        title: s.name,
        subtitle: `Class ${s.grade}-${s.section} · Adm: ${s.admissionNo}`,
        category: 'Student',
        route: paths.student(s.id),
      }))

    const matchingPages = STATIC_SEARCH_ITEMS.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q),
    )

    return [...matchingStudents, ...matchingPages]
  }, [query])

  const handleSelect = (route: string) => {
    setQuery('')
    onOpenChange(false)
    void navigate(route)
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-backdrop" />
        <RadixDialog.Content
          aria-describedby={undefined}
          className="fixed top-1/4 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 rounded-lg border border-line bg-surface p-0 text-ink shadow-2xl focus:outline-none"
        >
          <RadixDialog.Title className="sr-only">Global search</RadixDialog.Title>
          <div className="flex items-center border-b border-line px-4 py-3">
            <MagnifyingGlassIcon
              className="me-3 size-5 flex-none text-ink-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search students, classes, or pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-sm p-1 text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
              aria-label="Close search"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="p-6 text-center text-xs text-ink-muted">
                No results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <ul className="space-y-1">
                {results.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item.route)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 flex-none items-center justify-center rounded-md bg-canvas text-ink-muted">
                          {item.category === 'Student' ? (
                            <GraduationCapIcon className="size-4 text-primary" aria-hidden="true" />
                          ) : (
                            <SlidersIcon className="size-4 text-ink-muted" aria-hidden="true" />
                          )}
                        </span>
                        <div>
                          <p className="leading-tight font-semibold text-ink">{item.title}</p>
                          <p className="text-xs text-ink-muted">{item.subtitle}</p>
                        </div>
                      </div>
                      <span className="rounded bg-line/60 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-ink-muted uppercase">
                        {item.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-line bg-canvas/40 px-4 py-2 text-[11px] text-ink-muted">
            <span>
              Press <kbd className="rounded border border-line bg-surface px-1 py-0.5">Esc</kbd> to
              close
            </span>
            <span>
              Tip: <kbd className="rounded border border-line bg-surface px-1 py-0.5">Ctrl</kbd> +{' '}
              <kbd className="rounded border border-line bg-surface px-1 py-0.5">K</kbd> anywhere
            </span>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
