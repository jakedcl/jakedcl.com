import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity'

import { contentLinkClass } from '@/lib/contentLink'

import NewTabNote from './NewTabNote'

const linkClass = contentLinkClass

function components(newTabNote: string): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <p>{children}</p>,
      h3: ({ children }) => (
        <h3 className="font-shape pt-4 text-lg font-bold tracking-tight text-ink">{children}</h3>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc space-y-1.5 pl-5">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal space-y-1.5 pl-5">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
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

/** The project page write-up from Studio: paragraphs, headings, lists, bold, italic, links. */
export default function ProjectDetails({
  blocks,
  newTabNote,
}: {
  blocks: PortableTextBlock[]
  newTabNote: string
}) {
  if (blocks.length === 0) return null
  return (
    <div className="max-w-[38rem] space-y-4 text-[0.95rem] leading-relaxed text-ink/85 md:text-base">
      <PortableText value={blocks} components={components(newTabNote)} />
    </div>
  )
}
