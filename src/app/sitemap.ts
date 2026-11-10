import type { MetadataRoute } from 'next'

import { getSite } from '@/lib/content'
import { SHOWCASE_PATH } from '@/lib/routes'
import { sectionNavItems } from '@/lib/sections'

export const revalidate = 60

// Every page that currently exists, under the Site address from Studio > Search & sharing.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite()
  if (!site.siteUrl) return []
  const paths = [
    '',
    ...sectionNavItems(site.nav).map((item) => `/${item.slug}`),
    ...(site.caseStudyName ? [SHOWCASE_PATH] : []),
  ]
  const lastModified = new Date()
  return paths.map((path) => ({ url: `${site.siteUrl}${path}`, lastModified }))
}
