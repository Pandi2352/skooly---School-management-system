# BLUEPRINT.md: React + Vite + TypeScript + Tailwind production standard

A reusable engineering standard for every React SPA we build. Copy it into a new project on day one, then record project-specific choices in that project's `FRONTEND.md`.

- **Scope:** client-rendered apps (admin panels, ERPs, dashboards, internal tools, SaaS back offices) talking to an API such as NestJS.
- **Not for:** public marketing sites where SEO matters most. See [section 27](#27-seo-and-when-a-spa-is-the-wrong-choice).
- **Version:** 1.0, 2026-09-14.

## How the documents fit together

| File | Answers | Changes |
|---|---|---|
| `BLUEPRINT.md` (this file) | How we build any frontend: architecture, state, API, testing, delivery | Rarely; improve it when a project teaches something new |
| `FRONTEND.md` | What this project decided: stack versions, open decisions, status of each checklist item | Every feature |
| `DESIGN.md` | How this product looks: palette, type, spacing, dials | When the brand or direction changes |
| `CLAUDE.md` / `AGENTS.md` | What an AI agent must read and run before working | When the rules above change |

**When they disagree, the more specific file wins:** `FRONTEND.md` and `DESIGN.md` override this blueprint for their project. Write the reason down when you override it.

## Contents

1. [Core principles](#1-core-principles)
2. [The stack, and when to add each package](#2-the-stack-and-when-to-add-each-package)
3. [Starting a new project](#3-starting-a-new-project)
4. [Folder structure](#4-folder-structure)
5. [Naming conventions](#5-naming-conventions)
6. [Configuration files](#6-configuration-files)
7. [The app layer](#7-the-app-layer)
8. [State: where each piece of data lives](#8-state-where-each-piece-of-data-lives)
9. [API layer](#9-api-layer)
10. [Forms and validation](#10-forms-and-validation)
11. [Components](#11-components)
12. [Styling with Tailwind v4 and design tokens](#12-styling-with-tailwind-v4-and-design-tokens)
13. [Pages and UI states](#13-pages-and-ui-states)
14. [Tables, filters and pagination](#14-tables-filters-and-pagination)
15. [Authentication, permissions and security](#15-authentication-permissions-and-security)
16. [Error handling](#16-error-handling)
17. [Accessibility](#17-accessibility)
18. [Responsive and mobile](#18-responsive-and-mobile)
19. [React discipline: effects, memoisation, derived state](#19-react-discipline-effects-memoisation-derived-state)
20. [Performance](#20-performance)
21. [Dates, money and constants](#21-dates-money-and-constants)
22. [Testing](#22-testing)
23. [Tooling, scripts, hooks and CI](#23-tooling-scripts-hooks-and-ci)
24. [Git and pull requests](#24-git-and-pull-requests)
25. [Dependencies](#25-dependencies)
26. [Logging, monitoring, analytics, flags, i18n](#26-logging-monitoring-analytics-flags-i18n)
27. [SEO, and when a SPA is the wrong choice](#27-seo-and-when-a-spa-is-the-wrong-choice)
28. [Design quality with antislop](#28-design-quality-with-antislop)
29. [Definition of done](#29-definition-of-done)
30. [Code review checklist](#30-code-review-checklist)
31. [Anti-patterns](#31-anti-patterns)
32. [Templates: decision log, PR, kickoff](#32-templates-decision-log-pr-kickoff)
33. [Learning path](#33-learning-path)

---

## 1. Core principles

1. **Architecture before components.** Decide where code lives (features, shared UI, infrastructure) before writing screens.
2. **Separate three kinds of code.**

   | Kind | Example | Lives in |
   |---|---|---|
   | UI | `<StudentCard student={student} />` | `components/`, `features/*/components/` |
   | Business logic | `calculateFeeBalance(invoice)` | `features/*/utils/`, `lib/` |
   | Infrastructure | `api.get('/students')` | `features/*/api/`, `lib/api/` |

   A component that fetches, filters and renders at once is three files waiting to be split.
3. **Server state is not client state.** API data belongs to TanStack Query, not to Zustand or Context.
4. **If it can be calculated, calculate it.** Don't store derived values.
5. **Every async screen has loading, empty, error and success states.** Designing only the happy path isn't finished.
6. **Types describe the domain.** `Student`, `FeeStatus`, `Invoice`, not `Data`, `Item`, `Response`.
7. **Few dependencies, strong conventions.** Each package must justify its weight ([section 25](#25-dependencies)).
8. **Accessibility, responsiveness and i18n are part of the first version,** not "later".
9. **The frontend is not a security boundary.** The backend enforces every rule; the UI only reflects it.
10. **Measure before optimising, and verify before calling it done.** One command (`npm run check`) answers "can this merge?".

---

## 2. The stack, and when to add each package

Pin exact versions in each project's `FRONTEND.md`. Check the current release and its migration guide at setup; don't copy versions from old tutorials (or from this file).

### Always

| Package | Purpose | Notes |
|---|---|---|
| `react`, `react-dom` | UI | React 19+: `ref` is a normal prop, `<title>` renders into `<head>`, `use()` reads context |
| `vite` | Dev server and build | Vite 8 bundles with Rolldown |
| `typescript` | Types | Strict mode ([section 6](#tsconfigappjson)) |
| `tailwindcss`, `@tailwindcss/vite` | Styling | v4 is configured in CSS. No `tailwind.config.js` |
| `react-router-dom` | Routing | Our standard import package. In v7 it re-exports `react-router` (installed underneath it). Import everything, including `RouterProvider`, from `react-router-dom`, and block `react-router` / `react-router/dom` with ESLint `no-restricted-imports` so imports stay consistent |
| `clsx`, `tailwind-merge` | `cn()` helper | [Section 12](#the-cn-helper) |
| One icon set | Icons | Pick one and write down why. See [section 11](#icons) |
| `eslint`, `typescript-eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` | Correctness | Flat config (`eslint.config.js`) only |
| `prettier`, `prettier-plugin-tailwindcss` | Formatting | Sorts Tailwind classes |
| `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom` | Unit and component tests | |

### Add when a real need appears

| Package | Add when | Skip when |
|---|---|---|
| `@tanstack/react-query` | The first API call | The app has no server data |
| `zod` | The first form or the first untrusted API response | Never skip once either exists |
| `react-hook-form`, `@hookform/resolvers` | The first form with more than two fields or with validation | A single search box |
| Headless UI primitives (`radix-ui`, React Aria, Base UI) | The first dialog, dropdown, select, tooltip or tabs | You only need buttons and inputs |
| `zustand` | Client-only state is shared by distant components and Context would re-render too much | Theme, sidebar or one modal: Context or `useState` is enough |
| `@tanstack/react-table` | A table needs sorting, column visibility or row selection | A plain list with server pagination |
| `@tanstack/react-virtual` | A list renders more than a few hundred rows at once | Paginated lists |
| `msw` | Component or hook tests need a fake API | Pure function tests |
| `@playwright/test` | The first critical user flow (login, create record) | Prototypes |
| `husky`, `lint-staged` | The project is a git repository and the team agrees to hooks | No git yet; don't set up git without asking the owner |
| `storybook` | A shared component library is used by several people or projects | A single app with a handful of components |
| `axios` | You need interceptors or upload progress that a fetch wrapper would make awkward | Default: a small `fetch` wrapper |
| Date library (`date-fns`, `@date-fns/tz`) | Time-zone maths, recurring schedules, relative ranges | Formatting only: use `Intl.DateTimeFormat` |
| `react-error-boundary` | You need error boundaries outside the router's `errorElement` | Route-level errors only |
| Sentry (or equivalent) | Before the first production release | Local prototypes |
| i18n (`i18next`, `react-i18next`, or Lingui) | A second language is confirmed or likely | English only with no plan to translate. Still keep copy out of business logic |
| OpenAPI client generator (`openapi-typescript`, `orval`) | The backend publishes an OpenAPI spec | Hand-written types for a small API |

### Don't install by default

Redux, Moment.js, Lodash (use native methods), a CSS-in-JS library next to Tailwind, a second icon set, a UI kit that brings its own theme on top of Tailwind, jQuery-era plugins, polyfills for browsers you don't support.

"Professional" means clear architecture and few dependencies, not 100 packages.

---

## 3. Starting a new project

### 3.1 Create and install

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app

npm install react-router-dom clsx tailwind-merge
npm install tailwindcss @tailwindcss/vite

npm install -D prettier prettier-plugin-tailwindcss \
  vitest jsdom @testing-library/react @testing-library/dom \
  @testing-library/user-event @testing-library/jest-dom
```

Add the rest from [section 2](#2-the-stack-and-when-to-add-each-package) as real needs appear.

### 3.2 First hour checklist

- [ ] Configure `vite.config.ts`, `tsconfig.app.json`, `eslint.config.js` and `.prettierrc.json` ([section 6](#6-configuration-files))
- [ ] Add the `@/` import alias in both `tsconfig.app.json` and `vite.config.ts`
- [ ] Delete the Vite demo page, its CSS and its assets
- [ ] Create the folder structure ([section 4](#4-folder-structure))
- [ ] Create `src/styles/index.css` with design tokens ([section 12](#12-styling-with-tailwind-v4-and-design-tokens))
- [ ] Add `lib/cn.ts`, `lib/storage.ts`, `lib/assert.ts`, `config/env.ts`, `.env.example`
- [ ] Set up the router with a layout, a 404 page and a route error page ([section 7](#7-the-app-layer))
- [ ] Add the npm scripts ([section 23](#23-tooling-scripts-hooks-and-ci)) and make `npm run check` pass
- [ ] Write `DESIGN.md` with the product owner ([section 28](#28-design-quality-with-antislop))
- [ ] Write `FRONTEND.md`: stack versions, decisions, status tables
- [ ] Add `CLAUDE.md` / `AGENTS.md` pointing to all three documents
- [ ] Only if the owner asks: `git init`, hooks, CI

### 3.3 Decisions to make before building features

Write each answer into `FRONTEND.md`.

| Decision | Typical options |
|---|---|
| How does the API authenticate? | httpOnly session cookie (preferred for same-site apps), or access + refresh tokens |
| What does an API error look like? | e.g. NestJS `{ statusCode, message: string \| string[], error }` |
| How does pagination work? | `page` + `pageSize` + `total`, or `cursor` + `limit` |
| Which roles exist, and what does each see? | Menu per role, route guards, action visibility |
| Headless UI library | Radix, React Aria, Base UI |
| Icon set | One set, with a written reason |
| Locale, time zone, currency | e.g. `en-IN`, `Asia/Kolkata`, `INR` |
| Supported browsers | e.g. last 2 versions of Chrome, Edge, Safari, Firefox; Android WebView version |
| Light, dark or both | Both needs a working toggle, tested in each theme |

---

## 4. Folder structure

### 4.1 Why feature folders

A `components/ pages/ hooks/ utils/ api/` layout is tidy for a week. Once there are students, fees, attendance, staff, reports and settings, every change touches five folders and nobody knows what belongs to what. Feature folders keep each domain's UI, logic and API calls together.

### 4.2 The standard layout

```
src/
├── main.tsx                     Mounts <App />. Nothing else
│
├── app/                         Wiring: the only place that knows about everything
│   ├── App.tsx                  <Providers><RouterProvider /></Providers>
│   ├── Providers.tsx            Query client, theme, toasts, tooltips, auth
│   ├── router.ts                createBrowserRouter(routes)
│   ├── paths.ts                 Every URL as a constant or builder
│   ├── routes/                  One file per area, all pages lazy
│   │   ├── index.tsx            The tree: layouts, guards, error pages, 404
│   │   ├── auth.tsx             login, forgot-password
│   │   ├── dashboard.ts
│   │   ├── students.ts
│   │   └── settings.tsx
│   └── layouts/
│       ├── AppLayout.tsx        Sidebar + navbar + <Outlet />
│       └── AuthLayout.tsx       Centred layout for login pages
│
├── components/                  Shared, domain-free UI
│   ├── ui/                      Primitives: Button, Input, Dialog, Table...
│   ├── feedback/                LoadingState, EmptyState, ErrorState, Toast
│   ├── navigation/              Sidebar pieces, Breadcrumb, Pagination
│   ├── forms/                   FormField, FormError, form layout helpers
│   └── layout/                  PageContainer, Stack, Section
│
├── features/                    One folder per business domain
│   └── students/
│       ├── api/                 getStudents.ts, createStudent.ts, studentKeys.ts
│       ├── components/          StudentTable, StudentFilters, StudentForm
│       ├── hooks/               useStudents.ts, useCreateStudent.ts
│       ├── pages/               StudentListPage.tsx, StudentDetailPage.tsx
│       ├── schemas/             student.schema.ts (Zod)
│       ├── types/               student.types.ts
│       ├── utils/               Pure domain logic: canPromoteStudent.ts
│       └── index.ts             Public API for other features (optional, small)
│
├── hooks/                       Shared hooks: useMediaQuery, useDebounce, useDisclosure
├── lib/                         Infrastructure wrappers, no React
│   ├── api/                     client.ts, ApiError.ts
│   ├── query/                   queryClient.ts
│   ├── cn.ts
│   ├── storage.ts
│   ├── format.ts                Dates, numbers, currency via Intl
│   └── logger.ts
├── stores/                      Zustand stores, only if needed
├── config/                      env.ts, navigation.ts, feature flags
├── constants/                   Cross-feature constants, split by topic (never one giant file)
├── types/                       Cross-feature types (ApiError shape, Paginated<T>), env.d.ts
├── assets/                      Images, fonts, SVGs imported by code
├── styles/
│   └── index.css                Tailwind import and design tokens only
└── test/
    └── setup.ts                 Testing Library matchers, jsdom stubs

e2e/                             Playwright tests (outside src/)
public/                          Files served as-is (favicon, robots.txt)
```

Small projects can merge `feedback/`, `navigation/`, `forms/` and `layout/` into `components/page/` and `components/ui/`. Keep the split between shared and feature code either way.

### 4.3 Dependency direction

```
app  ──►  features  ──►  components  ──►  lib / hooks / config / types
                    ╲                  ╱
                     ──────────►──────
```

- Arrows point from the code that imports to the code that is imported.
- `components/`, `lib/` and `hooks/` never import from `features/` or `app/`.
- A feature never imports another feature's internals. Use its `index.ts`, or move the shared piece down to `components/`, `hooks/` or `lib/`.
- `app/` is the only place allowed to know every feature (routes, providers).

### 4.4 Feature boundary rules

- Code starts inside its feature. It moves to a shared folder when a **second** feature needs it, not before.
- A feature's `index.ts` exports only what other features may use (a hook, a small component, a type). Pages are imported by the router directly, so lazy loading keeps working.
- **No project-wide barrel files** (`export * from './everything'`). They hide where code lives, cause circular imports and can pull whole folders into a bundle.
- No `utils.ts`, `helpers.ts`, `types.ts` or `constants.ts` dumping grounds. Name files by what they hold: `formatCurrency.ts`, `feeStatus.ts`.

---

## 5. Naming conventions

Consistency matters more than the exact convention. This is ours.

| Kind | Style | Example |
|---|---|---|
| Component file and export | PascalCase, one component per file | `StudentTable.tsx` → `export function StudentTable` |
| Page | PascalCase + `Page` | `StudentListPage.tsx` |
| Hook | `use` + PascalCase | `useStudents.ts` |
| Pure function file | camelCase, named after the function | `formatCurrency.ts`, `canPromoteStudent.ts` |
| API function | verb + noun | `getStudents.ts`, `updateStudent.ts` |
| Query key factory | noun + `Keys` | `studentKeys.ts` |
| Zod schema | noun + `.schema.ts`, export `studentSchema` | `student.schema.ts` |
| Types | noun + `.types.ts` | `student.types.ts` |
| Test | next to the file, `.test.ts(x)` | `formatCurrency.test.ts` |
| E2E test | flow + `.spec.ts` in `e2e/` | `e2e/admission.spec.ts` |
| Types and props | `type`, PascalCase, props end in `Props` | `type StudentTableProps` |
| Union of string literals | PascalCase type | `type FeeStatus = 'paid' \| 'due' \| 'overdue'` |
| Constants object | UPPER_SNAKE or camelCase `as const` | `STORAGE_KEYS`, `paths` |
| Event props | `on` + verb | `onSelect`, `onOpenChange` |
| Boolean props | `is`, `has`, `can` or a plain adjective | `isOpen`, `disabled`, `canEdit` |
| Route params | camelCase + `Id` | `/students/:studentId` |
| URL search params | camelCase | `?page=2&status=enrolled&search=asha` |
| CSS tokens | kebab-case semantic names | `--color-primary`, `--color-danger` |

Files that export React components export **only** components (Fast Refresh requires it). Shared class-name helpers go in a separate file such as `buttonStyles.ts`.

---

## 6. Configuration files

### `vite.config.ts`

```ts
/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
```

### `tsconfig.app.json`

```jsonc
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "types": ["vite/client"],
    "jsx": "react-jsx",
    "noEmit": true,
    "skipLibCheck": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "paths": { "@/*": ["./src/*"] },

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"]
}
```

With project references (`tsconfig.json` referencing `tsconfig.app.json` and `tsconfig.node.json`), type-check with `tsc -b`. `tsc --noEmit` on the root config checks nothing.

### `eslint.config.js`

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      // `onClick={() => setOpen(true)}` is idiomatic React.
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
])
```

- Add `eslint-plugin-jsx-a11y` when it supports your ESLint major version. Don't force-install over a peer-dependency conflict.
- Add `eslint-config-prettier` only if a lint rule conflicts with formatting. The configs above don't enable formatting rules.
- CI fails on any lint error.

### `.prettierrc.json`

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/styles/index.css",
  "tailwindFunctions": ["cn"]
}
```

Semicolons or not is a team choice. Decide once, then let Prettier enforce it; don't discuss formatting in reviews.

### `.prettierignore`

```
dist
coverage
playwright-report
package-lock.json
```

### Environment files

| File | Committed | Holds |
|---|---|---|
| `.env.example` | Yes | Every variable name with a safe example value |
| `.env` | No | Local values |
| `.env.development`, `.env.production` | Only if they hold no secrets | Build-mode defaults |

**Everything prefixed `VITE_` is bundled into public JavaScript.** Never put API secrets, private keys or service tokens there. Secrets live on the server.

`src/types/env.d.ts`:

```ts
/* eslint-disable @typescript-eslint/consistent-type-definitions -- must merge with Vite's ImportMetaEnv */
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}
```

`src/config/env.ts` is the **only** file that reads `import.meta.env`:

```ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.url(),
})

const parsed = envSchema.safeParse(import.meta.env)
if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`)
}

export const env = {
  apiUrl: parsed.data.VITE_API_URL,
  isDev: import.meta.env.DEV,
} as const
```

---

## 7. The app layer

The entry point is boring on purpose. No business logic here.

### `main.tsx`

```tsx
import '@/styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { invariant } from '@/lib/assert'

const rootElement = document.getElementById('root')
invariant(rootElement, 'index.html is missing the #root element')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Use `invariant` instead of the `!` non-null assertion: it fails with a clear message and passes strict lint rules.

### `lib/assert.ts`

```ts
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

/** Put in a switch's default branch so TypeScript fails when a case is missing. */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}
```

### `app/App.tsx` and `app/Providers.tsx`

```tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Providers } from './Providers'

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
```

```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { queryClient } from '@/lib/query/queryClient'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ThemeProvider, TooltipProvider, ToastProvider, AuthProvider: add only when used */}
      {children}
    </QueryClientProvider>
  )
}
```

A provider is added when something needs it, not "just in case". Providers that need router hooks (`useNavigate`) must render inside the router, for example in `AppLayout`.

### Router

Use the data router (`createBrowserRouter`): it supports route-level `lazy`, `errorElement` and loaders.

`app/paths.ts`:

```ts
export const paths = {
  login: '/login',
  dashboard: '/dashboard',
  students: '/students',
  studentNew: '/students/new',
  student: (studentId: string) => `/students/${studentId}`,
  studentEdit: (studentId: string) => `/students/${studentId}/edit`,
  settingsProfile: '/settings/profile',
} as const
```

Links use `paths.student(id)`, never hand-typed strings.

`app/routes/index.tsx` (shown in one file here; in a real project each area's routes live in their own file in `app/routes/` and are spread into this tree):

```tsx
import { Navigate, type RouteObject } from 'react-router-dom'
import { LoadingState } from '@/components/feedback/LoadingState'
import { AppLayout } from '@/app/layouts/AppLayout'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { NotFoundPage } from '@/components/feedback/NotFoundPage'
import { RouteErrorPage } from '@/components/feedback/RouteErrorPage'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { paths } from '../paths'

export const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorPage standalone />,
    children: [
      {
        path: paths.login,
        lazy: async () => ({
          Component: (await import('@/features/auth/pages/LoginPage')).LoginPage,
        }),
      },
    ],
  },
  {
    path: '/',
    element: <RequireAuth />,
    errorElement: <RouteErrorPage standalone />,
    hydrateFallbackElement: <LoadingState label="Loading" />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            // Page errors render inside the layout, so navigation stays usable.
            errorElement: <RouteErrorPage />,
            children: [
              { index: true, element: <Navigate to={paths.dashboard} replace /> },
              {
                path: 'dashboard',
                lazy: async () => ({
                  Component: (await import('@/features/dashboard/pages/DashboardPage')).DashboardPage,
                }),
              },
              {
                path: 'students',
                children: [
                  {
                    index: true,
                    lazy: async () => ({
                      Component: (await import('@/features/students/pages/StudentListPage'))
                        .StudentListPage,
                    }),
                  },
                  {
                    path: ':studentId',
                    lazy: async () => ({
                      Component: (await import('@/features/students/pages/StudentDetailPage'))
                        .StudentDetailPage,
                    }),
                  },
                ],
              },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
]
```

`app/router.ts`:

```ts
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './routes'

export const router = createBrowserRouter(routes)
```

Route conventions:
- List at `/students`, create at `/students/new`, detail at `/students/:studentId`, edit at `/students/:studentId/edit`.
- Every page route is `lazy`, so each feature ships in its own chunk.
- Every route tree has a 404 (`*`) and an `errorElement`.
- Filters, sorting, tabs and pagination live in the URL ([section 14](#14-tables-filters-and-pagination)).

---

## 8. State: where each piece of data lives

### Decision tree

```
Does it come from the API?              → TanStack Query
Should it survive a reload or be shared
  by link (filters, page, tab, sort)?   → URL search params
Is it what a user is typing in a form?  → React Hook Form
Can it be calculated from other state?  → Don't store it. Calculate it
Is it used by one component?            → useState / useReducer
Is it used by a small subtree?          → Lift state up, or Context
Is it client-only and shared app-wide,
  and Context re-renders too much?      → Zustand
```

### Examples

| Data | Home |
|---|---|
| Students, invoices, notifications, reports | TanStack Query |
| Current page, search term, status tab, sort | URL: `?page=2&search=asha&status=enrolled` |
| Admission form fields and their errors | React Hook Form |
| Dropdown open, hover, local toggle | `useState` |
| Theme preference, sidebar collapsed | Context + `localStorage`, or Zustand if many components write it |
| Multi-step wizard progress | `useReducer` in the wizard, or Zustand if steps are separate routes |
| Filtered or sorted list, totals, "can edit" | Calculated during render |

### Rules

- Never copy query data into `useState` or a store "to edit it". Pass it into the form as `defaultValues`.
- Never create a global store per filter.
- A Zustand store holds client state only, is split by concern (`useSidebarStore`, not `useAppStore`), and is read through selectors: `useSidebarStore((s) => s.collapsed)`.

---

## 9. API layer

### 9.1 Flow

```
Component ─► feature hook (useStudents) ─► TanStack Query ─► API function (getStudents)
          ─► api client (lib/api/client.ts) ─► fetch ─► backend
                    │
                    └── non-2xx ─► ApiError (normalised) ─► query error ─► ErrorState
```

No component ever calls `fetch` or `api.get` directly.

### 9.2 `lib/api/ApiError.ts`

```ts
/** Every non-2xx response becomes this shape, whatever the backend sent. */
export class ApiError extends Error {
  readonly status: number
  readonly messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.messages = messages
  }

  static async fromResponse(response: Response) {
    let messages: string[] = []
    try {
      const body: unknown = await response.json()
      // NestJS sends `message` as a string or an array of validation messages.
      if (typeof body === 'object' && body !== null && 'message' in body) {
        const { message } = body
        if (typeof message === 'string') messages = [message]
        else if (Array.isArray(message))
          messages = message.filter((item: unknown): item is string => typeof item === 'string')
      }
    } catch {
      // Not JSON; fall back to the status text.
    }
    if (messages.length === 0 && response.statusText) messages = [response.statusText]
    return new ApiError(response.status, messages)
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError

/** A message that is safe to show a user. */
export function getErrorMessage(error: unknown) {
  if (isApiError(error)) {
    if (error.status === 0) return 'Can’t reach the server. Check your connection and try again.'
    if (error.status >= 500) return 'The server had a problem. Try again in a moment.'
    return error.message
  }
  return 'Something went wrong. Try again.'
}
```

### 9.3 `lib/api/client.ts` (fetch wrapper)

```ts
import { env } from '@/config/env'
import { ApiError } from './ApiError'

type RequestOptions = Omit<RequestInit, 'method' | 'body' | 'headers'> & {
  headers?: Record<string, string>
  timeoutMs?: number
}

async function request<T>(
  method: string,
  path: string,
  body: unknown,
  { headers, timeoutMs = 15_000, signal, ...init }: RequestOptions = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      ...init,
      method,
      credentials: 'include', // httpOnly session cookie
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ?? AbortSignal.timeout(timeoutMs),
    })
  } catch {
    // Network failure, CORS or timeout.
    throw new ApiError(0, ['Network request failed'])
  }

  if (response.status === 401) onUnauthorized()
  if (!response.ok) throw await ApiError.fromResponse(response)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

let onUnauthorized = () => {}
/** Called once by the auth feature, e.g. to clear the session and go to /login. */
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
}
```

`as T` is a promise, not a check. Validate untrusted responses with Zod (9.5).

If you choose Axios instead, keep the same boundary: one `axios.create({ baseURL: env.apiUrl, timeout: 15_000, withCredentials: true })` instance, and one response interceptor that turns every error into `ApiError`.

### 9.4 `lib/query/queryClient.ts`

```ts
import { QueryClient } from '@tanstack/react-query'
import { isApiError } from '@/lib/api/ApiError'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Retry network and server errors, not 4xx: a 404 won't fix itself.
      retry: (failureCount, error) =>
        failureCount < 2 && !(isApiError(error) && error.status >= 400 && error.status < 500),
    },
    mutations: { retry: false },
  },
})
```

### 9.5 Types from schemas

Validate data you don't control at the boundary. Types then come from the schema, so they can't drift.

`features/students/schemas/student.schema.ts`:

```ts
import { z } from 'zod'

export const feeStatusSchema = z.enum(['paid', 'due', 'overdue'])

export const studentSchema = z.object({
  id: z.string(),
  admissionNo: z.string(),
  name: z.string(),
  grade: z.number().int(),
  section: z.string(),
  feeStatus: feeStatusSchema,
  admittedAt: z.iso.datetime(),
})

export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({ items: z.array(item), total: z.number().int(), page: z.number().int(), pageSize: z.number().int() })

export type Student = z.infer<typeof studentSchema>
export type FeeStatus = z.infer<typeof feeStatusSchema>
```

For a trusted, typed backend (for example an OpenAPI-generated client), parsing every response can be skipped for speed. Decide per project and write it in `FRONTEND.md`.

### 9.6 Query keys

`features/students/api/studentKeys.ts`:

```ts
import type { StudentFilters } from '../types/student.types'

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters: StudentFilters) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (studentId: string) => [...studentKeys.details(), studentId] as const,
}
```

Invalidate broadly (`studentKeys.lists()`), read narrowly (`studentKeys.list(filters)`).

### 9.7 API functions

One function per endpoint, in `features/<feature>/api/`:

```ts
// getStudents.ts
import { api } from '@/lib/api/client'
import { paginatedSchema, studentSchema } from '../schemas/student.schema'
import type { StudentFilters } from '../types/student.types'

const studentPageSchema = paginatedSchema(studentSchema)

export async function getStudents(filters: StudentFilters, signal?: AbortSignal) {
  const params = new URLSearchParams({
    page: String(filters.page),
    pageSize: String(filters.pageSize),
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.status !== 'all' ? { status: filters.status } : {}),
    sort: filters.sort,
  })
  const data = await api.get<unknown>(`/students?${params.toString()}`, { signal })
  return studentPageSchema.parse(data)
}
```

### 9.8 Hooks

```ts
// useStudents.ts
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getStudents } from '../api/getStudents'
import { studentKeys } from '../api/studentKeys'
import type { StudentFilters } from '../types/student.types'

export function useStudents(filters: StudentFilters) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: ({ signal }) => getStudents(filters, signal),
    placeholderData: keepPreviousData, // keep the old page visible while the next loads
  })
}
```

```ts
// useCreateStudent.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStudent } from '../api/createStudent'
import { studentKeys } from '../api/studentKeys'

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studentKeys.lists() }),
  })
}
```

### 9.9 Backend contract checklist (agree this with the API team)

- [ ] Base URL per environment
- [ ] Auth mechanism, and what a 401 and a 403 look like
- [ ] Error body shape, including field-level validation errors
- [ ] Pagination shape (`items`, `total`, `page`, `pageSize`, or cursor)
- [ ] Sorting and filtering parameter names
- [ ] Date format (ISO 8601 with offset) and time zone
- [ ] Money format (integer minor units, or decimal string, plus currency code)
- [ ] IDs (string UUIDs are safest for JavaScript)
- [ ] CORS and cookie settings (`SameSite`, `Secure`, allowed origins)
- [ ] Rate limits and what the client should do on `429`
- [ ] OpenAPI spec location, if any

---

## 10. Forms and validation

React Hook Form holds the form state; Zod describes what is valid. The same schema can validate on the client and document the API contract.

```tsx
// features/students/schemas/studentForm.schema.ts
import { z } from 'zod'

export const studentFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter the student’s full name'),
  guardianEmail: z.union([z.email('Enter a valid email address'), z.literal('')]),
  grade: z.number({ error: 'Choose a class' }).int().min(1).max(12),
})

export type StudentFormValues = z.infer<typeof studentFormSchema>
```

```tsx
// features/students/components/StudentForm.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/lib/api/ApiError'
import { studentFormSchema, type StudentFormValues } from '../schemas/studentForm.schema'

type StudentFormProps = {
  defaultValues?: Partial<StudentFormValues>
  onSubmit: (values: StudentFormValues) => Promise<unknown>
  submitLabel: string
}

export function StudentForm({ defaultValues, onSubmit, submitLabel }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: { name: '', guardianEmail: '', ...defaultValues },
  })

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      setError('root', { message: getErrorMessage(error) })
    }
  })

  return (
    <form noValidate onSubmit={(event) => void submit(event)} className="grid gap-4">
      <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
      <Input
        label="Guardian email"
        type="email"
        autoComplete="email"
        error={errors.guardianEmail?.message}
        {...register('guardianEmail')}
      />
      <Input
        label="Class"
        type="number"
        inputMode="numeric"
        error={errors.grade?.message}
        {...register('grade', { valueAsNumber: true })}
      />
      {errors.root && (
        <p role="alert" className="text-sm font-semibold text-danger">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  )
}
```

Form rules:
- Every field has a visible `<label>`. Placeholders are examples, never labels.
- Errors are text next to the field (linked with `aria-describedby`), not colour alone.
- Validate on submit first, then on change for fields that already showed an error (React Hook Form's default `mode: 'onSubmit'` with `reValidateMode: 'onChange'`).
- The submit button shows progress and can't be pressed twice.
- Map server validation errors to fields with `setError('fieldName', ...)` when the API returns field names; otherwise use `root`.
- On success, say what happened (toast or redirect with a message) and invalidate the affected queries.
- Set `autoComplete`, `inputMode` and `type` so phones show the right keyboard.
- Frontend validation is for the user's convenience. The backend validates again.

---

## 11. Components

### 11.1 Hierarchy

```
Design tokens (styles/index.css)
  └─ UI primitives            components/ui       Button, Input, Dialog, Table
       └─ Shared composites   components/*        ConfirmDialog, EmptyState, PageContainer
            └─ Feature parts  features/*/components   StudentTable, DeleteStudentButton
                 └─ Pages     features/*/pages        StudentListPage
```

A lower layer never imports a higher one.

### 11.2 `components/ui`: domain-free primitives

Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Dialog, ConfirmDialog, Drawer, Dropdown, Popover, Tooltip, Tabs, Badge, Avatar, Card, Table, Pagination, Spinner, Skeleton, Alert, Toast.

`StudentCard`, `InvoiceRow` or `FeeBadge` don't belong here. They live in their feature.

Build overlays (Dialog, Dropdown, Select, Tooltip, Popover, Tabs, Toast) on a headless library. Focus trapping, Escape, arrow-key navigation and screen-reader announcements are hard to get right by hand.

### 11.3 Component API rules

- **Variants, not boolean soup.** `<Button variant="danger" size="sm" loading startIcon={<TrashIcon />}>` rather than `<Button red small round />`.
- **Native props pass through.** Spread `...props` onto the underlying element so `aria-*`, `disabled`, `type`, `name` and `ref` keep working.
- **Safe defaults.** `Button` defaults to `type="button"`; `IconButton` requires a `label` for its accessible name.
- **Controlled and uncontrolled.** Overlays accept `open` + `onOpenChange`, and also work without them.
- **Discriminated unions** when props depend on each other:

  ```ts
  type LinkOrButtonProps =
    | ({ as: 'link'; to: string } & Omit<ComponentProps<typeof Link>, 'to'>)
    | ({ as?: 'button' } & ComponentProps<'button'>)
  ```

- **Variant maps live in a styles file** so links can look like buttons:

  ```ts
  // components/ui/buttonStyles.ts
  import { cn } from '@/lib/cn'

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'border border-border bg-surface text-foreground hover:bg-muted',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
    danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
  } as const
  const sizes = { sm: 'h-9 px-3 text-sm pointer-coarse:h-11', md: 'h-11 px-4' } as const

  export function buttonClasses({
    variant = 'primary',
    size = 'md',
    className,
  }: { variant?: keyof typeof variants; size?: keyof typeof sizes; className?: string } = {}) {
    return cn(
      'inline-flex items-center justify-center gap-2 rounded-md font-semibold disabled:cursor-not-allowed disabled:opacity-60',
      variants[variant],
      sizes[size],
      className,
    )
  }
  ```

### 11.4 Size and splitting

- Split a component when it has a second responsibility, when a part repeats, or when it passes about 200 lines. A 1,500-line page is a bug.
- Don't split one-line markup with no behaviour or reuse (`UserName.tsx`, `UserEmail.tsx`).
- A typical list page: `StudentListPage` → `StudentFilters`, `StudentTable`, `studentColumns`, `Pagination`, `DeleteStudentDialog`.

### 11.5 Business logic out of JSX

```tsx
// Hard to read and impossible to test
{invoice.status === 'paid' && invoice.amount > 100_000 && user.role === 'admin' && <RefundButton />}

// Named, tested rule
const canRefund = canRefundInvoice({ invoice, user })
{canRefund && <RefundButton />}
```

### Icons

- One icon library for the whole app (Lucide, Phosphor, Heroicons, or a custom set). No mixing.
- Write down why that set fits the product. The default look of a popular set is not a reason on its own (antislop R-04).
- Decorative icons get `aria-hidden="true"`. An icon-only button gets an accessible name (`aria-label` or visually hidden text).
- Import icons by name so the bundler tree-shakes them. Check the bundle once.

### Images

```tsx
<img
  src={photo.url}
  alt={photo.alt}          // describe the content; alt="" only when purely decorative
  width={320}
  height={240}             // reserve space: no layout shift
  loading="lazy"           // below the fold only; above-the-fold images load eagerly
  decoding="async"
  className="h-auto max-w-full object-cover"
  onError={handleImageError}
/>
```

Serve correctly sized images (`srcset`/`sizes`), and modern formats (WebP/AVIF) where the backend allows.

---

## 12. Styling with Tailwind v4 and design tokens

### 12.1 Setup

Tailwind v4 is configured in CSS. Use the Vite plugin; don't create `tailwind.config.js` or `postcss.config.js` for a new v4 project.

### 12.2 Tokens

`src/styles/index.css` holds only Tailwind directives: no hand-written selectors or component CSS.

```css
@import 'tailwindcss';

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@theme {
  /* Remove Tailwind's default palette so only design tokens can be used. */
  --color-*: initial;

  --color-background: #f5f6f8;
  --color-surface: #ffffff;
  --color-foreground: #1a2233;
  --color-muted: #eef0f3;
  --color-muted-foreground: #525c6b;
  --color-border: #d8dce3;
  --color-control: #8a94a3;
  --color-primary: #1f3a5f;
  --color-primary-foreground: #ffffff;
  --color-accent: #f0a500;
  --color-success: #1f7a4d;
  --color-warning: #8a5a00;
  --color-danger: #b42318;
  --color-danger-foreground: #ffffff;

  --font-sans: 'Your Font Variable', system-ui, sans-serif;

  --spacing-sidebar: 14rem;
  --spacing-navbar: 4rem;
}

@layer theme {
  :root {
    @variant dark {
      --color-background: #0d131d;
      --color-surface: #151d2a;
      --color-foreground: #e6ebf2;
      /* ...every colour token redefined for dark */
    }
  }
}
```

Token rules:
- Names say what a colour is **for** (`primary`, `danger`, `muted-foreground`), never what it looks like (`blue-700`).
- Every text and background pair is contrast-checked (4.5:1 normal text, 3:1 large text and UI edges) in both themes. Write the ratios in `DESIGN.md`.
- A new colour goes into `DESIGN.md` first, then `index.css`, then the colour list in `cn.ts`.
- Palette: 2 to 3 core colours plus 1 accent. State colours (success, warning, danger) are functional, never decoration.
- No arbitrary colours in markup (`text-[#173B67]`). Arbitrary values are acceptable for one-off layout maths (`grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))]`).
- Radius, shadow, z-index and motion also come from a small, named set. Shadows mark elevation (menus, dialogs), not every card.

### The `cn` helper

```ts
import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Tell tailwind-merge the custom token names, or it may treat `text-foreground`
// as a font size and drop `text-sm`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: ['background', 'surface', 'foreground', 'muted', 'muted-foreground', 'border',
        'control', 'primary', 'primary-foreground', 'accent', 'success', 'warning', 'danger',
        'danger-foreground'],
      spacing: ['sidebar', 'navbar'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Unit-test it: `cn('text-sm', 'text-foreground')` must keep both classes.

### 12.3 Tailwind usage rules

- **Repeated class lists become components,** not copy-paste. Tailwind styles the design system; it doesn't replace it.
- Don't use `@apply` to build a parallel CSS component library.
- Use logical properties (`ms-`, `me-`, `ps-`, `start-`) so right-to-left layouts work.
- Use `motion-reduce:` for every animation and transition.
- Use `pointer-coarse:` to enlarge compact controls on touch screens.
- Pass `className` last into `cn()` so callers can adjust a component.

---

## 13. Pages and UI states

### 13.1 States every async screen considers

| State | What the user sees |
|---|---|
| Initial loading | Skeleton shaped like the real content, or spinner **with text** ("Loading students…") |
| Refreshing | Old data stays, dimmed or with a small indicator; no layout jump |
| Submitting | Button shows progress, can't double-submit |
| Empty (first use) | Why it's empty, and the one action that fills it ("No students yet. Add the first student") |
| Empty (filtered) | "Nothing matches “asha”", plus a Clear filters action |
| Error | What failed, what to do, a Retry button |
| Unauthorised / forbidden | Redirect to login (401) or an explanation (403) |
| Offline | Clear message; retry when back online |
| Success | Confirmation in context (toast, inline message or redirect) |

### 13.2 Page template

```tsx
export function StudentListPage() {
  const filters = useStudentFilters()          // URL state (section 14)
  const students = useStudents(filters.values) // server state

  return (
    <PageContainer
      title="Students"
      actions={
        <Link to={paths.studentNew} className={buttonClasses()}>
          Add student
        </Link>
      }
    >
      <StudentFilters value={filters.values} onChange={filters.set} />

      {students.isPending ? (
        <StudentTableSkeleton />
      ) : students.isError ? (
        <ErrorState
          title="Couldn’t load students"
          description={getErrorMessage(students.error)}
          onRetry={() => void students.refetch()}
        />
      ) : students.data.items.length === 0 ? (
        filters.isFiltered ? (
          <EmptyState title="No students match these filters" action={<Button onClick={filters.reset}>Clear filters</Button>} />
        ) : (
          <EmptyState title="No students yet" description="Students you admit appear here." />
        )
      ) : (
        <>
          <StudentTable students={students.data.items} isRefreshing={students.isPlaceholderData} />
          <Pagination page={filters.values.page} pageCount={Math.ceil(students.data.total / filters.values.pageSize)} onPageChange={(page) => filters.set({ page })} />
        </>
      )}
    </PageContainer>
  )
}
```

`PageContainer` owns the heading, the browser tab `<title>`, optional actions, padding and max width, so every page is consistent.

### 13.3 Dedicated status screens

Build these once, in `components/feedback/`:
- **404:** the address doesn't exist; link back to a known page.
- **403:** you're signed in but can't see this; say who can grant access.
- **401:** handled by redirecting to login with `?redirect=`.
- **500 / route error:** something broke; Retry, and a reference ID if monitoring provides one.
- **Offline:** detected with `navigator.onLine` plus failed requests.

---

## 14. Tables, filters and pagination

### 14.1 Standard pieces

| Piece | Where | Responsibility |
|---|---|---|
| `Table` | `components/ui` | Semantic `<table>`, caption, own horizontal scroll, loading, empty and error rows |
| `Pagination` | `components/navigation` | Page numbers with gaps, previous and next, `aria-current` |
| `useListParams` / `useStudentFilters` | `hooks` / feature | Reads and writes `page`, `pageSize`, `search`, `sort`, `status` in the URL |
| `studentColumns` | Feature | Column definitions: header, cell renderer, alignment |
| `StudentFilters` | Feature | Search, sort and status controls |
| `StudentTable` | Feature | Wires columns, rows and row actions |

### 14.2 Filters in the URL

```ts
import { useSearchParams } from 'react-router-dom'

const STATUSES = ['all', 'enrolled', 'pending', 'left'] as const
type Status = (typeof STATUSES)[number]
const isStatus = (value: string | null): value is Status => STATUSES.some((s) => s === value)

export function useStudentFilters() {
  const [params, setParams] = useSearchParams()

  const values = {
    page: Math.max(1, Number(params.get('page')) || 1),
    pageSize: 20,
    search: params.get('search') ?? '',
    status: isStatus(params.get('status')) ? (params.get('status') as Status) : 'all',
    sort: params.get('sort') ?? 'name-asc',
  }

  const set = (next: Partial<typeof values>) => {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current)
        for (const [key, value] of Object.entries(next)) {
          if (value === '' || value === 'all' || (key === 'page' && value === 1)) updated.delete(key)
          else updated.set(key, String(value))
        }
        // Changing a filter returns to page 1.
        if (!('page' in next)) updated.delete('page')
        return updated
      },
      { replace: true },
    )
  }

  return {
    values,
    set,
    reset: () => setParams({}, { replace: true }),
    isFiltered: values.search !== '' || values.status !== 'all',
  }
}
```

Debounce the search input (about 300 ms) before writing it to the URL.

### 14.3 Table rules

- Columns come from the decision the user makes on this screen, not from the database schema. Put the deciding field early.
- The main field (name) is bold, with a muted second line for context. IDs, phone numbers and amounts use `tabular-nums`; amounts align right.
- Status badges carry text. Colour only for states that need attention (overdue, pending); normal states stay neutral.
- Row actions: a labelled three-dot menu or one clear primary action. No coloured "Manage" button on every row.
- Destructive actions ask for confirmation that names the thing affected.
- Sorting, filtering and pagination happen on the server when data can grow. Client-side only for small, fully loaded lists.
- Wide tables scroll horizontally inside their own container, never the page. On phones, consider a card list for the few most important fields.
- Row selection and bulk actions: add with TanStack Table when a real workflow needs them.
- More than a few hundred rows at once: paginate, or virtualise with TanStack Virtual.
- Pagination contract: `page`, `pageSize`, `total` (or `cursor`, `limit`, `nextCursor`), the same across all endpoints.

---

## 15. Authentication, permissions and security

### 15.1 Auth flows to design

- [ ] Login, including errors (wrong password, locked account, rate limited)
- [ ] Logout (server-side session invalidation, cache cleared: `queryClient.clear()`)
- [ ] Session restore on reload (`GET /auth/me`) with a loading state
- [ ] Session expiry: a 401 anywhere → clear state → `/login?redirect=<current path>`
- [ ] Refresh tokens, if used: one refresh in flight at a time; queued requests retry once
- [ ] 403: explain, don't loop to login
- [ ] Redirect after login, validated so it can't send users to another site
- [ ] Password reset and invitation flows, if the product has them

### 15.2 Token storage

| Option | Use when | Risk |
|---|---|---|
| httpOnly, `Secure`, `SameSite` cookie set by the API | Default for same-site apps | Needs CSRF protection on state-changing requests (SameSite + CSRF token or header) |
| Access token in memory + refresh token in httpOnly cookie | Cross-site APIs, mobile + web sharing one API | More moving parts |
| Token in `localStorage` | Avoid | Any XSS can read it |

### 15.3 Guards

```tsx
export function RequireAuth() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <LoadingState label="Checking your session" />
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${paths.login}?redirect=${redirect}`} replace />
  }
  return <Outlet />
}

/** Only same-site paths; blocks open redirects such as //evil.example or https://... */
export function safeRedirect(target: string | null, fallback: string = paths.dashboard) {
  return target?.startsWith('/') && !target.startsWith('//') ? target : fallback
}
```

### 15.4 Permissions

```ts
// features/auth/utils/permissions.ts
export const PERMISSIONS = {
  studentsRead: 'students:read',
  studentsWrite: 'students:write',
  feesRefund: 'fees:refund',
} as const
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const can = (user: { permissions: readonly string[] } | null, permission: Permission) =>
  user?.permissions.includes(permission) ?? false
```

- Hide or disable actions the user can't take (UX), and still expect the API to refuse them (security).
- Check permissions per route and per action, not only in the menu.
- Permissions come from the server, not from a role name hard-coded in the client.

### 15.5 Security checklist

- [ ] The frontend is never the security boundary. Hidden buttons, disabled fields, client validation and `localStorage` flags protect nothing
- [ ] No secrets in `VITE_*` variables or in the repository
- [ ] No `dangerouslySetInnerHTML`. If unavoidable, sanitise with DOMPurify and note why
- [ ] No `javascript:` URLs; validate user-supplied links (`https:` only)
- [ ] Redirect targets validated (`safeRedirect`)
- [ ] No tokens, passwords or personal data in logs, analytics, error reports or URLs
- [ ] `target="_blank"` links to other sites include `rel="noreferrer"`
- [ ] Content Security Policy set by the hosting layer; no inline scripts beyond a hashed theme bootstrap
- [ ] `npm audit` in CI; review new dependencies before adding ([section 25](#25-dependencies))
- [ ] File uploads: type and size checked on the client for UX, and again on the server
- [ ] Personal data (students, staff, guardians): only fetched when needed, never cached in `localStorage`

---

## 16. Error handling

### 16.1 Layers

| Layer | Catches | Shows |
|---|---|---|
| API client | Network, timeout, non-2xx | Throws `ApiError` |
| TanStack Query | Failed queries and mutations | `isError`, `error` on the hook |
| Component | Query errors | `ErrorState` with Retry, or inline form error |
| Route `errorElement` | Render errors, failed lazy imports, loader errors | `RouteErrorPage` inside the layout |
| Root `errorElement` | The layout itself failing | Standalone error page |
| Global handlers | Unhandled promise rejections | Logged to monitoring |

### 16.2 Rules

- Never `catch (error) { console.log(error) }`. Handle it, rethrow it, or report it.
- Show users `getErrorMessage(error)`: plain language, no stack traces, no raw server text for 5xx.
- A failed lazy chunk after a deploy: offer "Reload" (new files replaced the old ones).
- Mutations show errors next to the form or in a toast; errors that need action stay until dismissed.
- Report unexpected errors to monitoring with context (route, feature, user ID), never personal data.

---

## 17. Accessibility

### 17.1 Build rules

- Semantic HTML first: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<header>`, `<section aria-labelledby>`, `<table>` for tables, `<label>` for every control.
- Never `<div onClick>`. If something is clickable, it is a button or a link.
- One `<h1>` per page, headings in order.
- Visible focus on every interactive element (3:1 against its background). Never `outline: none` without a replacement.
- Keyboard: Tab order follows visual order; Enter and Space activate; Escape closes overlays; focus returns to the trigger.
- Dialogs trap focus; drawers make the background inert.
- Text contrast 4.5:1 (3:1 for large text); control borders and icons 3:1. Check with a tool, don't eyeball it.
- Colour is never the only signal (errors have text, statuses have labels).
- Touch targets at least 44 × 44 px.
- Icon-only buttons have accessible names; decorative icons are hidden from screen readers.
- Loading regions use `role="status"` or `aria-busy`; errors use `role="alert"` when they appear.
- Animations respect `prefers-reduced-motion`.
- Pages work at 200% zoom and 320px width without horizontal page scroll.

### 17.2 Before release

- [ ] Keyboard-only walkthrough of every critical flow
- [ ] Visible focus everywhere, in both themes
- [ ] Every form control labelled; errors announced
- [ ] Alt text on meaningful images
- [ ] Heading hierarchy makes sense
- [ ] Contrast checked in light and dark
- [ ] Screen reader pass (NVDA or JAWS on Windows, VoiceOver on macOS/iOS, TalkBack on Android)
- [ ] Dialog focus trap and Escape
- [ ] No keyboard traps
- [ ] Reduced motion honoured
- [ ] Automated checks (axe in Playwright or the browser extension) show no serious issues

---

## 18. Responsive and mobile

Mobile is a different layout, not the desktop squeezed.

### 18.1 Decide per screen

| Question | Typical answer |
|---|---|
| Sidebar | Fixed on desktop, collapsible to icons; drawer with a labelled "Menu" button below `lg` |
| Tables | Horizontal scroll inside a container, or a card list with the key fields on phones |
| Filters | Inline on desktop; a sheet or collapsible panel on phones |
| Dialogs | Centred on desktop; full-width or bottom sheet on phones |
| Dense forms | One column on phones; related fields side by side from `sm` |
| Primary action | In the page header on desktop; reachable without scrolling past a long form on phones (sticky footer if needed) |

### 18.2 Rules

- Design at least three widths: phone (~390px), tablet (~768px), desktop (~1280px). Drag through the whole range; don't only check two points.
- Place breakpoints where content breaks, not at device names.
- No hover-only features. Everything reachable by tap.
- Touch targets ≥ 44px with space between them.
- Forms: correct `type`, `inputMode` and `autoComplete`; the focused field is never hidden by the on-screen keyboard.
- Fluid type with `clamp()` or smaller type steps on phones; section padding scales down.
- Use `dvh`, not `vh`, for full-height layouts.
- Nothing causes horizontal page scroll: `min-w-0` on flex and grid children, `max-w-full` on media, long strings wrap.

---

## 19. React discipline: effects, memoisation, derived state

### Derived state

```tsx
// Two sources of truth that drift apart
const [students, setStudents] = useState<Student[]>([])
const [overdue, setOverdue] = useState<Student[]>([])

// One source of truth
const overdue = students.filter((s) => s.feeStatus === 'overdue')
```

### `useEffect` is for synchronising with something outside React

Use effects for: subscriptions (WebSocket, `matchMedia`, `resize`), timers, DOM APIs (focus, scroll), third-party widgets, document-level listeners.

Don't use effects for: computing values from props or state, reacting to a button click (put that logic in the handler), fetching data (use TanStack Query), resetting state when a prop changes (use a `key`).

```tsx
// Wrong
useEffect(() => setFullName(`${first} ${last}`), [first, last])
// Right
const fullName = `${first} ${last}`
```

Prefer `useSyncExternalStore` for reading browser state such as media queries.

### Memoisation

`useMemo`, `useCallback` and `React.memo` are tools for measured problems:
- the calculation is expensive (profile it),
- a memoised child re-renders because of a new object or function reference,
- a value is a dependency of an effect or a context value.

Don't wrap everything by default. If the React Compiler is enabled for the project, it memoises automatically and manual memoisation becomes rarer still.

### Other rules

- Keys are stable IDs, never array indexes for lists that change.
- Don't define components inside components.
- Lift state only as far as needed; colocate otherwise.
- Reset a form or component by changing its `key`, not with an effect.

---

## 20. Performance

### 20.1 Order of work

1. Set a budget.
2. Measure (Lighthouse, React DevTools Profiler, Chrome Performance panel, Web Vitals in production).
3. Fix the biggest measured problem.
4. Measure again.

### 20.2 Budget (adjust per project and record in `FRONTEND.md`)

| Metric | Target |
|---|---|
| Initial JavaScript (gzip) | ≤ 200 KB for the first route |
| Largest single chunk | ≤ 500 KB minified (Vite warns above this) |
| LCP | ≤ 2.5 s on a mid-range phone, 4G |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |
| Images | Sized for their slot; above-the-fold image ≤ 200 KB |

### 20.3 Techniques

- **Route-level code splitting** with the router's `lazy` (already in [section 7](#router)).
- **Split vendor chunks** when the main chunk is large (React, router, UI primitives, charts), using Vite's build output options.
- **Lazy-load heavy components** (charts, rich text editors, PDF viewers) with `React.lazy` + `Suspense`, or dynamic `import()` on demand.
- **Virtualise** long lists (TanStack Virtual).
- **Fonts:** self-host variable fonts, preload the one used above the fold, `font-display: swap`.
- **Images:** correct size, modern format, `width`/`height`, lazy below the fold.
- **Network:** sensible `staleTime`, no request waterfalls (fetch in parallel), cancel stale requests with `AbortSignal`.
- **Check bundle contents** after adding any dependency (`vite build` output, or a visualiser plugin).

### 20.4 Browser support

Write the supported browsers in `FRONTEND.md` (for example: last 2 versions of Chrome, Edge, Firefox and Safari, plus the Android WebView your users run). Set Vite's `build.target` to match, and test on the oldest one before release.

---

## 21. Dates, money and constants

### Dates

- Transport and store as ISO 8601 with an offset or `Z`: `2026-09-14T09:30:00Z`. Date-only values as `2026-09-14`.
- Convert to local display only at the UI boundary, through `lib/format.ts`:

  ```ts
  const LOCALE = 'en-IN'
  const TIME_ZONE = 'Asia/Kolkata'
  const dateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeZone: TIME_ZONE })
  export const formatDate = (iso: string) => dateFormat.format(new Date(iso))
  ```

- Never parse or build `DD/MM/YYYY` strings internally.
- Date-only values ("date of birth") must not shift a day across time zones: keep them as `YYYY-MM-DD` strings and format without converting through UTC midnight.
- Use a date library only for real calendar maths (time zones, recurrence, business days).

### Money

- Never do money maths with floating point (`0.1 + 0.2 !== 0.3`).
- Transport amounts as integer minor units (`12345` paise) or decimal strings, plus a currency code, as agreed with the backend.
- Calculate in minor units; format only for display:

  ```ts
  const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
  export const formatMoney = (minorUnits: number) => inr.format(minorUnits / 100)
  ```

- Totals, taxes and discounts that matter legally are calculated by the backend; the frontend displays them.

### Constants and magic strings

```ts
export const FEE_STATUS = { paid: 'paid', due: 'due', overdue: 'overdue' } as const
export type FeeStatus = (typeof FEE_STATUS)[keyof typeof FEE_STATUS]
```

Prefer deriving the type from a Zod enum when the value comes from the API. Group constants by topic in the feature that owns them; avoid a single project-wide `constants.ts`.

---

## 22. Testing

### 22.1 Pyramid

```
            E2E (Playwright)          few: critical user flows, real browser
        Integration (Vitest + RTL)    some: features with mocked API
     Unit (Vitest)                    many: pure functions, schemas, hooks
```

### 22.2 What to test at each level

| Level | Test | Don't test |
|---|---|---|
| Unit | Formatters, calculations, permission rules, schemas, reducers, query-key factories, `cn` | Framework behaviour, trivial getters |
| Component / integration | What a user does and sees: type, click, submit, validation messages, loading/empty/error states, keyboard behaviour | Internal state, CSS classes, implementation details |
| E2E | Login, logout, create / edit / delete a record, search and pagination, payments and other business-critical flows | Every component variant |

### 22.3 Setup

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

// jsdom doesn't implement these.
window.matchMedia = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))
Element.prototype.scrollIntoView = vi.fn()
```

Render helper with providers:

```tsx
// src/test/render.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'

export function renderWithProviders(ui: ReactElement, { route = '/' } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}
```

### 22.4 Examples

```ts
// Unit
import { describe, expect, it } from 'vitest'
import { formatMoney } from './format'

describe('formatMoney', () => {
  it('formats paise as rupees with Indian grouping', () => {
    expect(formatMoney(12345600)).toBe('₹1,23,456.00')
  })
})
```

```tsx
// Component: behaviour, queried by role and label
it('shows a validation message when the name is empty', async () => {
  renderWithProviders(<StudentForm submitLabel="Save" onSubmit={vi.fn()} />)
  await userEvent.click(screen.getByRole('button', { name: 'Save' }))
  expect(await screen.findByText('Enter the student’s full name')).toBeInTheDocument()
})
```

- Query by role, label and visible text, the way users find things. `getByTestId` is the last resort.
- Use `userEvent`, not `fireEvent`.
- Mock the network (MSW), not your own hooks.

### 22.5 Playwright

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
  webServer: { command: 'npm run build && npm run preview', port: 4173, reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})
```

```ts
// e2e/students.spec.ts
import { expect, test } from '@playwright/test'

test('searching filters the student list', async ({ page }) => {
  await page.goto('/students')
  await page.getByRole('searchbox', { name: 'Search students' }).fill('asha')
  await expect(page).toHaveURL(/search=asha/)
  await expect(page.getByRole('table')).toContainText('Asha')
})
```

E2E runs against a seeded test backend or a mocked API, never production data.

### 22.6 Storybook (optional)

Add when a component library is shared. For each primitive document: default, every variant, disabled, loading, error, long content, right-to-left, mobile width, dark theme. Stories double as visual regression tests.

---

## 23. Tooling, scripts, hooks and CI

### 23.1 Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "e2e": "playwright test",
    "check": "npm run typecheck && npm run lint && npm run format:check && npm run test:run && npm run build"
  }
}
```

`npm run check` answers one question: can this code be merged safely?

### 23.2 Responsibilities

| Tool | Job |
|---|---|
| TypeScript | Types are correct |
| ESLint | Code is correct and follows rules (hooks, promises, unsafe `any`) |
| Prettier | Formatting. Never argue about it |
| Vitest + RTL | Behaviour |
| Playwright | Critical flows in real browsers |

### 23.3 Pre-commit hooks (only in a git repository, with team agreement)

```bash
npm install -D husky lint-staged
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

`package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md,html}": ["prettier --write"]
  }
}
```

Keep hooks fast: format and lint staged files only. Type-checking the whole project and running tests belong in CI (or a `pre-push` hook if the team wants it).

### 23.4 CI (GitHub Actions)

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run format:check
      - run: npm run test:run
      - run: npm run build
      - run: npm audit --audit-level=high

  e2e:
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report
```

