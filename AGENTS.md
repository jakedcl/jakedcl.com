# AGENTS.md

Jake DCL portfolio (`jakedcl.com`). Next.js 15 App Router, React 19, Tailwind v4, Sanity v4 Studio at `/studio`. One service. Package manager: `npm`.

## Run

- `npm run dev` → `http://localhost:3000` (site + `/studio`)
- Also: `npm run build` | `start` | `lint`
- No `.env` needed for the public site. Fallbacks in `src/sanity/env.ts`: `projectId` `we7xgg1a`, `dataset` `production`. Needs outbound `*.sanity.io` / `cdn.sanity.io`.
- Home: `revalidate = 0`; Sanity CDN off in dev → fresh fetch every load.
- `/studio` needs a Sanity login to author. Public pages do not.

## Routes

- `/` — hero + WORK + in-page resume
- `/resume` — standalone resume
- `/studio` — Sanity Studio
- `/skyline` → redirect to skyinfoline (see `next.config.ts`)

## Content (do not mix sources)

| Source | Powers |
| --- | --- |
| Sanity `project` | WORK cards (`displayOrder`). Copy facts only from `docs/PROJECT_BRIEFS.md` — never invent clients, features, or URLs. |
| Sanity `settings.galleryPhotos` | Hero filmstrip. Site uses first **16** frames; more stalls phones. |
| `src/data/resume.ts` + `skillLogos.ts` | Resume / contact on `/` and `/resume`. Not CMS-backed. |

`settings.bioText` exists in schema but is unused — hero copy is local UI, not that field. Types: `src/types/sanity.ts`. Queries: `src/sanity/lib/queries.ts`.

## Design — Signal Max (live)

Cream paper stage (`#f6f3ec` / `--background`), ink, signal yellow/blue/red/green, cut shapes, ticket clips, paper grain. Tokens + utilities in `src/app/globals.css`.

Fonts: Syne (display), Bricolage Grotesque (shape), IBM Plex Mono (utility), Helvetica (body) — wired in `src/app/layout.tsx`.

**Deferred:** 90s camcorder — `docs/CAMCORDER_THEME_BRIEF.md`. Do not implement unless explicitly revived.

## Code map

- Pages: `src/app/page.tsx`, `src/app/resume/page.tsx`
- UI: `src/app/components/` — `SignalHero`, `Filmstrip` → `FilmStrip3D` / `FilmStripFlat`, `ProjectCard`, `Resume`, `SkillLogoLane`
- Sanity: `src/sanity/schemaTypes/`, `lib/`, `env.ts`, `structure.ts`
- Filmstrip is the mobile Safari hot path — prefer perf/clarity over new visual effects there.

## How to work here

- Explain the approach before large UI or architecture changes; Jake wants to articulate the direction.
- Real copy only (no lorem). Every surface needs empty, loading, and error states.
- Preserve Signal Max. No new component library, auth, or database unless the task needs it.
- Prefer CSS + existing patterns over adding motion libraries.
- Keep this file short. Long briefs stay in `docs/` and are read only when the task needs them.
