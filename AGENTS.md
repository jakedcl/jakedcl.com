# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single Next.js 15 (App Router) app named `jakedcl` — a personal portfolio for "Jake DCL" — with an embedded Sanity Studio. There is one service to run.

- Package manager is `npm` (see `package-lock.json`). Standard scripts live in `package.json`: `npm run dev`, `npm run build`, `npm start`, `npm run lint`.
- Run the app in development with `npm run dev` (serves on `http://localhost:3000`). The same dev server serves both the public portfolio at `/` and the Sanity Studio at `/studio`.
- No secrets or `.env` files are required to render the public site. Sanity `projectId` (`we7xgg1a`), `dataset` (`production`), and `apiVersion` have hardcoded fallbacks in `src/sanity/env.ts`, so the site fetches live content from the public `production` dataset out of the box. Outbound network access to `*.sanity.io` / `cdn.sanity.io` is needed for content and images to load.
- The home page (`src/app/page.tsx`) uses `export const revalidate = 0` and the Sanity client disables the CDN in development, so it always fetches fresh data on each request — expect a live network call to Sanity on every load.
- `/studio` renders the Sanity Studio and shows a "Choose login provider" screen. Viewing/authoring content there requires a Sanity account with access to the project; the public portfolio does not require any login. Do not expect to author content without credentials.
- The `dist/` directory is committed but stale/unused by the dev workflow; the live build output goes to `.next/` (gitignored). Ignore `dist/`.