Use the current major versions of the actions when you set this up. Pin Node in `.nvmrc`. A separate `deploy.yml` builds once and deploys the same artifact to staging, then production.

---

## 24. Git and pull requests

### 24.1 Branches

```
main            always deployable
feature/<name>  new work
fix/<name>      bug fixes
refactor/<name> behaviour-preserving changes
```

Short-lived branches, merged through pull requests. No long-running `develop` branch unless releases require it.

### 24.2 Conventional commits

```
feat(students): add admission status filter
fix(fees): keep search when changing page
refactor(table): extract pagination component
docs: add API error handling notes
test(auth): cover expired session redirect
chore(deps): update react-router-dom
perf(dashboard): lazy-load charts
build: split vendor chunk
ci: cache Playwright browsers
```

Present tense, lower case, says what changed. The body explains why when it isn't obvious.

### 24.3 Pull request template

`.github/pull_request_template.md`:

```markdown
## What changed

## Why

## Screenshots or video
(UI changes: before and after, phone and desktop, light and dark)

## Testing
- [ ] npm run check
- [ ] Unit / component tests added or updated
- [ ] E2E updated (critical flows)
- [ ] Clicked through in the browser, no console errors

## Edge cases
- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Mobile and tablet
- [ ] Keyboard and screen reader
- [ ] Permissions (who can see or do this)

## Risks and follow-ups
```

