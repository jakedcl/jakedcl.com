import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import BioCopy from '@/app/components/BioCopy'
import { portfolioProse } from '@/lib/portfolioUi'
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
    <SectionPageShell loadError={site.loadError || page.loadError}>
      {page.body.length > 0 ? (
        <div className={portfolioProse}>
          <BioCopy blocks={page.body} newTabNote={site.newTabNote} />
        </div>
      ) : null}
    </SectionPageShell>
  )
}
