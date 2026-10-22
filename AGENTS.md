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
- `/<slug>` → 307 to that project's `link` when Sanity `project.slug.current` matches. Revalidate ~60s. Unknown or reserved slugs 404. Does not replace `/`, `/studio`, `/resume`, or `/resume.pdf`.
- `/skyline` is that short link once the skyinfoline project slug is `skyline`. Until then it 404s.

## Content (do not mix sources)

| Source | Powers |
| --- | --- |
| Sanity `project` | Projects list (`displayOrder`). Name + description come from the title blocks. Copy facts only from `docs/PROJECT_BRIEFS.md` — never invent clients, features, or URLs. |
| Sanity `settings.galleryPhotos` | Stored only. The filmstrip is gone; do not render these, and do not delete them. |
| `src/data/resume.ts` | Experience, education, skills, certifications, contact. Not CMS-backed. |
| `src/data/bio.ts` | Tagline and bio paragraphs. `resume.summary` is JSON-LD only. |

`settings.bioText` is unused on the site. Types: `src/types/sanity.ts`. Queries: `src/sanity/lib/queries.ts`. PDF: `public/resume.pdf` (`/resume.pdf`).

## Design — Signal Max (live)

Cream paper stage (`#f6f3ec` / `--background`), ink, signal yellow/blue/red/green, paper grain. Text-first page. Tokens in `src/app/globals.css`.

Fonts: Bricolage Grotesque (display and shape), IBM Plex Mono (utility), Helvetica (body) — wired in `src/app/layout.tsx`.

## Code map

- Page: `src/app/page.tsx`
- UI: `src/app/components/` — `IntroName`, `ProjectIndex`, `ResumeSections`
- Sanity: `src/sanity/schemaTypes/`, `lib/`, `env.ts`, `structure.ts`
- `export/filmstrip/` stays in this repo. The jakedcl/metrotapes copy is missing the shell, flat fallback, and example. Do not wire it into this site, and do not delete it until that copy matches.

## How to work here

- Explain the approach before large UI or architecture changes; Jake wants to articulate the direction.
- Real copy only (no lorem). Every surface needs empty, loading, and error states.
- Preserve Signal Max. No new component library, auth, or database unless the task needs it.
- Prefer CSS + existing patterns over adding motion libraries.
- Keep this file short. Long briefs stay in `docs/` and are read only when the task needs them.