---

## 25. Dependencies

### 25.1 Before adding a package

1. Can the browser do it? (`Intl`, `URLSearchParams`, `AbortController`, `structuredClone`, `<dialog>`, CSS)
2. Can React or the router already do it?
3. Can Tailwind do it?
4. Would 20 to 50 lines of our own, tested code do it?
5. If a package still wins: is it maintained, typed, tree-shakeable, reasonably small, with a compatible licence and few transitive dependencies?
6. Record why in `FRONTEND.md`.

### 25.2 Updating

- Don't run `npm update` blindly every day. Update on a schedule (for example every two weeks), or through automated dependency PRs (Renovate, Dependabot) that CI checks.
- For majors (React, Vite, TypeScript, Tailwind, router, TanStack Query, ESLint, testing libraries): read the changelog and migration guide → upgrade one at a time → `npm run check` → E2E → click through.
- Watch peer-dependency conflicts. Don't force-install over them (`--force`, `--legacy-peer-deps`) without writing down why.
- Run `npm audit` in CI. Review each finding: many affect only build tools, some need immediate action.
- Commit `package-lock.json`. Install in CI with `npm ci`.

---

## 26. Logging, monitoring, analytics, flags, i18n

### Logging

```ts
// lib/logger.ts
import { env } from '@/config/env'

type Context = Record<string, unknown>

export const logger = {
  debug: (message: string, context?: Context) => {
    if (env.isDev) console.warn(`[debug] ${message}`, context)
  },
  warn: (message: string, context?: Context) => {
    console.warn(message, context)
  },
  error: (message: string, error?: unknown, context?: Context) => {
    console.error(message, error, context)
    // reportError(error, { message, ...context })  // monitoring
  },
}
```

