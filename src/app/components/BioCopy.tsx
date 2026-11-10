'use client'

import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity'

import NewTabNote from './NewTabNote'

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

function components(newTabNote: string): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <p>{children}</p>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ children, value }) => {
        const href = value && typeof value.href === 'string' ? value.href : ''
        if (!href) return <>{children}</>
        const external = href.startsWith('http')
        return (
          <a
            href={href}
            className={linkClass}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {children}
            {external ? <NewTabNote note={newTabNote} /> : null}
          </a>
        )
      },
    },
  }
}

export default function BioCopy({
  blocks,
  newTabNote,
}: {
  blocks: PortableTextBlock[]
  newTabNote: string
}) {
  return <PortableText value={blocks} components={components(newTabNote)} />
}
