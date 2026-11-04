import type { MetadataRoute } from 'next'

import { getHomeContent } from '@/lib/siteContent'
import { sectionNavItems } from '@/lib/sections'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jakedcl.com'
  const content = await getHomeContent()
  const sections = sectionNavItems(content)

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...sections.map((section) => ({
      url: `${baseUrl}/${section.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
