/**
 * Route structure (code, not content). Paths that are real pages or files, so a
 * Studio redirect or project short link can never take them over.
 */
export const SECTION_SLUGS = ['projects', 'experience', 'skills', 'about'] as const

export type SectionSlug = (typeof SECTION_SLUGS)[number]

export const SHOWCASE_PATH = '/showcase'

export const RESERVED_FIRST_SEGMENTS: ReadonlySet<string> = new Set([
  ...SECTION_SLUGS,
  'showcase',
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

/** Single lowercase path segment used for project short links. */
export const SHORT_LINK_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
