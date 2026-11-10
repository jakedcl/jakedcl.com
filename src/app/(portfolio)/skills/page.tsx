import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SkillsList } from '@/app/components/ResumeSections'
import SectionPageShell from '@/app/components/SectionPageShell'
import { getSite, getSkillsPage } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [site, page] = await Promise.all([getSite(), getSkillsPage()])
  return pageMetadata(site, page.seo, '/skills')
}

export default async function SkillsPage() {
  const [site, page] = await Promise.all([getSite(), getSkillsPage()])
  if (!page.loadError && !page.pageName) notFound()

  return (
    <SectionPageShell loadError={site.loadError || page.loadError} footer={site.footer}>
      <SkillsList groups={page.groups} />
    </SectionPageShell>
  )
}
