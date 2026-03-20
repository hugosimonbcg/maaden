# Maaden Benchmark Intelligence (prototype)

High-fidelity desktop prototype for the AI-enabled strategic benchmarking platform: one shell, four benchmark outcomes, shared synthetic fact base, URL-synced filters, and a structured AI insight drawer.

## Run

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal. The app loads directly into **Cost competitiveness** (`/cost`).

```bash
npm run build   # production build
npm run preview # serve dist
```

## Design decisions (6)

1. **SOW-aligned lineage** — Metrics and AI responses reference the five performance dimensions (assets, operations, cost & capital, marketing & mix, organisation & enablers) even though the UI groups them into four executive outcome routes.
2. **Industrial Maaden aesthetic** — Charcoal navigation shell, warm stone surfaces, muted mineral gold accents, and teal reserved for data emphasis and primary actions — intentionally not fintech-blue or glassmorphism.
3. **URL as state** — Vertical, asset, year, peer cohort, geography, metric lens, and persona live in query parameters so navigation between the four views preserves context.
4. **Single synthetic model** — One seeded TypeScript fact base drives costs, operations, portfolio, and strategy screens; scenario math (e.g. overhead convergence) is illustrative and documented as such.
5. **AI as evidence, not chat** — The drawer returns summary, reasoning bullets, confidence, sources, and lineage — structured executive output rather than open-ended chat fluff.
6. **Theme + AI chrome** — Light/dark mode toggles a `dark` class on `<html>`, remaps shared `--ma-*` tokens (Tailwind `ma-*` colors follow), persists as `localStorage` key `maaden-theme`. The query strip, drawer, and AI CTAs use dedicated `Ai*` components and `--ai-*` variables for a consistent “precision AI” treatment.

## Stack

Vite, React 19, TypeScript, **Tailwind CSS v3** (PostCSS + explicit `content` paths), React Router, Recharts, Zustand, IBM Plex Sans.

### If the embedded browser shows a blank or black screen

Use a normal browser tab at `http://localhost:5173/cost` (or the URL printed by `npm run dev`). Ensure the dev server is running. A root **ErrorBoundary** will show any runtime error instead of failing silently.

---

*Illustrative only — data is synthetic and not Maaden confidential information.*