- `no-console` lint rule blocks stray `console.log`.
- Never log tokens, passwords, or personal data (names, phone numbers, addresses of students, guardians or staff).

### Monitoring

Add error monitoring (Sentry or equivalent) before the first production release: release version, route, user ID (not name or email), source maps uploaded privately. Alert on new error types and error-rate spikes. Track Web Vitals from real users.

### Analytics

Centralise event names so they can't drift:

```ts
// lib/analytics/events.ts
export const EVENTS = {
  studentCreated: 'student_created',
  feePaymentRecorded: 'fee_payment_recorded',
} as const

// lib/analytics/track.ts
export function trackEvent(name: (typeof EVENTS)[keyof typeof EVENTS], props?: Record<string, string | number | boolean>) {
  // send to the chosen provider; respect consent
}
```

Components call `trackEvent(EVENTS.studentCreated, { source: 'admission_form' })`, never a provider SDK directly.

### Feature flags

```ts
// config/flags.ts
export const flags = {
  newFeeDashboard: import.meta.env.VITE_FLAG_NEW_FEE_DASHBOARD === 'true',
} as const
```

One place to read flags; remove a flag and its dead branch as soon as the feature is fully released.

### Internationalisation

Even with one language today:
- Keep user-facing text in components and copy files, never inside business logic or API code.
- Format dates, numbers and currency with `Intl` (via `lib/format.ts`).
- Use logical CSS properties so right-to-left layouts can work.
- Check components with long text (German-length labels) and wrapped lines.
- When a second language is confirmed, add an i18n library and move strings into message files.

