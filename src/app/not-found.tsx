import Link from 'next/link'

import { getSite } from '@/lib/content'
import { contentLinkClass } from '@/lib/contentLink'
import { portfolioBody, portfolioSpaceNudge, portfolioSpaceSection } from '@/lib/portfolioUi'

// Text comes from Studio > Site-wide > “Page not found” page.
export default async function NotFound() {
  const site = await getSite()
  return (
    <main className="portfolio-shell mx-auto flex min-h-screen max-w-2xl flex-col justify-center bg-background px-5 text-ink">
      {site.notFoundTitle ? (
        <h1 className="font-shape text-3xl font-extrabold tracking-tight">{site.notFoundTitle}</h1>
      ) : null}
      {site.notFoundBody ? (
        <p className={`max-w-md ${portfolioBody} ${portfolioSpaceNudge}`}>{site.notFoundBody}</p>
      ) : null}
      {site.notFoundLinkLabel ? (
        <Link
          href="/"
          className={`${contentLinkClass} ${portfolioSpaceSection} w-fit`}
        >
          {site.notFoundLinkLabel}
        </Link>
      ) : null}
    </main>
  )
}
