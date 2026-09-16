# School ERP (frontend)

The web app for running one school: admissions, students, academics, attendance, fees, staff, transport, hostel and more. Built with React, Vite, TypeScript and Tailwind CSS. The backend is planned as a NestJS API.

**Status:** the app shell (sidebar, navbar, themes, error pages) and the Students list are built. Every other module has a clearly labelled "Not built yet" page. The Students list runs on **labelled sample data** until the student API exists.

## Contents

- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Tech stack](#tech-stack)
- [Folder structure](#folder-structure)
- [How the code is organised](#how-the-code-is-organised)
- [Adding a feature](#adding-a-feature)
- [Environment variables](#environment-variables)
- [Project documents](#project-documents)

## Quick start

Requirements: **Node 20.19 or newer** (see `.nvmrc`) and npm.

```bash
# Frontend (React 19 + Vite)
npm run dev:frontend     # http://localhost:5173

# Backend (NestJS 11 + MongoDB)
npm run dev:backend      # http://localhost:3000 (Swagger: http://localhost:3000/api/docs)
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `npm run dev:frontend` | Start frontend Vite dev server with hot reload |
| `npm run dev:backend` | Start NestJS backend API with hot reload (`start:dev`) |
| `npm run build` | Build both frontend and backend for production |
| `npm run build:frontend` | Type-check and build frontend into `frontend/dist/` |
| `npm run build:backend` | Compile backend into `backend/dist/` |
| `npm run test` | Run test suites across frontend and backend |
| `npm run test:frontend` | Vitest test suite for frontend |
| `npm run test:backend` | Jest test suite for backend |
| `npm run typecheck` | Run TypeScript typechecks for frontend and backend |
| `npm run lint` | Run ESLint checks for frontend and backend |

## Tech stack

| Area | Choice |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Language | TypeScript 6, strict |
| Styling | Tailwind CSS 4, with design tokens from `DESIGN.md` (default palette disabled) |
| Routing | React Router DOM 7 (`react-router-dom`: data router, lazy pages) |
| Server state | TanStack Query 5 |
| Validation | Zod 4 (API responses, environment variables) |
| Accessible primitives | Radix UI |
| Icons | Phosphor |
| Tests | Vitest + Testing Library + jsdom |
| Quality | ESLint 10, Prettier |

## Folder structure

```
antislop-vite/
├── docs/                           Specifications, architecture, modules, and design guides
│   ├── BLUEPRINT.md                Master engineering standard
│   ├── DESIGN.md                   Visual system & Tailwind design tokens
│   ├── FRONTEND.md                 Frontend checklist and decisions
│   ├── modules.md                  Catalog of institutional modules
│   ├── project-plan.md             System architecture & technology strategy
│   └── mvp-plan.md                 Phased product roadmap
│
├── frontend/                       React 19 + Vite client application
│   ├── public/                     Static assets (images, campus background, icons)
│   ├── src/                        Component tree, features, routes, hooks, api
│   ├── index.html                  HTML template
│   ├── vite.config.ts              Vite 8 build and plugin configuration
│   └── package.json                Frontend dependencies & scripts
│
├── backend/                        NestJS 11 + MongoDB + TypeScript backend API
│   ├── src/
│   │   ├── common/                 UUID utilities, base Mongoose schemas (no ObjectIds)
│   │   ├── config/                 Dedicated CORS, Swagger (/api/docs), & Database configs
│   │   ├── database/               Async Mongoose database connection module
│   │   ├── modules/                Feature modules (students, etc.)
│   │   └── main.ts                 Application bootstrap
│   └── package.json                Backend dependencies & scripts
│
└── package.json                    Root monorepo workspace configuration & runner scripts
```

### `src/`

```
src/
├── main.tsx                        Entry point. Mounts <App /> and starts error logging. Nothing else
│
├── app/                            Wiring: the only layer that knows about every feature
│   ├── App.tsx                     <Providers> around the router
│   ├── Providers.tsx               Global providers: data fetching, theme, tooltips, toasts
│   ├── router.ts                   Creates the router from the route files
│   ├── paths.ts                    Every URL as a constant or builder. Links never hard-code paths
│   ├── routes/                     Route definitions, one file per area; every page loads on demand
│   │   ├── index.tsx               The tree: layout, error pages, "/" → "/dashboard", 404
│   │   ├── dashboard.ts
│   │   ├── students.ts
│   │   ├── settings.tsx
│   │   └── planned.ts              "Not built yet" pages for modules still to come
│   ├── layouts/
│   │   ├── AppLayout.tsx           Page frame: sidebar, navbar, main area, offline warning
│   │   ├── sidebar/                Collapsible sidebar: modules, their pages, settings link
│   │   └── navbar/                 Top bar: menu button, theme toggle, settings
│   └── theme/                      Light / dark / system theme, saved in the browser
│
├── features/                       One folder per business area. Each owns its UI, rules and data
│   ├── students/                   ★ Reference feature: copy this shape for new features
│   │   ├── api/                    Infrastructure: where student data comes from
│   │   │   ├── getStudents.ts      The only function that fetches students
│   │   │   ├── studentKeys.ts      Cache keys for TanStack Query
│   │   │   └── sample/             Labelled sample data + fake server logic (delete when the API exists)
│   │   ├── hooks/
│   │   │   ├── useStudents.ts      Loads a page of students (useQuery)
│   │   │   └── useStudentFilters.ts  Reads and writes status, search, sort and page in the URL
│   │   ├── components/             UI only: StudentFilters, StudentStatusTabs, StudentTable,
│   │   │                           StudentRowActions, StudentsEmptyState
│   │   ├── pages/
│   │   │   └── StudentListPage.tsx Composes the hooks and components. No logic of its own
│   │   ├── schemas/
│   │   │   └── student.schema.ts   Zod: the shape the student API must return
│   │   ├── utils/
│   │   │   └── studentStatus.ts    Pure business rules (e.g. which fees need follow-up)
│   │   ├── types/
│   │   │   └── student.types.ts    Domain types, generated from the schemas
│   │   └── constants.ts            Status values, sort options, page size
│   ├── dashboard/                  Dashboard page (module overview until real figures exist)
│   └── settings/                   Settings pages (theme preference)
│
├── components/                     Shared UI that knows nothing about students, fees or staff
│   ├── ui/                         Primitives: Button, IconButton, Input, Textarea, Select, Checkbox,
│   │                               RadioGroup, Switch, Dialog, ConfirmDialog, Drawer, Dropdown,
│   │                               Popover, Tooltip, Tabs, Badge, Avatar, Alert, Card, Table,
│   │                               Pagination, Breadcrumb, Spinner, Skeleton, Toast
│   └── page/                       Page-level pieces: PageContainer, LoadingState, EmptyState,
│                                   ErrorState, LinkList
│
├── pages/                          App-wide pages that belong to no feature
│   ├── NotFoundPage.tsx            404
│   ├── RouteErrorPage.tsx          Shown when a page fails; logs the error, offers reload
│   ├── PlannedModulePage.tsx       "Not built yet" module overview
│   └── PlannedFeaturePage.tsx      "Not built yet" feature page listing what it will contain
│
├── config/
│   ├── navigation.ts               All modules and pages: drives the sidebar and placeholder routes
│   ├── moduleIcons.ts              Icon for each module
│   └── env.ts                      The only reader of environment variables, validated with Zod
│
├── hooks/                          Shared hooks: useMediaQuery, useTheme, useToast, useLocalStorage,
│                                   useDisclosure, useDebounce, useOnlineStatus
│
├── lib/                            Plain helpers with no React, each with a test where it has logic
│   ├── api/
│   │   ├── client.ts               The only place that calls fetch; validates every response
│   │   ├── ApiError.ts             One error shape for every failed request
│   │   └── getErrorMessage.ts      Turns any error into a plain message for users
│   ├── query/queryClient.ts        TanStack Query defaults (cache time, retries)
│   ├── logger.ts                   The only place that writes to the console
│   ├── cn.ts                       Combines Tailwind classes safely
│   ├── format.ts                   Dates (India time), numbers, money (paise → ₹)
│   ├── storage.ts, storageKeys.ts  Safe localStorage access and its keys
│   ├── pagination.ts               Page numbers with gaps for the Pagination component
│   ├── assert.ts                   invariant() and assertNever()
│   └── getInitials.ts, slugify.ts
│
├── styles/index.css                Tailwind import and design tokens only. No hand-written CSS
├── types/env.d.ts                  Types for VITE_ environment variables
└── test/
    ├── setup.ts                    Test matchers and browser API stubs
    └── render.tsx                  Renders a component with router and query providers
```

## How the code is organised

**Three kinds of code stay apart.**

| Kind | Does | Lives in |
|---|---|---|
| UI | Renders props and raises events | `features/*/components`, `components/` |
| Business logic | Pure rules and calculations | `features/*/utils`, `lib/` |
| Infrastructure | Talks to the API, URL, storage or browser | `features/*/api`, `features/*/hooks`, `lib/` |

**Pages only compose.** A page reads filters from a hook, gets data from a query hook, and passes both to components:

```tsx
export function StudentListPage() {
  const { filters, update } = useStudentFilters()       // URL state
  const search = useDebounce(filters.search, 300)
  const students = useStudents({ ...filters, search })  // server state

  return (
    <PageContainer title="Students">
      <StudentFilters search={filters.search} sort={filters.sort} … />
      <StudentTable students={students.data?.rows ?? []} isLoading={students.isPending} … />
    </PageContainer>
  )
}
```

**Where data lives.**

| Data | Home |
|---|---|
| Anything from the API | TanStack Query hook in `features/*/hooks` |
| Filters, sort, tab, page | The URL (`?status=pending&page=2`) |
| One component's UI state | `useState` |
| Theme, sidebar collapsed | Context / `localStorage` |
| Anything that can be calculated | Calculated, never stored |

**Dependency direction.** `app` → `features` → `components` → `lib` / `hooks` / `config`. Shared code never imports feature code, and features don't import each other's internals.

**Other rules.**
- No `any`. API data is validated with Zod, never trusted with `as`.
- Every data view handles loading, empty, error and refreshing states.
- No invented data: real data, or a placeholder that is visibly labelled.
- Styling uses Tailwind classes and `DESIGN.md` tokens only.

Details: `BLUEPRINT.md` (the general standard) and the `code-layers` skill.

## Adding a feature

Follow `src/features/students`:

1. Add constants and a Zod schema, then derive the types from it.
2. Add an API function in `api/`, query keys, and a `useQuery` hook in `hooks/`.
3. Put business rules in `utils/`, with tests.
4. Build UI components in `components/` that take data and callbacks as props.
5. Compose them in `pages/<Thing>ListPage.tsx`.
6. Add a route file in `src/app/routes/`, a path in `src/app/paths.ts`, and set `route` on the feature's entry in `src/config/navigation.ts` so the sidebar links to it.
7. Run `npm run check`, click through in the browser, and update `FRONTEND.md`.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_API_URL` | Not until the first API call | Base URL of the NestJS API, e.g. `http://localhost:3000/api` |

Everything prefixed `VITE_` ends up in the browser bundle. **Never put secrets in `.env`.**

## Project documents

| File | Read it when |
|---|---|
| `FRONTEND.md` | You need this project's decisions, open questions or what's built |
| `DESIGN.md` | You touch anything visual |
| `BLUEPRINT.md` | You want the reasoning behind the architecture, or you're starting another project |
| `CLAUDE.md` / `AGENTS.md` | You work with an AI coding agent in this repo |
