# Migrate PriceAI → React SPA (Vite + React Router)

Goal: Produce a static SPA build (`dist/index.html` + `dist/assets/*`) that AWS Amplify Static Hosting can serve, while keeping every existing screen, flow, and API integration intact.

> Important: This is a framework-level migration. The current app uses TanStack Start (SSR, file-based routes, `__root.tsx`, `routeTree.gen.ts`, server functions, Cloudflare worker config). Converting it changes the build pipeline, entry points, routing layer, and project config — but page components, components/ui, API service files, styles, and business logic are preserved as-is.

## Scope

In scope
- Replace TanStack Start + TanStack Router with **Vite + React 19 + React Router v6**.
- Keep all current pages: Auth, Dashboard (`/`), Pricing, Inventory, Analytics, Upload.
- Keep `AppSidebar`, top navbar (search, notifications, profile dropdown), dark theme, sidebar UI primitives.
- Keep all `src/api/*` service files and `src/components/*` (RegionalPerformance, UploadDatasetButton, StatCard, ui/*, etc.) untouched in behavior.
- Keep `src/lib/session.ts` localStorage-based auth + protected-route gating.
- Keep Tailwind v4 + `src/styles.css` design tokens exactly.
- Output: static `dist/` only — no `dist/server`, no SSR entry.

Out of scope
- No new features, no redesign, no API contract changes.
- No backend changes.
- No PWA / SW / i18n additions.

## Target structure

```text
index.html                     # Vite SPA entry (was missing under TanStack)
vite.config.ts                 # plain @vitejs/plugin-react + tailwindcss
src/
  main.tsx                     # ReactDOM.createRoot + <BrowserRouter>
  App.tsx                      # <Routes> + <ProtectedLayout>
  routes/                      # KEPT as plain page components (no createFileRoute)
    auth.tsx
    index.tsx                  # Dashboard
    pricing.tsx
    inventory.tsx
    analytics.tsx
    upload.tsx
  components/                  # unchanged
  api/                         # unchanged
  lib/session.ts               # unchanged
  styles.css                   # unchanged
```

Deleted: `src/router.tsx`, `src/routeTree.gen.ts`, `src/routes/__root.tsx`, `src/start.ts` (if present), `wrangler.jsonc`, any `app/routes/api/*`, `src/integrations/supabase/*.server.ts` & middleware files (none used by UI).

## Migration steps

1. **Dependencies**
   - Remove: `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-router-devtools`, `@lovable.dev/vite-tanstack-config`, `@cloudflare/*`, `wrangler`.
   - Add: `react-router-dom@^6`, `@vitejs/plugin-react`, `vite@^7`, `@tailwindcss/vite`.

2. **Build config**
   - New `vite.config.ts`: `defineConfig({ plugins: [react(), tailwindcss()], resolve: { alias: { '@': '/src' } }, build: { outDir: 'dist' } })`.
   - New root `index.html` with `<div id="root">` + `<script type="module" src="/src/main.tsx">`.
   - Add `_redirects` (or `amplify.yml` rewrite) so SPA deep links resolve to `index.html` on Amplify.

3. **Entry + routing**
   - `src/main.tsx`: mount `<BrowserRouter><App/></BrowserRouter>`, import `./styles.css`.
   - `src/App.tsx`: define routes:
     - `/auth` → `<Auth/>` (no chrome)
     - everything else wrapped in `<ProtectedLayout>` (renders `AppSidebar` + header + `<Outlet/>`)
     - `/` Dashboard, `/pricing`, `/inventory`, `/analytics`, `/upload`, `*` → NotFound
   - `ProtectedLayout` reads `getUser()` from `lib/session.ts`; if null → `<Navigate to="/auth" replace />`.

4. **Convert each route file**
   - Remove `createFileRoute(...)` wrappers and `export const Route = ...`.
   - Export the page component as default.
   - Swap `@tanstack/react-router` imports → `react-router-dom` equivalents:
     - `Link` (`to` prop is compatible)
     - `useNavigate()` — call signature changes from `navigate({ to: '/x' })` → `navigate('/x')`
     - `useRouterState({ select: r => r.location.pathname })` → `useLocation().pathname`
   - Update `AppSidebar` accordingly.

5. **Strip SSR-only code**
   - Delete `__root.tsx`; move its header/sidebar chrome into `ProtectedLayout`.
   - Delete `routeTree.gen.ts`, `router.tsx`.
   - Delete server-fn files, `app/routes/api/*`, Cloudflare/wrangler config.
   - Remove any `HeadContent` / `Scripts` usage; document `<title>` set via `document.title` in `useEffect` per page (kept minimal — same titles as before).

6. **Verification**
   - `bun run build` produces `dist/index.html` + `dist/assets/*` only (no `dist/server`).
   - Manual click-through in preview: login → dashboard (KPIs + RegionalPerformance + UploadDatasetButton) → pricing → inventory → analytics → upload → logout.
   - Direct URL load (`/pricing`) works after refresh (with `_redirects`).

## Technical notes

- React Router v6 nested routes give the same `<Outlet/>` semantics used today, so the sidebar+header layout port is mechanical.
- `lib/session.ts` already guards on `typeof window` — safe in SPA, no further change.
- All `src/api/*` files use plain axios → zero changes.
- `RegionalPerformance`, `UploadDatasetButton`, `StatCard`, all `components/ui/*` are framework-agnostic → zero changes.
- Tailwind v4 keeps working via `@tailwindcss/vite` + existing `src/styles.css` (`@import "tailwindcss"` etc.).
- Amplify: add `public/_redirects` containing `/*  /index.html  200` so refresh on `/pricing` doesn't 404.

## Risks / call-outs

- Lovable's preview tooling is tuned for TanStack Start; after migration the dev server still runs via Vite, but the `@lovable.dev/vite-tanstack-config` wrapper is removed. Preview will use vanilla Vite config.
- Any future Lovable Cloud / server-function work would need to be reintroduced as a separate API (not part of this static build).
- `routeTree.gen.ts` and TanStack-specific files will be deleted — irreversible within this migration.

Confirm to proceed and I'll execute the migration in one pass.