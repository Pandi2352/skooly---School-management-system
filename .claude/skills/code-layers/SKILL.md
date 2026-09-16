---
name: code-layers
description: Keep UI, business logic and infrastructure apart in this React app. Use when adding or changing a page, component, hook, API call, filter, sort, form, data transformation or status rule, and when reviewing where code belongs. Load before writing feature code.
---

# code-layers

Every piece of frontend code is one of three kinds. Keep them in separate files.

| Kind | What it does | Example | Lives in |
|---|---|---|---|
| **UI** | Renders props, raises events | `<StudentTable students={…} />` | `features/<feature>/components/`, `components/ui/`, `components/page/` |
| **Business logic** | Pure rules and calculations about the domain | `feeNeedsAttention(status)`, `formatClassSection(student)` | `features/<feature>/utils/`, `lib/` |
| **Infrastructure** | Talks to the outside world: API, storage, URL, browser | `getStudents(filters)`, `useStudents`, `useStudentFilters` | `features/<feature>/api/`, `features/<feature>/hooks/`, `lib/` |

**Pages compose.** A page reads filters from a hook, gets data from a query hook, and passes both into components. It contains no fetching, filtering, sorting or rules.

The reference implementation is `src/features/students/`. Copy its shape for every new feature.

## Rules

1. **Components never call the network.** No `fetch`, `api.get`, `axios` or `useEffect`-to-load-data in a component or page.
2. **Server data goes through TanStack Query.**
   - The API function goes in `api/getThings.ts`. It's the only place that knows the endpoint (or the labelled sample source).
   - Query keys go in `api/thingKeys.ts` as a factory.
   - The hook goes in `hooks/useThings.ts` and wraps `useQuery` / `useMutation`.
3. **List filters, sort, tab and page live in the URL** via a `useThingFilters` hook built on `useSearchParams`. Invalid values from the URL fall back to defaults through type guards.
4. **Business rules are pure functions** in `utils/`, with a unit test next to them. JSX calls `feeNeedsAttention(s.feeStatus)`; it doesn't repeat `s.feeStatus !== 'paid' && …`.
5. **Don't store derived state.** Filtered lists, counts, totals and "can do X" are calculated, never copied into `useState`.
6. **Constants and literal unions come from one place.** Put `as const` arrays in `features/<feature>/constants.ts`, and derive the types from them in `types/<feature>.types.ts`.
7. **Presentation mappings stay in UI files.** Label and badge-tone maps (`feeLabels`, `feeTone`) live in the component that renders them, and call business rules for decisions.
8. **Errors shown to users go through `getErrorMessage(error)`** from `@/lib/api/getErrorMessage`.
11. **No API calls outside `features/<feature>/api/`.** One file per endpoint (`getStudents.ts`, `getStudent.ts`, `createStudent.ts`, `updateStudent.ts`), each calling the shared client in `@/lib/api/client`. Hooks in `hooks/` wrap them with `useQuery` / `useMutation`; mutations invalidate `<thing>Keys.lists()`.
12. **The app layer stays boring.** `main.tsx` only mounts `<App />`. `app/App.tsx` renders `<Providers>` + `<RouterProvider>`. `app/Providers.tsx` holds global providers, added only when something uses them. Routes live in `app/routes/`, one file per area (`students.ts`, `settings.tsx`), with lazy pages. URLs come from `app/paths.ts`.
9. **Components receive data and callbacks**, not hooks' internals: `students`, `isLoading`, `isRefreshing`, `error`, `onRetry`, `empty`.
10. **Every data view handles loading, refreshing, empty (including "no search match") and error states** (antislop R-27).

## Types

- **Strict compiler:** `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns` and `noFallthroughCasesInSwitch` stay on. Never loosen `tsconfig.app.json` to make an error go away.
- **No `any`.** Use `unknown` for data you haven't checked, then narrow it.
- **No `as` to claim a type** (`response as Student`). Allowed: `as const`, and narrowing that a type guard or schema already proved.
- **API data is validated with Zod at the boundary:** `API → schema.parse → typed data`.
  - The schema goes in `features/<feature>/schemas/<thing>.schema.ts`.
  - `api.get(path, schema)` in `@/lib/api/client` parses every response, so a mismatch surfaces as an error (`getErrorMessage` explains it) instead of wrong data on screen.
