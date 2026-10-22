# Jake DCL

Portfolio for Jake DeCore-Lurker at [jakedcl.com](https://jakedcl.com). Next.js App Router, Tailwind, and Sanity Studio.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` file is required. Sanity falls back to project `we7xgg1a`, dataset `production`.

- `/` is the portfolio (intro, bio, projects, resume).
- `/resume` redirects to `/`.
- `/resume.pdf` is the downloadable resume.
- `/studio` is Sanity Studio. Authoring needs a Sanity login.
- `/<slug>` redirects to a project's link when that project has a short-link slug in Sanity. Unknown slugs 404.

`npm run lint` and `npm run build` cover the site and Studio.
