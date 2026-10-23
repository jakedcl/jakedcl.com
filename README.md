# Jake DCL

Portfolio for Jake DeCore-Lurker at [jakedcl.com](https://jakedcl.com). Next.js App Router, Tailwind, and Sanity Studio.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` file is required. Sanity falls back to project `we7xgg1a`, dataset `production`.

Sanity images are resized by `cdn.sanity.io` (`src/lib/sanityImageLoader.ts`), not by Vercel image transformations. Files in `/public` still use Next's default optimizer.

- `/` is the portfolio (intro, bio, projects, resume).
- `/resume` redirects to `/`.
- `/resume.pdf` redirects to the resume file uploaded in Studio. It 404s until that file is set.
- `/studio` is Sanity Studio. Authoring needs a Sanity login. Site Settings edits the homepage bio, links, resume sections, and resume PDF.
- `/<slug>` redirects to a project's link when that project has a short-link slug in Sanity. Unknown slugs 404.

`npm run lint` and `npm run build` cover the site and Studio.
