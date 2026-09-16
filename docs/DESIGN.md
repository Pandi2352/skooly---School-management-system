# DESIGN.md: School ERP

Design direction for antislop. Answers come from the product owner (2026-09-13). Anything not yet decided is marked `[TBD]`.

Dial: ENERGY 1 / RHYTHM 1 / MOTION 1

## Identity

- **Product:** School ERP, a management system for one school (changed from multi-school on 2026-09-13).
- **Users:** school staff who keep it open all day: administrators, front office, teachers, accountants, HR. Parents, students and drivers get separate apps (module 11) and aren't covered by this web layout.
- **Main job of the web app:** reach any module in one or two clicks, then read and enter data quickly.
- **Personality:** calm, dense, predictable. It's a work tool, not a marketing site.
- **Avoid:** marketing-style panels, decorative gradients, dashboards filled with invented numbers.

## Palette

Navy is the core colour and amber is the only accent. Neutral greys aren't counted as colours. Every text pair below was measured with the antislop contrast checker.

Token names are the Tailwind colour names (`canvas` gives `bg-canvas`, `text-canvas`...).

| Token | Light | Dark | Use |
|---|---|---|---|
| `canvas` | `#f5f6f8` | `#0d131d` | page background |
| `surface` | `#ffffff` | `#151d2a` | top bar, panels, inputs |
| `ink` | `#1a2233` | `#e6ebf2` | body text (14.7:1 / 15.5:1) |
| `ink-muted` | `#525c6b` | `#a1acbd` | secondary text (6.3:1 / 7.4:1) |
| `line` | `#d8dce3` | `#2a3445` | dividers (decorative) |
| `control` | `#8a94a3` | `#6b778a` | input and button edges on `surface` (3.1:1 / 3.7:1). Below 3:1 on `canvas`, so controls sit on `surface`. Also the scrollbar thumb everywhere except the sidebar |
| `field` | `#ced4da` | `#3a4557` | light edge of text inputs, selects and textareas (owner's choice, 2026-09-14; about 1.5:1, below the 3:1 of antislop/WCAG 1.4.11). Fields stay recognisable by their label above and white fill, and focus turns the edge `primary` |
| `primary` | `#1f3a5f` | `#9bbbe6` | links, primary buttons, focus ring in content, highlighted menu item |
| `danger` | `#b42318` | `#f97066` | error text, danger buttons (6.6:1 / 6.1:1). Functional state colour, never decoration |
| `danger-soft` | `#fde8e7` | `#3a1a18` | background of danger badges, e.g. fee due (text 5.6:1 / 5.6:1) |
| `success` / `success-soft` | `#166534` / `#dcfce7` | `#6ee7a0` / `#0f2a1c` | "Studying" status and nothing-due fee pills (6.5:1 / 9.9:1). State only, never decoration |
| `table-head` | `#eef1f5` | `#19243a` | table header row, with `primary` text (10.1:1 / 7.9:1) and a 1px `line` bottom border |
| `side` | `#13233b` | `#0a101a` | sidebar |
| `side-ink` | `#e8edf4` | `#e6ebf2` | sidebar links (13.4:1 / 15.9:1) |
| `side-muted` | `#a7b4c6` | `#97a4b7` | sidebar labels, icons, placeholder (7.5:1 / 7.5:1) |
| `side-hover` | `#1d3252` | `#162235` | sidebar hover |
| `side-active` | `#243d61` | `#1c2b42` | pressed state in sidebar |
| `side-input` / `side-input-line` | `#0e1b2e` / `#6b7d98` | `#070b12` / `#64748d` | `side-input-line` colours the sidebar scrollbar; `side-input` is kept for a future sidebar field |
| `side-line` | white 8% | white 6% | sidebar dividers (decorative) |
| `accent` | `#f0a500` | `#f5b52e` | amber: where you are, and the sidebar focus ring |
| `status` / `status-ink` | `#fdf1d6` / `#7a4d00` | `#33270f` / `#f5c863` | "Not built yet" label (6.5:1 / 9.3:1) |
| `backdrop` | navy 50% | black 60% | behind the mobile drawer and dialogs |

Tooltips use `ink` on `canvas` reversed (14.7:1 / 15.5:1).

**Colour themes** (owner's request, 2026-09-14). The Settings menu (gear in the navbar) and General Settings let each user pick a colour theme, saved in the browser (`erp-color-theme`, set before first paint by `index.html` as `data-color` on `<html>`). A theme only redefines `primary` and `table-head` in `src/styles/index.css`, so every button, link, heading, focus ring, checkbox and table header follows it. The sidebar (`side-*`) and amber `accent` never change.

| Theme | `primary` light / dark | `table-head` light / dark | Contrast |
|---|---|---|---|
| Navy (default) | `#1f3a5f` / `#9bbbe6` | `#eef1f5` / `#19243a` | see the token table |
| Blue | `#0060df` / `#7ab8ff` | `#eaf2fe` / `#16263d` | 5.6:1 on `surface`, 5.0:1 on `table-head` / 8.2:1, 7.4:1 |

The reference blue `#007bff` measures 4.0:1 on white, below 4.5:1 for text, so the Blue theme uses the slightly deeper `#0060df`.

Amber only marks where you are: the icon of the current module, the bold text of the current page (no background box or side bar), and the sidebar focus ring. Amber text measures 7.6:1 on the sidebar and 6.2:1 on hover. Each shows real state, so none of it is decoration.

## Typography

- **Family:** Source Sans 3 (variable, self-hosted via `@fontsource-variable/source-sans-3`). **Why:** a humanist sans-serif that stays readable at small sizes in dense tables and forms, and it's in the Noto/Adobe family, with scripts for Indian languages available if needed later.
- **Scale:** in rem, so it respects the browser's font-size setting.
  - Root size is 93.75% (15px) on mouse screens, for denser ERP screens, and 100% on touch screens.
  - Body 1rem, controls and table text 0.875rem, table headers and badges 0.8125rem, card titles 1rem, page title `clamp(1.375rem, 1.2rem + 0.5vw, 1.625rem)`, bold (about 21 to 24px; owner's choice, 2026-09-14). Form labels are bold 0.875rem.
- **Control sizes:**
  - Mouse screens: buttons, inputs and selects are `h-10` (about 38px), small buttons `h-8`, table rows about 40px.
  - Touch screens: every control stays at least 44px (`pointer-coarse:`).
  - The navbar is 3.5rem.
- **Weights:** 400 for body, 600 for headings and the current page. No uppercase labels with wide letter-spacing.

## Layout

- **Shell:** navy sidebar on the left, white top bar, content area on the grey background. **Why:** there are 13 modules and 74 feature pages, and a vertical list is the only pattern that can hold them and stay scannable.
- **Sidebar** (structure follows the owner's reference screenshot):
  - a 64px name row lined up with the top bar (text name, no logo until one is supplied)
  - an Overview link, then a "Modules" label in sentence case
  - 13 module rows, each with an icon and an arrow that turns when open. Sub-pages hang off a thin guide line, and the group holding the current page opens automatically.
- **Collapsed sidebar (desktop):** the hamburger shrinks the sidebar to a 4.5rem icon strip, and the choice is remembered. Clicking a module icon expands it again. No search box in the sidebar (owner's choice, 2026-09-13).
- **Top bar:** hamburger (collapses the sidebar on desktop, opens the drawer below it, with a visible "Menu" label on smaller screens), theme toggle, settings. No breadcrumbs (owner's choice); the page heading says where you are.
- **Tables** (pattern: the Students list):
  - search, sort and status tabs with counts sit above the table, in one surface card
  - header row on `table-head` with bold, uppercase, `primary` labels, a single 1px `line` bottom border and no sort controls (owner's choice, 2026-09-14; noted against antislop R-06), and rows split by `line` dividers with no zebra stripes
  - status and money cells: Studying green, admission pending amber, left grey; total assigned a grey chip; total due a green pill at ₹0 and a red pill when owed, never wrapping
  - the main field (name) in bold with a muted second line; IDs and phone numbers in tabular digits
  - status badges get colour only when they need attention (`Pending` and `Due` in amber tones, `Overdue` in danger); normal states stay neutral
  - a three-dot row menu instead of a coloured "Manage" button on every row
  - pagination under the table
- **Left out on purpose:** language picker, settings, apps grid and user avatar from the reference. None has a real function yet, so each is added when it does (R-26, R-23).
- **Icons:** Phosphor, regular weight, with fill on the current module. **Why:** its filled weight gives the solid look of the reference without making every glyph identical, and each icon names what its module manages (building, graduation cap, bus...).
- **Widths:**
  - under 640px (phone): the sidebar is a drawer from the left, up to 14rem wide
  - 640 to 1023px (tablet): drawer, with wider content padding
  - 1024px and up (desktop): the sidebar stays open at 14rem, or 4.5rem when collapsed. Long module names wrap to two lines rather than being cut off
- **Spacing scale:** 4, 8, 12, 16, 24, 32px.
- **Radius:** 6px on controls and panels, nothing pill-shaped.
- **Shadow:** only on the open mobile drawer, because it sits above the page.

## Implementation

- **Styling:** Tailwind CSS v4 through `@tailwindcss/vite`, utility classes only. `src/styles/index.css` holds nothing but Tailwind directives: the tokens above in `@theme` (`bg-canvas`, `text-ink`, `bg-side`, `bg-accent`, and so on) and their dark values under `@variant dark`. No hand-written selectors or rules.
- **Palette lock:** Tailwind's default colours are switched off (`--color-*: initial`), so a class like `bg-blue-500` produces nothing. Add a colour to `DESIGN.md` first, then to `src/styles/index.css` and the colour list in `src/lib/cn.ts`.
- **Layout sizes:** `w-sidebar` (14rem), `w-sidebar-collapsed` (4.5rem), `h-navbar` (4rem), defined in `@theme`.
- **Components:** built on Radix primitives (keyboard and focus handling), styled with these tokens. See `FRONTEND.md` section 9.
- **Breakpoints:** Tailwind defaults, `sm` (40rem) for tablet and `lg` (64rem) for desktop.

## Motion

- Hover and focus changes only.
- The drawer slides in over 150ms so it's clear where it came from, and doesn't animate if the user has `prefers-reduced-motion` set.

## Theme

- Light by default, with a working dark toggle. The first visit follows the OS setting, and the user's choice is saved in the browser.

## Navigation structure

Taken from the owner's feature list: 13 modules, each with feature pages.

The sidebar, collapsed-strip tooltips and breadcrumbs use a **short name** ("Finance", "Exams", "Bus Tracking"), so labels fit on one line. Page titles keep the full name from the feature list ("Fees & Finance", "Online Exams"). URLs come from the full name, so renaming a short label never breaks a link. Short names live in `src/config/navigation.ts`. The sub-features in the list are shown on each feature page as planned capabilities.

Pages that aren't built yet show a visible "Not built yet" label, so no link leads nowhere.

## Open questions

1. **Duplicate features.** These appear in two modules each. For now the entry under AI tools links to the page in the first module:
   - Fee Defaulter Predictor (Fees & Finance, AI)
   - Route Optimizer (Transport, AI)
   - Student Risk Analytics (Attendance, AI)
   - Driver Mobile App (Transport, Apps)
2. **Ambiguous grouping.** The list has no clear parent for these, so these groupings are guesses to confirm:
   - "SMS Alerts / Email Alerts / Bulk SMS / Email Campaigns / Event-Triggered Notifications" are grouped as one page, **SMS & Email Alerts**.
   - "Supplier Management / Vendor Management / Vendor Registry / Purchase Orders" are grouped as **Vendor Management**.
   - "Transport Management" is treated as the module name, not a page.
3. **Module name.** "AI-Powered Features" is shown as **AI Tools**, because antislop flags "AI Powered" as a buzzword (R-16). Rename if you prefer.
4. **Roles.** Should admins, teachers, accountants and front office see different sidebars? `[TBD]`
5. **School switcher.** Not needed: the app manages one school.
6. **Logo.** Shown as text until one is supplied. `[TBD]`
