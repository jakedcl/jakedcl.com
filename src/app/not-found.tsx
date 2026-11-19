import Link from 'next/link'

import { getSite } from '@/lib/content'
import { contentLinkClass } from '@/lib/contentLink'

// Text comes from Studio > Site-wide > “Page not found” page.
export default async function NotFound() {
  const site = await getSite()
  return (
    <main className="portfolio-shell mx-auto flex min-h-screen max-w-2xl flex-col justify-center bg-background px-5 text-ink">
      {site.notFoundTitle ? (
        <h1 className="font-shape text-3xl font-extrabold tracking-tight">{site.notFoundTitle}</h1>
      ) : null}
      {site.notFoundBody ? (
        <p className="mt-3 max-w-md text-base leading-relaxed text-ink/75">{site.notFoundBody}</p>
      ) : null}
      {site.notFoundLinkLabel ? (
        <Link
          href="/"
          className={`${contentLinkClass} mt-6 w-fit`}
        >
          {site.notFoundLinkLabel}
        </Link>
      ) : null}
    </main>
  )
}