---

## 27. SEO, and when a SPA is the wrong choice

A client-rendered Vite SPA is right for apps behind a login: ERPs, dashboards, admin tools.

For public, search-driven pages (marketing site, blog, public school website):
- Prefer server rendering or static generation (React Router framework mode, or a static site generator).
- If a SPA must serve public pages: unique `<title>` and meta description per route, canonical URL, Open Graph and social metadata, `robots.txt`, `sitemap.xml`, structured data, semantic HTML.

Private apps should send `noindex` and keep `robots.txt` restrictive.

---

## 28. Design quality with antislop

The engineering above keeps code maintainable. antislop keeps the interface from looking generic or misleading.

### 28.1 Setup

1. Install the antislop skills (Claude Code plugin, or the skill folders for other agents).
2. Add the antislop block to `CLAUDE.md` / `AGENTS.md`.
3. Write `DESIGN.md` **with the product owner**: identity, audience, personality, palette (with contrast ratios), typography (with the reason), layout, motion, and the three dials (ENERGY / RHYTHM / MOTION).
4. Before any UI work, agree whether antislop applies during the work or as an audit afterwards.

### 28.2 Rules that affect code directly

- **No invented data.** No fake statistics, testimonials, names, avatars or activity feeds. Real data, or a placeholder that is clearly labelled as one (for example a visible "Sample data" badge and a file marked `SAMPLE DATA`).
- **No dead controls.** Every button and link does something real, or is removed, or is visibly labelled "Coming soon" with a `TODO` in code.
- **No links to pages that don't exist.**
- **Loading, empty and error states** on every data view.
- **Contrast** measured, not guessed. Focus visible. Keyboard works. 44px touch targets.
- **No em dashes** in UI text. No buzzwords ("seamless", "AI-powered", "next generation"). CTAs name the action ("Add student", not "Get started").
- **Every visual technique has a written purpose** (gradient, glow, shadow, badge, icon set, typeface).
- **Palette:** 2 to 3 core colours plus 1 accent; state colours only for states.
- **Run the Delivery Gate** before calling UI done, with evidence for each item, including a real browser click-through.

