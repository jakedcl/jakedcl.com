import type { PortableTextBlock } from 'next-sanity'

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4'])

function blockText(block: PortableTextBlock): string {
  return (block.children ?? [])
    .map((child) =>
      'text' in child && typeof child.text === 'string' ? child.text : '',
    )
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Heading block is the name. Later blocks are the description. Same fields the book cards used. */
export function projectCopy(title: PortableTextBlock[] | null | undefined): {
  name: string
  description: string
} {
  const headings: string[] = []
  const body: string[] = []

  for (const block of title ?? []) {
    if (block._type !== 'block') continue
    const text = blockText(block)
    if (!text) continue
    if (HEADINGS.has(block.style ?? '')) headings.push(text)
    else body.push(text)
  }

  if (headings.length === 0) {
    return {
      name: body[0] || 'Untitled project',
      description: body.slice(1).join(' '),
    }
  }

  return {
    name: headings.join(' '),
    description: body.join(' '),
  }
}
