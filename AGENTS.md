# AGENTS.md

Jake DCL portfolio (`jakedcl.com`). Next.js 15 App Router, React 19, Tailwind v4, Sanity v4 Studio at `/studio`. One service. Package manager: `npm`.

## Run

- `npm run dev` → `http://localhost:3000` (site + `/studio`)
- Also: `npm run build` | `start` | `lint`
- No `.env` needed for the public site. Fallbacks in `src/sanity/env.ts`: `projectId` `we7xgg1a`, `dataset` `production`. Needs outbound `*.sanity.io` / `cdn.sanity.io`.
- Home: `revalidate = 0`; Sanity CDN off in dev → fresh fetch every load.
- `/studio` needs a Sanity login to author. Public pages do not.

## Routes

- `/` — one-page portfolio (intro, bio, projects, resume sections)
- `/resume` → 308 redirect to `/`
- `/studio` — Sanity Studio
- `/skyline` → redirect to skyinfoline (see `next.config.ts`)

## Content (do not mix sources)

| Source | Powers |
| --- | --- |
| Sanity `project` | Projects list (`displayOrder`). Name + description come from the title blocks. Copy facts only from `docs/PROJECT_BRIEFS.md` — never invent clients, features, or URLs. |
| Sanity `settings.galleryPhotos` | Stored only. The filmstrip is gone; do not render these, and do not delete them. |
| `src/data/resume.ts` | Experience, education, skills, certifications, contact. Not CMS-backed. |
| `src/data/bio.ts` | Tagline and extra bio lines. TODO lines there are for Jake to replace. Summary sentence is `resume.summary`. |

`settings.bioText` is unused on the site. Types: `src/types/sanity.ts`. Queries: `src/sanity/lib/queries.ts`. PDF: `public/resume.pdf` (`/resume.pdf`).

## Design — Signal Max (live)

Cream paper stage (`#f6f3ec` / `--background`), ink, signal yellow/blue/red/green, paper grain. Text-first page. Tokens in `src/app/globals.css`.

Fonts: Syne (display), Bricolage Grotesque (shape), IBM Plex Mono (utility), Helvetica (body) — wired in `src/app/layout.tsx`.

**Deferred:** 90s camcorder — `docs/CAMCORDER_THEME_BRIEF.md`. Do not implement unless explicitly revived.

## Code map

- Page: `src/app/page.tsx`
- UI: `src/app/components/` — `IntroName`, `ProjectIndex`, `ResumeSections`
- Sanity: `src/sanity/schemaTypes/`, `lib/`, `env.ts`, `structure.ts`
- `export/filmstrip/` is a portable package for other projects. Do not wire it back into this site.

## How to work here

- Explain the approach before large UI or architecture changes; Jake wants to articulate the direction.
- Real copy only (no lorem). Every surface needs empty, loading, and error states.
- Preserve Signal Max. No new component library, auth, or database unless the task needs it.
- Prefer CSS + existing patterns over adding motion libraries.
- Keep this file short. Long briefs stay in `docs/` and are read only when the task needs them.
