import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import LoadError, { WORK_LOAD_ERROR } from '@/app/components/LoadError'
import ProjectIndex from '@/app/components/ProjectIndex'
import SectionPageShell from '@/app/components/SectionPageShell'
import { getProjectsPage, getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [site, page] = await Promise.all([getSite(), getProjectsPage()])
  return pageMetadata(site, page.seo, '/work')
}

export default async function ProjectsPage() {
  const [site, page] = await Promise.all([getSite(), getProjectsPage()])
  if (page.loadError) {
    return (
      <SectionPageShell loadError={false} >
        <LoadError>{WORK_LOAD_ERROR}</LoadError>
      </SectionPageShell>
    )
  }
  if (!page.pageName) notFound()

  return (
    <SectionPageShell loadError={site.loadError} >
      <ProjectIndex projects={page.projects} />
    </SectionPageShell>
  )
}