---

## 29. Definition of done

A feature is done when every item is true:

**Code**
- [ ] `npm run check` passes (typecheck, lint, format, unit tests, build)
- [ ] No `any`, no unexplained `as`, no `!` non-null assertions
- [ ] No `console.log`; errors handled or reported
- [ ] No duplicated business logic or API calls
- [ ] No unnecessary dependency added; any new one recorded with its reason
- [ ] Comments explain why, not what

**Behaviour**
- [ ] Loading, refreshing, empty, error and success states
- [ ] API errors shown in plain language, with retry where it makes sense
- [ ] Permissions considered in UI and enforced by the API
- [ ] Filters, sorting and pagination survive reload (URL state)
- [ ] Forms validate, show field errors, prevent double submit

**Quality**
- [ ] Unit tests for logic; component tests for user behaviour
- [ ] E2E updated if a critical flow changed
- [ ] Clicked through in a real browser with no console errors
- [ ] Phone, tablet and desktop checked; no horizontal page scroll
- [ ] Light and dark themes checked (if both ship)
- [ ] Keyboard-only use works; focus visible; contrast checked
- [ ] No obvious performance issue (bundle size checked after new dependencies)
- [ ] No invented data; unbuilt things labelled (antislop)

**Docs**
- [ ] `FRONTEND.md` status tables updated
- [ ] `DESIGN.md` updated if a visual rule changed

