import type { ReactNode } from 'react'

import type { HomeContent } from '@/lib/siteContent'

export default function SectionPageShell({
  content,
  children,
}: {
  content: HomeContent
  children: ReactNode
}) {
  return (
    <>
      {content.loadError ? (
        <p role="alert" className="mt-8 text-sm leading-relaxed text-ink/70">
          The page copy could not load. Refresh to try again.
        </p>
      ) : null}

      <div className="mt-14">{children}</div>

      {content.footerText ? (
        <footer className="mt-16 pt-4">
          <p className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
            {content.footerText}
          </p>
        </footer>
      ) : null}
    </>
  )
}
