import Link from 'next/link'
import type { ReactNode } from 'react'

import {
  introTitleCompact,
  sectionNavItems,
  type SectionSlug,
} from '@/lib/sections'
import type { HomeContent } from '@/lib/siteContent'
import IntroName from './IntroName'
import SectionNav from './SectionNav'

export default function SectionPageShell({
  content,
  section,
  title,
  children,
}: {
  content: HomeContent
  section: SectionSlug
  title: string
  children: ReactNode
}) {
  const navItems = sectionNavItems(content)
  const compact = introTitleCompact(title)

  return (
    <div className="min-h-screen bg-background text-ink">
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-[max(1.75rem,env(safe-area-inset-top))] sm:pt-14">
        <header>
          <Link
            href="/"
            className="intro-name-link inline-block max-w-full rounded-sm outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-blue"
          >
            <IntroName title={title} compact={compact} />
          </Link>
          <div className="mt-5">
            <SectionNav items={navItems} active={section} />
          </div>
        </header>

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
      </main>
    </div>
  )
}