---

## 30. Code review checklist

| Area | Ask |
|---|---|
| Architecture | Does this logic live in the right layer and feature? Any cross-feature imports? |
| Types | Can any `any` or `as` go? Do types name domain concepts? |
| State | Is every piece of state necessary? Could it be derived, or live in the URL or the query cache? |
| Effects | Is each `useEffect` synchronising with something external? |
| API | Server data through TanStack Query? Query keys from the factory? Errors normalised? |
| UI states | Loading, empty, error, refreshing, submitting? |
| Forms | Labels, validation messages, double-submit protection, server errors mapped? |
| Accessibility | Semantic elements, labels, focus, keyboard, contrast, touch targets? |
| Responsive | Phone and tablet layouts designed, not squeezed? |
| Security | Unsafe HTML, open redirects, secrets, personal data in logs? |
| Performance | Heavy imports, large lists, unnecessary re-renders, missing lazy loading? |
| Tests | Behaviour covered? Tests query by role and label? |
| Design | Matches `DESIGN.md`? Any invented data, dead control or unexplained decoration? |
| Naming | Would a new teammate find this file and understand this name? |

---

## 31. Anti-patterns

**Architecture**
- 1,500-line components and pages
- API calls inside UI components
- One global store for everything (Redux, Zustand or Context)
- Server data copied into client state
- Giant `utils.ts`, `constants.ts`, `types.ts`
- Barrel files everywhere; features importing each other's internals
- Shared code importing feature code

