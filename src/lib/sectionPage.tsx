import { notFound } from 'next/navigation'

import SectionBody from '@/app/components/SectionBody'
import SectionPageShell from '@/app/components/SectionPageShell'
import { sectionHeading, sectionNavItems, type SectionSlug } from '@/lib/sections'
import { getHomeContent } from '@/lib/siteContent'

export async function SectionPage({ section }: { section: SectionSlug }) {
  const content = await getHomeContent()
  const items = sectionNavItems(content)
  if (!items.some((item) => item.slug === section)) notFound()

  const title = sectionHeading(content, section)
  if (!title) notFound()

  return (
    <SectionPageShell content={content} section={section} title={title}>
      <SectionBody section={section} content={content} />
    </SectionPageShell>
  )
}
