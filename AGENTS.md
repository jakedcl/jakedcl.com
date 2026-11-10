# AGENTS.md

Jake DCL portfolio (`jakedcl.com`). Next.js 16 App Router, React 19, Tailwind v4, Sanity v6 Studio at `/studio`. One service. Package manager: `npm`.

## Dev framework

This repo follows Jake's dev framework: [jakedcl/dev-framework](https://github.com/jakedcl/dev-framework) (start at its `AGENTS.md`). The framework is the source of truth; if anything in this file conflicts with it, the framework wins.

The framework repo is private. Cloud agents open it with `git clone --depth 1 https://x-access-token:${DEV_FRAMEWORK_READ_TOKEN}@github.com/jakedcl/dev-framework /tmp/dev-framework` (the token is a Cursor secret; never print or commit it).

## Run

- `npm run dev` → `http://localhost:3000` (site + `/studio`)
- Also: `npm run build` | `start` | `lint`
- No `.env` needed for the public site. Fallbacks in `src/sanity/env.ts`: `projectId` `we7xgg1a`, `dataset` `production`. Needs outbound `*.sanity.io` / `cdn.sanity.io`.
- Pages read published content with `revalidate = 60` (`src/sanity/lib/fetch.ts`), so Studio edits show up within about a minute, no redeploy.
- `/studio` needs a Sanity login to author. Public pages do not.
- After changing schema files, run `npx sanity schema deploy` so Sanity tools/agents see the same schema.

## Routes

- `/` — intro (big title, name, tagline, bio, featured case study, links)
- `/projects`, `/experience`, `/skills`, `/about` — one section each. A section is hidden (menu + page 404) when its page name is empty in Studio.
- `/showcase` — the case study (Studio > Case study). 404 if no project is picked.
- `/studio` — Sanity Studio.
- Anything else goes to `src/app/[...path]/page.tsx`: first the rules in Studio > Redirects (exact path, or `/old/*` → `/new/*`), then a project short link (`project.slug`) → the project link, else 404. Redirects cannot take over a real page path (`RESERVED_FIRST_SEGMENTS` in `src/lib/routes.ts`; Studio blocks them). There are no redirects in `next.config.ts`.

## Content (do not mix sources)

Jake edits only in Studio. **No copy, SEO text, URLs, or redirects in code, and no fallbacks: an empty field renders nothing.** One singleton document per Studio item (fixed `_id` = type name):

| Studio item | Document | Powers |
| --- | --- | --- |
| Site-wide | `siteGlobals` | Big title, name, tagline, footer, screen-reader texts, 404 page |
| Homepage | `homePage` | Bio, links, featured case study block, home SEO |
| Projects | `projectsPage` + `project` docs | Page name/SEO; projects (name, description, link, short link, photos). Order = drag-and-drop (`orderRank`, @sanity/orderable-document-list). Project facts only from `docs/PROJECT_BRIEFS.md`. |
| Experience / Skills / About | `experiencePage` / `skillsPage` / `aboutPage` | Page name (menu label + tab title), content, SEO |
| Case study | `caseStudyPage` | Featured project, all `/showcase` copy and labels, SEO |
| Search & sharing | `seoSettings` | Site address/name, keywords, author, share image, generated card text, favicon, app icon/manifest text, indexing + hidden paths |
| Redirects | `redirects` | Redirect rules (from, to, permanent) |

The old `settings` doc (`9dae2a8c-ff4f-4d8c-8cf6-411f02301eaf`) is kept read-only and hidden from Studio; nothing reads it. Do not delete it. Project `title`/`displayOrder` are legacy hidden fields.

Queries: `src/sanity/lib/queries.ts`. Normalizing: `src/lib/content.ts`.

### Allowed to stay in code (keep this list current)

Menu colors and order (`src/lib/sections.ts`), fonts/layout/animation/design colors, the “could not load” texts (`LoadError.tsx`, `error.tsx`, shown when Sanity is down), Sanity connection config (`env.ts`), plus technical constants: `lang="en"`, og locale `en_US`, manifest colors/start_url/display, googleBot directives, JSON-LD `@type: Person`, separators (` - `, `, `), gallery counter/step numbers/+ −, image size defaults, OG card + phone icon layout, the reserved route list.

## Design — Signal Max (live)

Cream paper stage (`#f6f3ec` / `--background`), ink, signal yellow/blue/red/green, paper grain. Text-first page. Tokens in `src/app/globals.css`.

Fonts (`src/app/layout.tsx`): Syne (display — never remove), Bricolage Grotesque (shape), IBM Plex Mono (utility), Helvetica (body).

## Code map

- Pages: `src/app/(portfolio)/` (home, sections, showcase), metadata routes in `src/app/`
- UI: `src/app/components/`
- Content + SEO: `src/lib/content.ts`, `src/lib/metadata.ts`
- Sanity: `src/sanity/schemaTypes/`, `structure.ts`, `singletons.ts`, `lib/`, `env.ts`

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
