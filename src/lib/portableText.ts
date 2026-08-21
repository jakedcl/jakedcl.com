import type { PortableTextBlock } from 'next-sanity'

export function portableTextToPlain(value?: PortableTextBlock[]): string {
  if (!value?.length) return ''

  return value
    .map((block) => {
      if (block._type !== 'block' || !('children' in block) || !Array.isArray(block.children)) {
        return ''
      }

      return block.children
        .map((child) => (typeof child === 'object' && child && 'text' in child ? String(child.text) : ''))
        .join('')
    })
    .filter(Boolean)
    .join(' ')
}
