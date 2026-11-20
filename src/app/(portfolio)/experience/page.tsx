import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ExperienceJobs from '@/app/components/ExperienceJobs'
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
      <ExperienceJobs
        roles={page.roles}
        seeMoreLabel={page.seeMoreLabel}
        seeLessLabel={page.seeLessLabel}
        newTabNote={site.newTabNote}
      />
      {page.education.length > 0 ? (
        <div className={page.roles.length > 0 ? 'mt-8 sm:mt-10' : undefined}>
          <SectionHeading text={page.educationHeading} square="bg-signal-red" />
          <RoleList roles={page.education} newTabNote={site.newTabNote} />
        </div>
      ) : null}
      {page.certifications.length > 0 ? (
        <div className={page.roles.length > 0 || page.education.length > 0 ? 'mt-8 sm:mt-10' : undefined}>
          <SectionHeading text={page.certificationsHeading} square="bg-signal-yellow" />
          <CertificationList certifications={page.certifications} newTabNote={site.newTabNote} />
        </div>
      ) : null}
    </SectionPageShell>
  )
}
