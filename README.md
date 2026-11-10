# Jake DCL

Portfolio for Jake DeCore-Lurker at [jakedcl.com](https://jakedcl.com). Next.js App Router, Tailwind, and Sanity Studio.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` file is required. Sanity falls back to project `we7xgg1a`, dataset `production`.

Sanity images are resized by `cdn.sanity.io` (`src/lib/sanityImageLoader.ts`), not by Vercel image transformations.

Everything on the site is edited in Studio at `/studio` (Sanity login needed): each page's text and SEO, Search & sharing, the favicon, projects (drag to reorder), and Redirects. Nothing is hardcoded; an empty field is simply not shown. Changes go live within about a minute without a redeploy. See `AGENTS.md` for the Studio map and the short list of things that stay in code.

`npm run lint` and `npm run build` cover the site and Studio.
