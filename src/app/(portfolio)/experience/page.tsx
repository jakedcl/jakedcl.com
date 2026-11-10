import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CertificationList, RoleList } from '@/app/components/ResumeSections'
import SectionHeading from '@/app/components/SectionHeading'
import SectionPageShell from '@/app/components/SectionPageShell'
import { getExperiencePage, getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [site, page] = await Promise.all([getSite(), getExperiencePage()])
  return pageMetadata(site, page.seo, '/experience')
}

export default async function ExperiencePage() {
  const [site, page] = await Promise.all([getSite(), getExperiencePage()])
  if (!page.loadError && !page.pageName) notFound()

  return (
    <SectionPageShell loadError={site.loadError || page.loadError} footer={site.footer}>
      <RoleList roles={page.roles} newTabNote={site.newTabNote} />
      {page.certifications.length > 0 ? (
        <div className={page.roles.length > 0 ? 'mt-14' : undefined}>
          <SectionHeading text={page.certificationsHeading} square="bg-signal-yellow" />
          <CertificationList certifications={page.certifications} newTabNote={site.newTabNote} />
        </div>
      ) : null}
    </SectionPageShell>
  )
}
