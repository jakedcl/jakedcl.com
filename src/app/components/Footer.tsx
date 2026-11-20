import type { Link } from '@/lib/content'
import { contentLinkClass } from '@/lib/contentLink'
import { portfolioMeta, portfolioSpaceFooter } from '@/lib/portfolioUi'

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
    <footer className={`site-footer ${portfolioSpaceFooter}`}>
      <p className={`${portfolioMeta} flex flex-wrap gap-x-3 gap-y-1.5`}>
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