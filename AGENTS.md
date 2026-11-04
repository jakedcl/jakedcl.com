# AGENTS.md

Jake DCL portfolio (`jakedcl.com`). Next.js 16 App Router, React 19, Tailwind v4, Sanity v6 Studio at `/studio`. One service. Package manager: `npm`.

## Dev framework

This repo follows Jake's dev framework: [jakedcl/dev-framework](https://github.com/jakedcl/dev-framework) (start at its `AGENTS.md`). The framework is the source of truth; if anything in this file conflicts with it, the framework wins.

The framework repo is private. Cloud agents open it with `git clone --depth 1 https://x-access-token:${DEV_FRAMEWORK_READ_TOKEN}@github.com/jakedcl/dev-framework /tmp/dev-framework` (the token is a Cursor secret; never print or commit it).

## Run

- `npm run dev` → `http://localhost:3000` (site + `/studio`)
- Also: `npm run build` | `start` | `lint`
- No `.env` needed for the public site. Fallbacks in `src/sanity/env.ts`: `projectId` `we7xgg1a`, `dataset` `production`. Needs outbound `*.sanity.io` / `cdn.sanity.io`.
- Home: `revalidate = 60`. Sanity CDN off in dev. Homepage copy comes only from the Site Settings document. Empty fields are not shown.
- `/studio` needs a Sanity login to author. Public pages do not.

## Routes

- `/` — portfolio intro (section buttons, short bio, links; section content lives on `/projects`, `/experience`, etc.)
- `/projects`, `/experience`, `/education`, `/skills`, `/certifications`, `/about` — one section each (empty or unconfigured sections 404)
- `/resume` → 308 redirect to `/`
- `/studio` — Sanity Studio. Sidebar is the Site Settings singleton and Projects ordered by `displayOrder`.
- `/<slug>` → 307 to that project's `link` when Sanity `project.slug.current` matches. Revalidate ~60s. Unknown or reserved slugs 404. Does not replace `/`, `/studio`, or `/resume`.
- `/skyline` is that short link once the skyinfoline project slug is `skyline`. Until then it 404s.

## Content (do not mix sources)

| Source | Powers |
| --- | --- |
| Sanity `project` | Projects list (`displayOrder`). Name + description come from the title blocks. Copy facts only from `docs/PROJECT_BRIEFS.md` — never invent clients, features, or URLs. |
| Sanity `settings` (`9dae2a8c-ff4f-4d8c-8cf6-411f02301eaf`) | All site copy: big title (`heroTitle`), name, tagline, short `bio`, links, section headings, long `aboutLong` + `aboutHeading` + `aboutAccent`, resume sections, footer, SEO/link-preview fields (`siteTitle`, `metaDescription`, `keywords`, `og*`), manifest/app icon text, and 404 text. No copy or fallbacks in code; empty fields render nothing. There is no resume PDF; the old `resumeFile` field was removed from the schema. `galleryPhotos` stays stored and is not rendered. Do not delete it. |

Queries: `src/sanity/lib/queries.ts`. Seed: `scripts/seed-settings.json` (a patch `set`; do not createOrReplace). New-field seed: `scripts/seed-studio-copy.ts` (setIfMissing on published + draft).

## Design — Signal Max (live)

Cream paper stage (`#f6f3ec` / `--background`), ink, signal yellow/blue/red/green, paper grain. Text-first page. Tokens in `src/app/globals.css`.

Fonts: Bricolage Grotesque (display and shape), IBM Plex Mono (utility), Helvetica (body) — wired in `src/app/layout.tsx`.

## Code map

- Page: `src/app/page.tsx`
- UI: `src/app/components/` — `IntroName`, `ProjectIndex`, `ResumeSections`
- Sanity: `src/sanity/schemaTypes/`, `lib/`, `env.ts`, `structure.ts`

## How to work here

- Explain the approach before large UI or architecture changes; Jake wants to articulate the direction.
- Real copy only (no lorem). Every surface needs empty, loading, and error states.
- Preserve Signal Max. No new component library, auth, or database unless the task needs it.
- Prefer CSS + existing patterns over adding motion libraries.
- Keep this file short. Long briefs stay in `docs/` and are read only when the task needs them.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
