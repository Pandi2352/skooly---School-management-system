# FRONTEND.md: School ERP (single school)

How the frontend is organised and built, and where each item on the setup checklist stands.

- **`DESIGN.md`** decides how the app looks: colours, type, spacing, dials.
- **This file** decides how the code is built: folders, routing, layout, components, utilities, quality rules.

Last reviewed: 2026-09-13 (after the phase 1 build).

**Status labels**

| Label | Meaning |
|---|---|
| **Done** | Built, type-checked, linted and in the code today |
| **Partial** | Started; the note says what is missing |
| **To do** | Not started; can be built now |
| **Blocked** | Needs something that doesn't exist yet (API, login, logo) |

---

## 1. Stack

| Tool | Version | Role |
|---|---|---|
| React | 19.2 | UI |
| TypeScript | 6.0, `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` | Types |
| Zod | 4.6 (`zod`) | Validates API responses and env variables; domain types come from schemas |
| Excel / PDF export | `write-excel-file` 4.1, `jspdf` 4.2 + `jspdf-autotable` 5.0 | Table exports (`src/lib/exportFiles.ts`). Loaded on click only, never in the initial bundle |
| Vite | 8.3 | Dev server and build |
| Tailwind CSS | 4.3 (`@tailwindcss/vite`) | Styling, utility classes only |
| React Router DOM | 7.18 (`react-router-dom`, data router) | Routing |
| TanStack Query | 5.102 (`@tanstack/react-query`) | Server state: caching, loading and error states, keep-previous-page |
| Radix UI | `radix-ui` 1.6 | Accessible primitives for Modal, Dropdown, Tooltip, Select, Tabs, Toast, Checkbox |
| Phosphor Icons | 2.1 (`@phosphor-icons/react`) | Icons |
| clsx + tailwind-merge | 2.1 / 3.7 | `cn()` |
| Source Sans 3 | `@fontsource-variable/source-sans-3` | Font, self-hosted |
| ESLint | 10, `typescript-eslint` strict + stylistic type-checked | Linting |
| Prettier | 3.9 + `prettier-plugin-tailwindcss` | Formatting, Tailwind class order |
| Vitest | 4.1 + Testing Library + jsdom | Tests |

Notes:
- **React Router DOM:** the app installs and imports `react-router-dom` (D9). In v7 it re-exports `react-router`, which npm installs underneath it; don't import from `react-router` directly.
- **Backend:** planned as a NestJS API. Nothing calls it yet; `src/lib/api/client.ts` is ready, and `src/features/students/api/getStudents.ts` shows where the first endpoint plugs in.

---

## 2. Decisions

