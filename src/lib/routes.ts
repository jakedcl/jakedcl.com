/**
 * Route structure (code, not content). Paths that are real pages or files, so a
 * Studio redirect can never take them over.
 */
export const SECTION_SLUGS = ['work', 'experience', 'skills', 'about'] as const

export type SectionSlug = (typeof SECTION_SLUGS)[number]

export const RESERVED_FIRST_SEGMENTS: ReadonlySet<string> = new Set([
  ...SECTION_SLUGS,
  'studio',
  'apple-icon',
  'opengraph-image',
  'manifest.webmanifest',
  'sitemap.xml',
  'robots.txt',
  'favicon.ico',
  '_next',
])

export function isSectionSlug(value: string): value is SectionSlug {
  return (SECTION_SLUGS as readonly string[]).includes(value)
}
