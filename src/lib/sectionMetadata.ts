import type { Metadata } from 'next'

import { getHomeContent } from '@/lib/siteContent'
import {
  isSectionSlug,
  sectionHeading,
  type SectionSlug,
} from '@/lib/sections'

export async function metadataForSection(section: SectionSlug): Promise<Metadata> {
  const c = await getHomeContent()
  const heading = sectionHeading(c, section)
  const pageTitle =
    heading && c.siteTitle
      ? `${heading} · ${c.siteTitle}`
      : heading || c.siteTitle || undefined
  const description = c.metaDescription || c.summary || undefined

  return {
    ...(pageTitle ? { title: pageTitle } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: `/${section}`,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://jakedcl.com/${section}`,
      ...(heading ? { title: heading } : c.ogTitle ? { title: c.ogTitle } : {}),
      ...(description ? { description } : c.ogDescription ? { description: c.ogDescription } : {}),
      ...(c.ogSiteName ? { siteName: c.ogSiteName } : {}),
    },
  }
}

export function parseSectionParam(value: string): SectionSlug | null {
  return isSectionSlug(value) ? value : null
}
