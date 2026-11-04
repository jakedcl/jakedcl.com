import Link from 'next/link'

import type { SectionNavItem, SectionSlug } from '@/lib/sections'

const baseClass =
  'font-shape text-sm font-bold tracking-tight text-ink underline-offset-[4px] decoration-2 transition-colors hover:text-signal-blue'

export default function SectionNav({
  items,
  active,
}: {
  items: SectionNavItem[]
  active?: SectionSlug
}) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Site sections" className="flex flex-wrap gap-x-4 gap-y-2">
      {items.map((item) => {
        const underlined = active === undefined || active === item.slug
        return (
          <Link
            key={item.slug}
            href={`/${item.slug}`}
            className={
              underlined
                ? `${baseClass} underline ${item.accentDecoration}`
                : `${baseClass} no-underline`
            }
            {...(active === item.slug ? { 'aria-current': 'page' as const } : {})}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
