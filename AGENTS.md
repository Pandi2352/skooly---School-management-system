<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, load the antislop skill for the task:
- Core filter, always on: `antislop`
- Code comments: `antislop-code`
- Mobile / responsive: `antislop-layoutmobile`
- People: `antislop-human`
- Copy & text: `antislop-copywriting`
- UI / visual: `antislop-ui`
Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->

## Project
School ERP web app for a single school (React 19 + Vite + react-router-dom + Tailwind CSS v4).
- Routing imports always come from `react-router-dom`, never `react-router` or `react-router/dom` (ESLint enforces it).
- Style with Tailwind classes using the DESIGN.md tokens (bg-canvas, text-ink, bg-side...). The default Tailwind palette is disabled on purpose.
- BLUEPRINT.md is the general engineering standard for all our React + Vite projects. FRONTEND.md and DESIGN.md override it for this project.
- Read DESIGN.md before any UI work; it is the design direction.
- Read FRONTEND.md before adding files, routes, components or utilities; it defines folders, conventions and the build order. Update its status tables when an item changes.
- Code layers (read .agents/skills/code-layers/SKILL.md before feature work): UI components only render; business rules are pure functions in features/*/utils with tests; infrastructure (API functions, query keys, TanStack Query hooks, URL filter hooks) lives in features/*/api and features/*/hooks. Pages only compose. No fetch, useEffect data loading or business conditions inside components. src/features/students is the reference.
- Types: strict tsconfig stays strict; no `any`, no `as` to claim a type. API responses are parsed with a Zod schema (features/*/schemas) through `api.get(path, schema)`; domain types come from `z.infer`. No vague type names (Data, Item, Response).
- Components: components/ui is domain-free primitives only; feature components live in features/*/components; pages compose. Split at a second responsibility or ~200 lines, but don't make one-line components.
- Pages and sidebar come from src/config/navigation.ts; routes live in src/app/routes/ (one file per area) and URLs in src/app/paths.ts. main.tsx only mounts <App />; global providers go in src/app/Providers.tsx. Unbuilt pages keep the "Not built yet" label.
- Before calling work done: npm run typecheck, npm run lint, npm run test:run, npm run build.
- No invented data: numbers, names and schools come from a real API or a labelled placeholder.
