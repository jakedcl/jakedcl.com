import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import BioCopy from '@/app/components/BioCopy'
import { RoleList } from '@/app/components/ResumeSections'
import SectionHeading from '@/app/components/SectionHeading'
import SectionPageShell from '@/app/components/SectionPageShell'
import { getAboutPage, getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [site, page] = await Promise.all([getSite(), getAboutPage()])
  return pageMetadata(site, page.seo, '/about')
}

export default async function AboutPage() {
  const [site, page] = await Promise.all([getSite(), getAboutPage()])
  if (!page.loadError && !page.pageName) notFound()

  return (
    <SectionPageShell loadError={site.loadError || page.loadError} footer={site.footer}>
      {page.body.length > 0 ? (
        <div className="space-y-4 text-[0.95rem] leading-relaxed text-ink/90 md:text-base">
          <BioCopy blocks={page.body} newTabNote={site.newTabNote} />
        </div>
      ) : null}
      {page.education.length > 0 ? (
        <div className={page.body.length > 0 ? 'mt-14' : undefined}>
          <SectionHeading text={page.educationHeading} square="bg-signal-red" />
          <RoleList roles={page.education} newTabNote={site.newTabNote} />
        </div>
      ) : null}
    </SectionPageShell>
  )
}
