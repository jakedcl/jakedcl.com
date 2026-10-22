'use client'

import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity'

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

const components: PortableTextComponents = {
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
          {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      )
    },
  },
}

export default function BioCopy({ blocks }: { blocks: PortableTextBlock[] }) {
  return <PortableText value={blocks} components={components} />
}