| # | Question | Decision | Status |
|---|---|---|---|
| D1 | Icons: Lucide or Phosphor? | **Phosphor.** Its fill weight gives the solid look of the reference screenshot. antislop (R-04) flags Lucide chosen as the default look. | Decided |
| D2 | How does the NestJS API authenticate? | **Settled: httpOnly session cookie.** `modules/auth` issues it, `src/lib/api/client.ts` sends `credentials: 'include'`, and a 401 anywhere drops the cached session. | Done |
| D3 | Different menus per staff role (admin, teacher, accountant, front office)? | Recommended yes, chosen from the logged-in user. No Super Admin: the app runs one school. | Open |
| D4 | Headless component library | **Radix UI**, styled with Tailwind. | Decided |
| D5 | List URLs | **`/students`** for the list, `/students/new`, `/students/:studentId`, `/students/:studentId/edit`. | Decided |
| D6 | Locale and time zone | **`en-IN`, `Asia/Kolkata`, INR** (`src/lib/format.ts`). | Decided |
| D7 | Logo file | "School ERP" as text ("SE" when collapsed) until supplied. | Open |
| D8 | Git | Not a git repository for now (owner's choice). No hooks or lint-staged until it is. | Decided |
| D9 | `react-router` or `react-router-dom`? | **`react-router-dom`** (owner's choice, 2026-09-14). Every routing import uses it; ESLint `no-restricted-imports` blocks `react-router` and `react-router/dom`. | Decided |

---

## 3. Folder structure

```
src/
├── main.tsx                      Mounts <App /> and nothing else
├── app/                          Wiring: the only layer that knows every feature
│   ├── App.tsx                   <Providers> + <RouterProvider>
│   ├── Providers.tsx             Query client, theme, tooltips, toasts (auth later). Added only when used
│   ├── router.ts                 createBrowserRouter(routes)
│   ├── paths.ts                  Every URL, as constants and builders
│   ├── routes/                   One file per area, all pages lazy
│   │   ├── index.tsx             The tree: layout, error pages, redirects, 404
│   │   ├── dashboard.ts
│   │   ├── students.ts
│   │   ├── settings.tsx
│   │   └── planned.ts            "Not built yet" module and feature pages
│   ├── layouts/
│   │   ├── AppLayout.tsx         Sidebar + Navbar + <Outlet>
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx       Container: header, groups, footer
│   │   │   ├── SidebarGroup.tsx  A module row and its pages
│   │   │   ├── SidebarItem.tsx   A top-level link row with tooltip when collapsed
│   │   │   ├── SidebarFooter.tsx Settings link (account section after login)
│   │   │   ├── sidebarStyles.ts
│   │   │   └── Sidebar.test.tsx
│   │   └── navbar/
│   │       └── Navbar.tsx        Menu button, theme toggle, settings (no breadcrumbs)
│   └── theme/
│       ├── ThemeProvider.tsx     System / light / dark, saved in the browser
│       └── themeContext.ts
├── components/
│   ├── ui/                       Generic building blocks (section 9)
│   └── page/                     PageContainer, LoadingState, EmptyState, ErrorState, LinkList
├── features/                     One folder per ERP module, added as each is built
│   ├── dashboard/pages/DashboardPage.tsx
│   └── settings/pages/GeneralSettingsPage.tsx
├── pages/                        App-wide pages that belong to no feature
│   ├── NotFoundPage.tsx
│   ├── RouteErrorPage.tsx
│   ├── PlannedModulePage.tsx     "Not built yet" module overview
│   └── PlannedFeaturePage.tsx    "Not built yet" feature page
├── config/
│   ├── navigation.ts             Modules and pages (sidebar + placeholder routes)
│   ├── moduleIcons.ts
│   └── env.ts                    The only reader of import.meta.env
├── hooks/                        useMediaQuery, useTheme, useToast, useLocalStorage, useDisclosure, useDebounce, useOnlineStatus
├── lib/                          Plain functions, no React (section 10), each with a test
│   ├── api/                      client.ts (the only fetch), ApiError.ts, getErrorMessage.ts
│   └── query/queryClient.ts      TanStack Query defaults
├── types/env.d.ts                Typed VITE_ variables
├── styles/index.css              Tailwind import and theme tokens only
└── test/setup.ts                 jest-dom matchers, jsdom stubs
```

A feature folder, when built, follows this shape:

```
features/students/                     reference feature (skill: code-layers)
├── api/
│   ├── getStudents.ts                 infrastructure: the only data source
│   ├── studentKeys.ts                 query key factory
│   └── sample/                        labelled sample source + test (delete when the API exists)
├── hooks/
│   ├── useStudents.ts                 useQuery wrapper
│   └── useStudentFilters.ts           URL state: status, search, sort, page (+ test)
├── components/                        UI only: StudentFilters, StudentStatusTabs, StudentTable,
│                                      StudentRowActions, StudentsEmptyState
├── pages/StudentListPage.tsx          composition only
├── schemas/student.schema.ts          Zod: the API contract (+ test)
├── utils/studentStatus.ts             pure business rules (+ test)
├── types/student.types.ts
└── constants.ts
```

Three kinds of code stay apart: **UI** renders, **business logic** is pure and tested, **infrastructure** talks to the API, URL and browser. Pages only compose them.

### Rules
- **Feature code stays in its feature.** It moves to `components/`, `hooks/` or `lib/` only when a second feature needs it.
- **No imports between features.**
- **Pages are thin.** A page reads route params, calls data hooks, and arranges components.
- **One component per file,** named like the file. Files that export components export only components (Fast Refresh); shared class helpers go in a `*Styles.ts` file.
- **No barrel files** (`index.ts` re-exporting everything).
- **Imports use `@/`** for anything outside the current folder.

---

## 4. Code quality

### TypeScript
- `strict` and `noUncheckedIndexedAccess` are on: `list[0]` is typed as possibly `undefined`.
- `type` for props and data shapes (enforced by ESLint), named `ComponentNameProps`.
- No `any`. `unknown` for untrusted input (API responses, `localStorage`, `JSON.parse`), narrowed with a type guard.

### Naming

| Kind | Style | Example |
|---|---|---|
| Component file and name | PascalCase | `StudentTable.tsx` |
| Hook | camelCase, `use` prefix | `useDebounce.ts` |
| Utility or style helper file | camelCase | `format.ts`, `buttonStyles.ts` |
| Constant | camelCase, or UPPER_SNAKE for fixed keys | `paths`, `STORAGE_KEYS` |
| Route param | camelCase + `Id` | `:studentId` |
| Event prop | `on` + verb | `onSelect`, `onClose` |
| Test | next to the file, `.test.ts(x)` | `pagination.test.ts` |

### Components
- **Named exports** only. Lazy routes pick the named export (`src/app/routes/*`).
- **Variants** are object maps (see `buttonStyles.ts`, `Badge.tsx`).
- **Conditional classes** go through `cn()`.
- Pass `...props` through to the native element; React 19 passes `ref` as a prop, so Radix `asChild` works without `forwardRef`.
- A component that shows data handles **loading, empty and error** (antislop R-27). `Table` does this for you.

### Styling
- Tailwind classes only; `src/styles/index.css` holds only `@import`, `@theme` and `@variant`.
- Only `DESIGN.md` colours. A new colour goes in `DESIGN.md`, `src/styles/index.css` and the colour list in `src/lib/cn.ts`.
- No inline `style={{}}`, except for values computed at runtime.

### Comments
Comments explain **why**, not what. TODOs name their blocker: `// TODO(auth): … (FRONTEND.md D2)`.

### Tooling

| Tool | Status | Notes |
|---|---|---|
| Prettier + Tailwind plugin | **Done** | `.prettierrc.json`; Markdown files are left alone |
| `typescript-eslint` strict + stylistic type-checked | **Done** | Three rules tuned in `eslint.config.js`, each with its reason |
| Vitest + Testing Library | **Done** | 9 files, 33 tests |
| `eslint-plugin-jsx-a11y` | Blocked | Doesn't support ESLint 10 yet (peer dependency). Add when it does; until then tests query by role and label |
| Git hooks / lint-staged | Not now | See D8 |

### Scripts

| Script | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run typecheck` | `tsc -b` |
| `npm run lint` | ESLint |
| `npm run format` / `format:check` | Prettier write / check |
| `npm run test` / `test:run` | Vitest watch / single run |
| `npm run lint:fix` | ESLint with automatic fixes |
| `npm run check` | typecheck, lint, format check, tests and build in one go: "can this merge?" |
| `npm run build` | Type-check and production build |

### Definition of done (every change)
1. `npm run check` passes (typecheck, lint, format check, tests, build).
2. Clicked through in the browser with no console errors.
3. Checked at phone (390px), tablet (768px) and desktop (1280px).
4. Checked in light and dark themes.
5. Every control works by keyboard and shows a focus ring.
6. No invented data. Unbuilt things are labelled, not faked.

---

## 5. Routing

| Item | Status | Notes |
|---|---|---|
| Install React Router DOM | **Done** | `react-router-dom` 7.18 (D9) |
| Route files | **Done** | `src/app/routes/`: `index.tsx` holds the tree; each area has its own file |
| Route configuration | **Done** | `createBrowserRouter` in `src/app/router.ts`, rendered by `src/app/App.tsx` |
| App entry | **Done** | `src/main.tsx` only mounts `<App />` |
| Root route `/` | **Done** | Redirects to `/dashboard` |
| Dashboard route | **Done** | Module list only; real figures when the API serves them |
| Feature routes | **Partial** | Generic `/:moduleSlug` and `/:moduleSlug/:featureSlug` "Not built yet" pages. Each real feature adds its own routes above them |
| Students list | **Done** | `/students` "Student List":<br>• Filter panel: class, section, siblings, enrollment; Filter / Clear<br>• Records toolbar: Show (rows per page), copy, CSV, Excel (.xlsx), PDF, print, show/hide columns, Bulk Edit / Bulk Delete (enabled when rows are selected; coming soon), search<br>• Table or card view; plain column headers without sort controls (owner's choice). The `Table` component still supports sorting for other lists<br>• Shared pagination with rows per page<br>• Loading / refreshing / empty / filtered-empty / error states<br>• Everything in the URL except selection and hidden columns (saved in the browser)<br>• Bulk tools, edit and delete are listed under "Coming soon"<br>• Labelled sample rows until the API (`features/students/api/getStudents.ts`) |
| School Settings | **Done** | `/settings/school` (sidebar: System → Settings & Billing → School Settings):<br>• Section links on the left, kept in the URL (`?tab=`), plus a Quick guide<br>• School Profile form: general information and branding images (type and size checked, previewed)<br>• React Hook Form + Zod validation, required markers<br>• Save and discard with an unsaved-changes notice and a sticky footer<br>• System & Formats (`?tab=system`): school code, affiliation, currency, receipt template, and fee receipt, admission and roll number formats with live previews (`utils/sequenceFormat.ts`, tested)<br>• Other sections show "coming soon"<br>• Sample data with no page label (owner's choice, 2026-09-14; the save toast says it resets on reload); saving updates it for this session only until the API (`features/settings/api/updateSchoolProfile.ts`) |
| Backup Management | **Done** | `/backup-management` (sidebar: System → Backup Management; gear menu):<br>• Schedule notice from the saved schedule<br>• Available Backups: table or card view (`?view=grid`), count, create, download (not available with sample data, says so), delete with confirmation<br>• Off-site Copies: Telegram (bot token + chat ID) and Email destinations only for now; add dialog with validation, remove with confirmation<br>• Automation & Scheduling dialog: daily summary (time, Email/Telegram) and nightly backup time<br>• Labelled sample data in `features/backups/api/sample`; success messages say changes reset on reload |
| Template Gallery & Canvas Designer | **Done** | `/template-gallery` (sidebar: System → Template Gallery) and `/id-cards/card-designs` (ID Cards → Card Designs, ID cards only):<br>• Search and category chips in the URL; cards drawn from design data with plain HTML (`TemplatePreview`, no canvas)<br>• Start from Scratch by size, or open a template in the Canvas Designer<br>• Designer (`/template-gallery/designer?template=` or `?size=`, desktop only): **Konva + react-konva**, lazy-loaded in its own `canvas` chunk<br>• Designs are data in millimetres (`schemas/template.schema.ts`); fields are `{{tokens}}`, and Preview fills in labelled sample values<br>• Every edit goes through `utils/designReducer.ts` (tested), which gives undo/redo; shortcuts in `useDesignerShortcuts`; unsaved changes block leaving<br>• Starter templates are labelled sample data; saving a starter creates a custom copy; saved designs reset on reload<br>• Student ID Cards and Staff ID Cards stay "Not built yet"; HR's Staff ID Cards links to the ID Cards one |
| Student Admission | **Done** | `/students/new` (sidebar: Student Information → Student Admission; Student List → Admit Student). Its own feature folder, `features/admissions`:<br>• Seven steps (Academic, Personal Info, Parents, Health, Bank, Fees, Documents), step list (any step can be opened) and striped progress bar; one React Hook Form + Zod form, one schema object per step, so Next Step checks only that step<br>• Auto fills admission and roll numbers: counters from the admissions API, formats from School Settings → System & Formats via `features/settings/index.ts`; classes come via `features/students/index.ts`<br>• Rules as tested pure functions in `utils/` (steps, dates, rupees → paise, request body, document files)<br>• Customize Form (coming soon), How to Guide dialog, Bulk Upload (coming soon)<br>• Labelled sample data in `api/sample`; the success screen says nothing is sent to a server<br>• Shared from this work: `components/ui/SectionHeading` (moved from settings) and Input's `endAddon` |
| Custom Fields | **Done** | `/settings/custom-fields` (sidebar: System → Settings & Billing → Custom Fields; Student Admission → Customize Form → Custom fields). Feature folder `features/customFields`, shared through its `index.ts`:<br>• Table of fields in form order: move up/down, edit, delete (confirmed); Add / Edit dialog with label, type (short text, long text, number, date, dropdown with options one per line, tick box), placeholder, help text, required, shown on form<br>• Keys come from the first label (`birth_marks`) and never change<br>• Admission shows active fields under Additional details on the Documents step; `validateCustomValues` checks them on submit and `pickCustomValues` builds the answers (both tested)<br>• Labelled sample data in `api/sample`; success messages say changes reset on reload |
| Admission Settings | **Done** | `/admissions/settings` (sidebar: Admissions → Settings, and Settings & Billing → Admission Settings — one page in both menus). Frontend `features/admissionSettings`, backend `modules/admission-settings` (`GET`/`PATCH /admission-settings`, `PUT`/`DELETE /admission-settings/payment-qr`):<br>• Taking applications (on/off) and the academic session shown to families<br>• Application fee: amount, the note families read beside it, and the UPI QR code they scan. Charging a fee needs both an amount and a stored code, checked on the server too; removing the code switches the fee off<br>• The QR saves as soon as it is chosen (the fee switch depends on it); everything else saves together with Save / Discard and an unsaved-changes notice<br>• Uploads are checked by the file's real contents and must be at least 200px, so a printed code still scans; the old file is deleted only once the new one is recorded<br>• Custom public address (`/admission/<slug>`), unique in the database, previewed as it is typed<br>• The public form families fill in isn't built, so the API answers `publicPageLive: false` and the page says the address is reserved rather than offering a link, QR code or card that would lead nowhere |
| Roles & Permissions | **Done** | `/settings/roles` (sidebar: Administration and Settings & Billing → Roles & Permissions; gear menu). Feature folder `features/roles`:<br>• Role cards (System / Custom, permission count and share) beside a permission editor; the selected role is in the URL (`?role=`)<br>• Permissions come from `config/navigation.ts`: one row per page, grouped by module, with View / Create / Edit / Delete; new pages appear automatically (`buildPermissionCatalog`, tested)<br>• Create/Edit/Delete tick View; unticking View clears the row; tri-state module boxes; search, expand/collapse, allow/clear all<br>• Changes are a draft with a sticky Save / Discard bar; switching roles with unsaved changes asks first<br>• System roles can't be renamed or deleted; Administrator has locked full access; add role (optionally copying another role), edit details, delete custom roles<br>• Labelled sample data in `api/sample`; success messages say changes reset on reload |
| User Accounts | **Done** | `/users` and `/users/:userId` (sidebar: Administration → User Accounts). Frontend `features/users`, backend `modules/users`:<br>• List with search, status and role filters and paging, all kept in the URL; counts per status across the whole school<br>• Add an account with a role and either an emailed invitation link or a temporary password read out at the desk<br>• Edit details, change role, suspend / switch back on, archive, resend invitation, email a reset, set a temporary password, sign out every device<br>• Rules as pure functions in `utils/userRules.ts` (tested) and enforced again by the API: the last active administrator can't be suspended, archived or moved off the role, and nobody can do those to their own account<br>• Detail page shows the account, its role and where it is signed in |
| Audit Trail | **Done** | `/settings/audit-trail` (sidebar: Settings & Billing → Audit Trail). Frontend `features/audit`, backend `modules/audit` (`GET /audit`, `GET /users/:id/audit`):<br>• Sign-ins, wrong passwords, lockouts and every account change, newest first, with who did it and from which address<br>• Filter by period, event type or text, all kept in the URL; failed sign-ins and lockouts are marked “Attention”<br>• Each event shows both readings of its time — “15 minutes ago” and the exact moment<br>• Written once by the modules that cause them, never through a request; kept 400 days by a TTL index, and the page says so |
| Two-step sign-in | **Done** | `/account` → Two-step sign-in. Backend `modules/auth/two-factor.service.ts` (`GET/POST /auth/two-factor*`, `POST /auth/login/two-factor`, `DELETE /users/:id/two-factor`):<br>• Standard authenticator apps (TOTP, six digits, 30 seconds, one step of drift allowed); the QR code is drawn by the server so the seed never passes through the browser twice<br>• Seeds are encrypted with `TWO_FACTOR_KEY` (AES-256-GCM) because a code check needs to read them back; ten recovery codes are stored only as hashes and shown once<br>• Signing in pauses after the password for a short-lived, single-use handle, and a wrong code counts towards the same lockout as a wrong password<br>• Switching it off asks for the password; an administrator can switch it off for someone locked out of their phone, which ends their sessions and is recorded |
| Sign in & accounts | **Done** | `/login`, `/setup` (first run), `/forgot-password`, `/set-password`, `/reset-password`, `/account`, `/account/password`. Frontend `features/auth`, backend `modules/auth`:<br>• httpOnly cookie session (D2 confirmed): `/auth/login`, `/auth/me`, `/auth/logout`, `/auth/change-password`, `/auth/sessions`<br>• First run creates the school's first administrator; no password ships with the app<br>• Invitation and reset links are emailed and can be used once; an unknown email and a wrong password give the same answer<br>• `RequireAuth` guards the whole app layout, `RequirePermission` guards single pages, and the sidebar lists only pages the role can open<br>• A temporary password sends the person to `/account/password` until they choose their own |
| Branding | **Done** | `/settings/branding` (sidebar: Settings & Billing → Branding; School Settings links to it). Frontend `features/branding`, backend `modules/branding` (`GET /branding`, `GET /branding/asset-rules`, `PATCH /branding`, `PUT`/`DELETE /branding/assets/:assetType`):<br>• Name & wording (display name, short name, tagline, document footer) with Save / Discard; school colour theme (Navy / Blue) saved on click<br>• Five images (logo, favicon, principal signature, school seal, login background): upload by button or drag and drop, replace, remove; rules (types, size, min / recommended pixels, square) come from the server<br>• Checked in the browser before upload, and again on the server from the real file contents (magic bytes, pixel size, unsafe SVG content); files stored with UUID names through `FILE_STORAGE` (local disk, swappable) and served from `/uploads` with safe headers<br>• Live preview: browser tab, app header, login page, printed document header<br>• `BrandingSync` (in AppLayout) applies the school favicon and default colour theme app-wide; people can still choose their own colour in General settings |
| Settings route | **Done** | `/settings` → `/settings/general` (theme preference) |
| Profile route | Blocked (D2) | `/settings/profile` needs a logged-in user |
| 404 route | **Done** | `*` → `NotFoundPage`, inside the layout |
| Public routes | **Done** | `/login`, `/setup`, `/forgot-password`, `/set-password`, `/reset-password`, outside the app layout |
| Protected routes | **Done** | `RequireAuth` wraps the app layout and redirects to `/login?next=<path>` |
| Auth handling | **Done** | Session as a TanStack Query (`useSession`); no extra provider |
| Nested routes | **Done** | |
| Route-level layouts | **Partial** | `AppLayout` done; `AuthLayout` comes with login |
| Lazy loading | **Done** | Every page route uses `lazy` |
| Route error handling | **Done** | `RouteErrorPage` inside the layout for page errors; standalone version if the layout itself fails |
| Redirects | **Done** | `/` and `/settings` redirect; duplicate features redirect to their main page. After-login redirect comes with D2 |
| Active nav matching | **Done** | `NavLink` |
| Breadcrumbs | Removed | Owner's choice. `components/ui/Breadcrumb.tsx` stays available |

### Route tree

```
/                                   redirects to /dashboard
├── login                           (D2) public, AuthLayout
└── (AppLayout)                     (D2) protected
    ├── dashboard
    ├── settings                    redirects to /settings/general
    │   ├── general
    │   └── profile                 (D2)
    ├── students                    pattern for every real feature
    │   ├── (index)                 list
    │   ├── new
    │   └── :studentId
    │       ├── (index)             detail
    │       └── edit
    ├── :moduleSlug                 "Not built yet" module page
    │   └── :featureSlug            "Not built yet" feature page
    └── *                           NotFoundPage
```

Add paths to `paths.ts` first, then routes, then links using `paths.*`.

---

## 6. Layout

| Item | Status | Notes |
|---|---|---|
| `AppLayout.tsx` | **Done** | `src/app/layouts/AppLayout.tsx` |
| Sidebar, Navbar, main, `<Outlet>` | **Done** | |
| Full height, flex layout | **Done** | `min-h-dvh`, column offset by `ms-sidebar` |
| Content overflow | **Done** | Page scrolls; sidebar scrolls on its own; tables scroll inside their own box |
| No horizontal overflow | **Done** | `min-w-0`, `wrap-anywhere` on titles, `overflow-x-auto` on tables and tab lists |
| `PageContainer.tsx` | **Done** | Title (also sets the tab title), eyebrow, status, description, actions, `fullWidth` |
| Page padding and spacing | **Done** | `px-3` phone, `px-4` tablet, `px-5` desktop (tightened so lists use the width) |
| Pointer cursor | **Done** | Set once on `<body>` in `index.html`: buttons, `role=button`, tabs, menu items, select options, `label[for]` and `summary` get `cursor-pointer`; anything `:disabled` or `data-disabled` gets `cursor-not-allowed`. Covers portals. Links already show a pointer |
| Custom scrollbars | **Done** | Set once on `<html>` in `index.html`: thin, rounded, `control`-coloured thumb, transparent track, both themes. Sidebar keeps its navy thumb and hides the bar when collapsed |
| Wide tables | **Done** | Scroll inside their card. Page grids use `grid-cols-1` (`minmax(0, 1fr)`) and `min-w-0`, so a wide table can never widen the page |
| Max width | **Done** | `max-w-6xl`, opt out with `fullWidth` |
| Breadcrumb section | Removed | Owner's choice; feature pages link back to their module above the title |
| Sidebar fixed, navbar aligned | **Done** | Both headers `h-navbar` |
| Phone / tablet / desktop | **Done** | Drawer below 1024px; fixed, collapsible sidebar above |
| Loading layout | **Done** | `LoadingState`; route changes dim the page and set `aria-busy` |
| Error layout | **Done** | `ErrorState`, `RouteErrorPage` |
| Empty state layout | **Done** | `EmptyState` |

---

## 7. Sidebar

| Item | Status | Notes |
|---|---|---|
| Reusable `Sidebar.tsx` | **Done** | Split into Group, Item, Footer. No search box (owner's choice) |
| Application logo | Blocked (D7) | Text until supplied |
| Application name | **Done** | "School ERP"; "SE" when collapsed |
| Menu items | **Done** | Dashboard, then two sections from `navigation.ts`: **Modules** (school modules) and **System** (Settings & Billing: School Settings, Custom Fields, Roles & Permissions, Payment Gateway, Notification Settings, Admission Settings, Admission Form Fields, Audit Trail, Subscription, Subscription History, Module Settings, Content Safety; and Backup Management). A module's `section` decides its group; a module with no sub-pages (Backup Management) shows as a direct link with no caret |
| Icons | **Done** | Dashboard, Settings and every module. Sub-pages have none on purpose (74 small icons would hurt scanning) |
| Active route highlight | **Done** | Text only: the current page is amber and bold; its module gets a filled amber icon. No background box |
| Footer section | **Done** | Settings link |
| User profile / account | Blocked (D2) | Goes in the footer |
| Logout | Blocked (D2) | Footer and navbar user menu |
| Expand / collapse | **Done** | Navbar hamburger; saved in the browser |
| Icon-only mode | **Done** | `w-sidebar-collapsed` |
| Tooltips when collapsed | **Done** | Radix tooltip on hover and keyboard focus |
| Active menu from URL | **Done** | |
| Nested menus / open and close | **Done** | `aria-expanded` |
| Scroll handling | **Done** | Nav scrolls under a fixed header; current page scrolled into view on load |
| Keep state while navigating | **Done** | Collapsed state saved; open groups kept while the app is open |
| Mobile drawer | **Done** | Escape, Close button or backdrop; background inert |
| Close on mobile navigation | **Done** | Focus moves to the page |
| Design: theme, icon size, item height, states, transitions, shadows, radius | **Done** | 18px icons, 14px module labels and 13px page labels, rows 36px with a mouse and 44px on touch screens, 40px square icons centred in the collapsed strip with its scrollbar hidden, 150ms transitions off for reduced motion, shadow only on the open drawer, `rounded-md` |

---

## 8. Navbar

| Item | Status | Notes |
|---|---|---|
| Reusable `Navbar.tsx` | **Done** | |
| Mobile sidebar toggle | **Done** | Visible "Menu" label below desktop |
| Breadcrumbs | Removed | Owner's choice |
| Page title | **Done** | Page `<h1>` and browser tab; not repeated in the navbar |
| Settings shortcut | **Done** | Gear icon with tooltip |
| Theme toggle | **Done** | Sun / moon with tooltip |
| Search input | Blocked (API) | Not in the sidebar (owner's choice). Page and record search later as a `Ctrl+K` window |
| Notifications icon and dropdown | Blocked (API) | No icon or dot until real notifications exist |
| User avatar, profile dropdown, logout | Blocked (D2) | `Dropdown`, `getInitials` ready |
| Sticky, responsive, no overlap | **Done** | `sticky top-0` |

---

## 9. Common UI components

In `src/components/ui/` unless noted. All use `DESIGN.md` tokens, pass native props through, show a focus ring and meet 44px touch height.

| Component | Status | Built on | Handles |
|---|---|---|---|
| Button | **Done** | `<button>` | primary / secondary / ghost / danger; `md` / `sm`; `loading`; `type="button"` default. Tested |
| IconButton | **Done** | `<button>` | Required `label` for the accessible name |
| `buttonClasses` / `iconButtonClasses` | **Done** | | Make links look like buttons |
| Input | **Done** | `<input>` | Visible or hidden label, hint, error via `aria-describedby`, `aria-invalid` |
| SearchInput | **Done** | `Input` | The search field for every list: icon, hidden label, `onValueChange`. Fills its container; lists give it `w-full lg:w-80 xl:w-96` |
| Select | **Done** | Radix Select | Label, hint, error, keyboard, placeholder |
| Checkbox | **Done** | Radix Checkbox | Label click, hint, indeterminate, `hideLabel` for table rows |
| Dialog | **Done** | Radix Dialog | Focus trap, Escape, focus return, sizes, footer (was `Modal`) |
| Drawer | **Done** | Radix Dialog | Side panel from the start or end edge, same focus behaviour |
| Popover | **Done** | Radix Popover | Interactive floating content; stays inside the viewport |
| Textarea | **Done** | `<textarea>` | Label, hint, error, vertical resize |
| RadioGroup | **Done** | Radix RadioGroup | Group label, arrow keys, 44px rows, hint, error |
| Switch | **Done** | Radix Switch | Settings that apply immediately; label and hint |
| Avatar | **Done** | Radix Avatar | Photo with initials fallback from a real name; `sm` / `md` / `lg` |
| Alert | **Done** | `<div role>` | info / warning / danger; danger announced as `alert` |
| ConfirmDialog | **Done** | Radix AlertDialog | Cancel focused first; async `onConfirm` with loading |
| Dropdown | **Done** | Radix DropdownMenu | Items with icon, danger tone, label, separator, checkbox items that keep the menu open |
| Tooltip | **Done** | Radix Tooltip | Hover and focus; `disabled` passthrough |
| Badge | **Done** | `<span>` | neutral / planned / primary / danger |
| Card | **Done** | `<section>` | Title (labels the section), description, actions |
| Table | **Done** | `<table>` | Caption, own horizontal scroll, loading / error / empty rows, sortable headers with `aria-sort`, row selection with select-all (indeterminate), prints without scroll clipping |
| Pagination | **Done** | `<nav>` | Shared by every list: "Showing x to y of z", optional rows-per-page picker, page list with gaps, `aria-current`, previous / next (icon-only on phones) |
| Tabs | **Done** | Radix Tabs | Controlled or uncontrolled, scrolls on narrow screens |
| Breadcrumb | **Done** | `<nav><ol>` | Generic; not used since breadcrumbs were removed |
| Toast | **Done** | Radix Toast | `useToast()`; info closes after 5s, errors stay until dismissed |
| Spinner | **Done** | Phosphor | Always paired with text |
| Skeleton | **Done** | `<div>` | `aria-hidden`; pair with a text status |
| PageContainer, LoadingState, EmptyState, ErrorState, LinkList | **Done** | `components/page/` | |

### Libraries to add when first needed

| Library | For | Add when |
|---|---|---|
| `@tanstack/react-query` | Caching, loading and error states for API data | **Added** (Students list) |
| `react-hook-form` + `zod` | Forms and validation | First form |
| `@tanstack/react-table` | Sorting, filtering | First table that needs them |

---

## 10. Utilities and hooks

### `src/lib/`

| File | Exports | Status |
|---|---|---|
| `cn.ts` | `cn()` (knows the DESIGN.md colour and spacing names) | **Done**, tested |
| `slugify.ts` | `slugify()` | **Done**, tested |
| `storage.ts` | `readStorage`, `writeStorage`, `removeStorage` (never throw) | **Done** |
| `storageKeys.ts` | `STORAGE_KEYS` (the inline theme script in `index.html` shares `theme`) | **Done** |
| `format.ts` | `formatDate`, `formatDateTime`, `formatNumber`, `formatCurrency` (`en-IN`, IST, INR) | **Done**, tested |
| `pagination.ts` | `getPageList()` | **Done**, tested |
| `api/ApiError.ts` | `ApiError` with `status` and NestJS `messages` | **Done**, tested |
| `api/client.ts` | `api.get/post/put/patch/delete<T>()`: base URL, JSON, cookies, 15s timeout, `ApiError`. Only feature `api/` files call it | **Done**, unused until the first endpoint |
| `api/getErrorMessage.ts` | Plain-language message for any error | **Done** |
| `query/queryClient.ts` | TanStack Query defaults: 30s stale time, no retry on 4xx | **Done** |
| `getInitials.ts` | `getInitials()` | **Done**, tested |
| `assert.ts` | `invariant()`, `assertNever()` | **Done** |
| `logger.ts` | `logger.debug/warn/error`, `installGlobalErrorLogging()` (uncaught errors and rejections). The only console user | **Done**; monitoring (Sentry or similar) to plug in before production |
| `format.ts` → `formatMoney` | Integer paise → "₹1,23,456.00" | **Done**, tested. Confirm the money format with the API |

### `src/config/env.ts`
Reads `VITE_API_URL`. It's optional until the first API call; the API client then throws a clear message if it's missing. Copy `.env.example` to `.env`.

### `src/hooks/`

| Hook | Status | Purpose |
|---|---|---|
| `useMediaQuery` | **Done** | Matches a CSS media query |
| `useTheme` | **Done** | `preference` (system / light / dark), resolved `theme`, `setPreference` |
| `useToast` | **Done** | `toast({ title, description, tone })` |
| `useLocalStorage` | **Done** | `useState` saved as JSON, with a validity guard |
| `useDisclosure` | **Done** | `isOpen`, `open`, `close`, `toggle` |
| `useDebounce` | **Done** | Value after it stops changing |
| `useSession` | **Done** | The signed-in person, their role and their permissions |

Page titles come from `PageContainer` (React 19 `<title>`), so no title hook is needed.

---

## 11. Theme and styling

| Item | Status | Where / value |
|---|---|---|
| Primary colour | **Done** | `primary` |
| Secondary colour | **Done** | The single accent `accent` (amber). No separate secondary: antislop R-29 |
| State colour | **Done** | `danger`, for errors only |
| Background, text, border colours | **Done** | `canvas` `surface` `side` / `ink` `ink-muted` / `line` `control` |
| Font family | **Done** | Source Sans 3 |
| Border radius | **Done** | `rounded-md` controls and panels, `rounded-sm` badges and menu items |
| Spacing system | **Done** | Tailwind's 4px scale |
| Sidebar width | **Done** | `w-sidebar`, `w-sidebar-collapsed` |
| Navbar height | **Done** | `h-navbar` |
| Breakpoints | **Done** | `sm` 40rem, `lg` 64rem |
| Dark mode | **Done** | System / light / dark; `data-theme` on `<html>` |
| Centralised styles | **Done** | Tokens in `@theme`; shared classes in components and `*Styles.ts` |

---

## 12. Build order

### Phase 1: foundation. **Done** (2026-09-13)
Strict TypeScript, `@/` alias, Prettier, strict lint, Vitest; folder structure; `lib/` and hooks; data router with lazy pages and error pages; `PageContainer`; all components in section 9; sidebar tooltips, footer and scroll-into-view; layout tokens; settings page.

### Follow-ups from phase 1
- **Browser click-through** of the new layout, dialogs and menus (not done yet).
- **Main bundle was 521 kB** (Vite warns above 500 kB). Vendor code is now split into `react`, `router`, `radix` and `data` chunks in `vite.config.ts`; confirm the sizes on the next build.
- **`eslint-plugin-jsx-a11y`** once it supports ESLint 10.

### Phase 2: login (needs D2, D3 and the NestJS auth endpoints)
`AuthLayout`, `LoginPage`, `AuthProvider` + `useAuth`, `RequireAuth`, sidebar account section, navbar user menu, logout, profile route, menu per role.

### Phase 3: first real module
TanStack Query, react-hook-form + zod; build one module end to end (Students or Admissions) as the pattern for the rest.

### Phase 4: platform features
Notifications, record search (`Ctrl+K`), translations if needed, dashboard with real figures.

---

## 13. BLUEPRINT.md check

Checked against `BLUEPRINT.md` on 2026-09-14. **Done** items are in the code; the rest say why they wait.

| Blueprint area | Status | Where / why |
|---|---|---|
| Feature folders, three kinds of code (1, 4) | **Done** | `src/features/students` is the reference; skill `code-layers` |
| Boring entry, providers, router, lazy routes (7) | **Done** | `main.tsx`, `app/App.tsx`, `app/Providers.tsx`, `app/router.ts`, `app/routes/*` |
| State decision tree (8) | **Done** | TanStack Query for server data, URL for filters, `useState` locally, Context for theme |
| API client, `ApiError`, query client, query keys, hooks (9) | **Done** | `lib/api/*`, `lib/query/queryClient.ts`, `features/students/api` + `hooks` |
| Zod at the boundary, env validation (6, 9.5) | **Done** | `api.get(path, schema)`, `features/students/schemas`, `config/env.ts` |
| Strict TypeScript (6) | **Done** | `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` |
| Components and `components/ui` primitives (11) | **Done** | 26 primitives and composites; section 9 |
| Tokens, `cn`, Tailwind rules (12) | **Done** | `styles/index.css`, `lib/cn.ts` |
| Page states, tables, filters in URL (13, 14) | **Done** | Students list: loading, refreshing, empty, filtered-empty, error, pagination |
| Offline state (13.1) | **Done** | `useOnlineStatus` + warning in `AppLayout` |
| Route errors and 404 (16) | **Done** | `RouteErrorPage` (now logged), `NotFoundPage` |
| Logging, `no-console` (26) | **Done** | `lib/logger.ts`, ESLint rule |
| Money in minor units, dates via `Intl` (21) | **Done** | `formatMoney`, `formatDate` |
| Scripts incl. `npm run check`, `.nvmrc` (23) | **Done** | `package.json`, Node 20.19 |
| Unit + component + page tests, render helper (22) | **Done** | `src/test/render.tsx`, `StudentListPage.test.tsx` |
| Vendor chunk splitting (20) | **Done**, unmeasured | `vite.config.ts`; verify on next build |
| Forms: React Hook Form + Zod (10) | Waiting | No form exists yet. Install with the first form (admission or add student) |
| Auth, guards, 401/403 screens, permissions (15) | Blocked (D2) | Needs the NestJS login endpoints |
| MSW for API-mocked tests (22) | Waiting | Add with the first real endpoint |
| Playwright E2E (22.5) | Waiting | Add with the first critical flow backed by the API (login, admission) |
| Coverage script (23) | Waiting | Needs `@vitest/coverage-v8`; add when coverage is tracked |
| `eslint-plugin-jsx-a11y` (6) | Blocked | No ESLint 10 support yet |
| Husky, lint-staged, CI, PR template (23, 24) | Not now (D8) | Not a git repository |
| Monitoring (Sentry or similar) (26) | Waiting | Before the first production release; hook point is `logger.error` |
| Storybook (22.6) | Not needed | Single app; revisit if components are shared across projects |
| i18n (26) | Not needed | English only for now; copy is kept out of business logic, CSS uses logical properties |

### Performance budget and browsers (proposed; confirm with the owner)

| Item | Proposal |
|---|---|
| Initial JavaScript (gzip) | ≤ 200 KB for the first route |
| Largest chunk | ≤ 500 KB minified |
| LCP / INP / CLS | ≤ 2.5 s / ≤ 200 ms / ≤ 0.1 on a mid-range Android phone |
| Browsers | Last 2 versions of Chrome, Edge, Firefox, Safari; Android WebView used by the school's staff devices |