- **Types describe the domain and come from schemas.** `Student`, `FeeStatus`, `StudentPage` are `z.infer<typeof …>` in `types/<thing>.types.ts`. Client-only shapes (`StudentFilters`) are plain `type`s beside them.
- **Status values are literal unions** built from `as const` arrays in `constants.ts` (`z.enum(FEE_STATUSES)`), never loose `string`s.
- **No vague names:** no `Data`, `Item`, `Response`, `Result`, `Info`. Generic UI types say what they are: `SelectOption`, `TabItem`, `TableColumn<T>`.
- **Environment variables** are read and validated only in `src/config/env.ts`.

## Components

Four layers. A lower layer never imports a higher one.

```
components/ui          primitives, domain-free      Button, Input, Dialog, Table, Avatar
  ↓
components/page        reusable composites          PageContainer, EmptyState, ErrorState, LinkList
components/ui (composites such as ConfirmDialog)
  ↓
features/*/components  feature components           StudentTable, StudentFilters, StudentRowActions
  ↓
features/*/pages       pages, composition only      StudentListPage
```

- **`components/ui` knows nothing about students, fees or staff.** `StudentCard`, `FeeBadge` and `InvoiceRow` belong in their feature's `components/`.
- **Primitives available:** Button, IconButton, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Dialog, ConfirmDialog, Drawer, Dropdown, Popover, Tooltip, Tabs, Badge, Avatar, Alert, Card, Table, Pagination, Breadcrumb, Spinner, Skeleton, Toast. Reuse them before writing markup by hand, and add a new primitive only when a pattern repeats.
- **Split a component** when it takes on a second job, when a part repeats, or at roughly 200 lines. A list page becomes Page → Filters, StatusTabs, Table (+ columns), RowActions, EmptyState, Pagination.
- **Don't over-split.** No `StudentName.tsx` or `StudentPhone.tsx` for one line of markup with no behaviour or reuse.
- **Component API:** `variant`/`size`/`tone` props instead of boolean soup; native props passed through; `label` required on icon-only buttons; data and callbacks in, never hooks' internals.

## Feature layout

```
features/<feature>/
├── api/
│   ├── get<Things>.ts          infrastructure: the data source
│   ├── <thing>Keys.ts          query key factory
│   └── sample/                 labelled sample source + its test (delete when the API exists)
├── hooks/
│   ├── use<Things>.ts          useQuery wrapper
│   └── use<Thing>Filters.ts    URL state
├── components/                 UI only: tables, filters, tabs, row actions, empty states
├── pages/<Thing>ListPage.tsx   composition only
├── schemas/<thing>.schema.ts   Zod: the API contract (+ .test.ts)
├── utils/<thing>Status.ts      pure business rules (+ .test.ts)
├── types/<thing>.types.ts
└── constants.ts
```

## Bad and good

```tsx
// Bad: fetching, filtering and rendering in one component
function StudentPage() {
  const [students, setStudents] = useState<Student[]>([])
  useEffect(() => {
    fetch('/api/students').then((r) => r.json()).then(setStudents)
  }, [])
  const overdue = students.filter((s) => s.feeStatus !== 'paid' && s.enrollmentStatus !== 'left')
  return <table>{/* … */}</table>
}
```

```tsx
// Good: the page composes; each concern lives in its own layer
export function StudentListPage() {
  const { filters, update } = useStudentFilters()        // infrastructure: URL
  const search = useDebounce(filters.search, 300)
  const students = useStudents({ ...filters, search })   // infrastructure: server state

  return (
    <PageContainer title="Students">
      <StudentFilters search={filters.search} sort={filters.sort}
        onSearchChange={(value) => update({ search: value })}
        onSortChange={(sort) => update({ sort })} />
      <StudentTable                                       // UI
        students={students.data?.rows ?? []}
        isLoading={students.isPending}
        isRefreshing={students.isPlaceholderData}
        error={students.isError ? getErrorMessage(students.error) : undefined}
        onRetry={() => void students.refetch()}
        empty={<StudentsEmptyState searchTerm={search} onClearSearch={() => update({ search: '' })} />}
      />
    </PageContainer>
  )
}
```

Business rules such as `feeNeedsAttention` are called inside `StudentTable`, never re-implemented there.

## Before calling feature work done

- [ ] No network call, `useEffect` data loading or business condition inside a component or page
- [ ] API function, query keys and query hook exist for the data
- [ ] Filters, sort, tab and page are in the URL
- [ ] Rules extracted to `utils/` with tests; constants and types from one place
- [ ] Loading, refreshing, empty and error states handled
- [ ] `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run build` pass
- [ ] `FRONTEND.md` status updated

See `BLUEPRINT.md` sections 1, 8, 9 and 14 for the full reasoning.
