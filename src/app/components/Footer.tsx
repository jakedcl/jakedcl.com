import type { Link } from '@/lib/content'
import { contentLinkClass } from '@/lib/contentLink'

import NewTabNote from './NewTabNote'

/** Contact links from Homepage in Studio; shown at the bottom of every portfolio page. */
export default function Footer({
  links,
  newTabNote,
}: {
  links: Link[]
  newTabNote: string
}) {
  if (links.length === 0) return null

  return (
    <footer className="site-footer mt-10 pt-3 sm:mt-12 sm:pt-4">
      <p className="font-utility flex flex-wrap gap-x-3 gap-y-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
        {links.map((link) => {
          const external = link.href.startsWith('http')
          return (
            <a
              key={link._key ?? link.href}
              href={link.href}
              className={`${contentLinkClass} text-inherit`}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
              {external ? <NewTabNote note={newTabNote} /> : null}
            </a>
          )
        })}
      </p>
    </footer>
  )
}