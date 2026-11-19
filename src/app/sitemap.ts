import type { MetadataRoute } from 'next'

import { getProjectSlugs, getSite } from '@/lib/content'
import { sectionNavItems } from '@/lib/sections'

export const revalidate = 60

// Every page that currently exists, under the Site address from Studio > Search & sharing.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, slugs] = await Promise.all([getSite(), getProjectSlugs()])
  if (!site.siteUrl) return []
  const paths = [
    '',
    ...sectionNavItems(site.nav).map((item) => `/${item.slug}`),
    ...(site.nav.work ? slugs.map((slug) => `/work/${slug}`) : []),
  ]
  const lastModified = new Date()
  return paths.map((path) => ({ url: `${site.siteUrl}${path}`, lastModified }))
}
