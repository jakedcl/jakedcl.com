import type { Link } from '@/lib/content'
import { contentLinkClass } from '@/lib/contentLink'
import { portfolioMeta, portfolioSpaceFooter } from '@/lib/portfolioUi'
import Image from 'next/image'

import NewTabNote from './NewTabNote'

const MARK_WIDTH = 270
const MARK_HEIGHT = 191

/** Contact links from Homepage in Studio; dcldev mark is site chrome (always shown). */
export default function Footer({
  links,
  newTabNote,
}: {
  links: Link[]
  newTabNote: string
}) {
  return (
    <footer className={`site-footer ${portfolioSpaceFooter}`}>
      <div className="site-footer-row">
        {links.length > 0 ? (
          <p
            className={`site-footer-links ${portfolioMeta} flex flex-wrap gap-x-3 gap-y-1.5`}
          >
            {links.map((link) => {
              const external = link.href.startsWith('http')
              return (
                <a
                  key={link._key ?? link.href}
                  href={link.href}
                  className={`${contentLinkClass} text-inherit`}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {link.label}
                  {external ? <NewTabNote note={newTabNote} /> : null}
                </a>
              )
            })}
          </p>
        ) : null}
        <div className="site-footer-mark">
          <a
            href="https://dcldev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer-mark__link"
          >
            <Image
              src="/by-dcldev.png"
              alt="by dcldev"
              width={MARK_WIDTH}
              height={MARK_HEIGHT}
              className="site-footer-mark__img"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}