import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import LoadError, { PROJECTS_LOAD_ERROR } from '@/app/components/LoadError'
import ProjectIndex from '@/app/components/ProjectIndex'
import SectionPageShell from '@/app/components/SectionPageShell'
import { getProjectsPage, getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [site, page] = await Promise.all([getSite(), getProjectsPage()])
  return pageMetadata(site, page.seo, '/projects')
}

export default async function ProjectsPage() {
  const [site, page] = await Promise.all([getSite(), getProjectsPage()])
  if (page.loadError) {
    return (
      <SectionPageShell loadError={false} footer={site.footer}>
        <LoadError>{PROJECTS_LOAD_ERROR}</LoadError>
      </SectionPageShell>
    )
  }
  if (!page.pageName) notFound()

  return (
    <SectionPageShell loadError={site.loadError} footer={site.footer}>
      <ProjectIndex projects={page.projects} newTabNote={site.newTabNote} />
    </SectionPageShell>
  )
}