**React**
- `useEffect` for derived values or event responses
- `useMemo` / `useCallback` / `React.memo` everywhere without measuring
- Array indexes as keys for changing lists
- Components defined inside components
- `<div onClick>` instead of `<button>`

**TypeScript**
- `any` everywhere; `as` instead of validation for untrusted data
- `!` non-null assertions to silence errors
- Generic type names: `Data`, `Item`, `Response`

**Data**
- Floating-point money maths
- Manually parsed `DD/MM/YYYY` dates
- Magic strings and magic numbers
- Filters kept in global state instead of the URL

**UX**
- Only a spinner; no empty or error state
- Colour as the only signal
- Hover-only features
- Mobile as an afterthought
- Fake data that looks real; buttons that do nothing

**Delivery**
- No tests, no CI, no single check command
- Secrets in `VITE_*` or in the repository
- Trusting frontend authorisation
- `console.log` in production
- Copying setup from outdated tutorials
- Installing a package for every small task
- Force-installing over peer-dependency conflicts

---

## 32. Templates: decision log, PR, kickoff

### Decision record (add to `FRONTEND.md`)

```markdown
### D<number>: <question>
- **Date:** 2026-09-14
- **Decision:** <what we chose>
- **Why:** <the reason in one or two lines>
- **Alternatives considered:** <options and why not>
- **Revisit when:** <condition that would change this>
```

### Project kickoff questions

1. What is the product, who uses it, and what is the one job of the main screen?
2. Which roles exist, and what can each do?
3. What does the backend provide: auth, error shape, pagination, dates, money, OpenAPI?
4. Which devices and browsers do users have?
5. Which languages, locale, time zone and currency?
6. Light, dark or both?
7. Brand direction for `DESIGN.md`: palette, type, personality, references, dials.
8. What must work at launch (critical flows for E2E)?
9. Performance budget and hosting target.
10. Is this a git repository, and does the team want hooks and CI now?

### `FRONTEND.md` skeleton for a new project

```markdown
# FRONTEND.md: <Product>

## 1. Stack (exact versions)
## 2. Decisions (D1, D2, ...)
## 3. Folder structure (only where it differs from BLUEPRINT.md)
## 4. Status: routing, layout, sidebar, navbar, components, utilities, theme
## 5. Performance budget and supported browsers
## 6. Build order (phases) and follow-ups
```

---

## 33. Learning path

Learn in layers; don't try to learn thirty packages at once.

| Level | Topics |
|---|---|
| 1. Foundation | HTML, CSS, JavaScript, TypeScript, React, Git |
| 2. Application | Vite, Tailwind, React Router, forms, API integration, TanStack Query |
| 3. Architecture | Feature folders, design systems, state management, error handling, auth, permissions |
| 4. Quality | ESLint, Prettier, Vitest, Testing Library, Playwright, Storybook, accessibility |
| 5. Production | Performance, security, CI/CD, monitoring, analytics, caching, deployment |
| 6. Senior | Architecture decisions, dependency strategy, profiling, scaling teams and codebases, code review, technical debt, observability, conventions |

### The path from requirement to production

```
Requirement → architecture → component design → types → API contract → state
  → UI → validation → error handling → accessibility → responsive design
  → testing → performance → security → CI → production → monitoring
```

React renders the UI, Vite builds it, Tailwind styles it. The architecture comes from how features, state, API boundaries, types, tests and delivery are organised. Keep that standard, and add packages only when a real requirement justifies them.
