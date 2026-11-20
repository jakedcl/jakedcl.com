'use client'

import { contentLinkClass } from '@/lib/contentLink'
import { portfolioBody, portfolioSpaceNudge, portfolioSpaceSection } from '@/lib/portfolioUi'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="portfolio-shell mx-auto flex min-h-screen max-w-2xl flex-col justify-center bg-background px-5 text-ink">
      <h1 className="font-shape text-3xl font-extrabold tracking-tight">
        This page did not load
      </h1>
      <p className={`max-w-md ${portfolioBody} ${portfolioSpaceNudge}`}>
        Something broke while rendering the portfolio. Refresh, or try again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className={`${contentLinkClass} ${portfolioSpaceSection} w-fit`}
      >
        Try again
      </button>
    </main>
  )
}
