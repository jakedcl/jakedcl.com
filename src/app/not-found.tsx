import Link from 'next/link'

import { getHomeContent } from '@/lib/siteContent'

// Text comes from Site Settings > App icon, home-screen install, and 404 page.
export default async function NotFound() {
  const c = await getHomeContent()
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center bg-background px-5 text-ink">
      {c.notFoundTitle ? (
        <h1 className="font-shape text-3xl font-extrabold tracking-tight">{c.notFoundTitle}</h1>
      ) : null}
      {c.notFoundBody ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-ink/75">{c.notFoundBody}</p>
      ) : null}
      {c.notFoundLinkLabel ? (
        <Link
          href="/"
          className="mt-6 w-fit underline decoration-ink/30 underline-offset-[3px] hover:text-signal-blue hover:decoration-signal-blue"
        >
          {c.notFoundLinkLabel}
        </Link>
      ) : null}
    </main>
  )
}
