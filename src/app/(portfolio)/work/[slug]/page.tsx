import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import LoadError, { WORK_LOAD_ERROR } from '@/app/components/LoadError'
import NewTabNote from '@/app/components/NewTabNote'
import ProjectDetails from '@/app/components/ProjectDetails'
import ProjectGallery from '@/app/components/ProjectGallery'
import SectionPageShell from '@/app/components/SectionPageShell'
import { getProjectPage, getProjectSlugs, getSite } from '@/lib/content'
import { contentLinkClass } from '@/lib/contentLink'
import {
  portfolioBody,
  portfolioSpaceNudge,
  portfolioSpaceSection,
  portfolioSpaceSectionLg,
  portfolioSpaceStack,
  portfolioTextPrimary,
  portfolioTypeBody,
  portfolioTypeDisplayLg,
} from '@/lib/portfolioUi'
import { pageMetadata } from '@/lib/metadata'

export const revalidate = 60

const linkClass = contentLinkClass

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const [site, page] = await Promise.all([getSite(), getProjectPage(slug)])
  if (!page.project || !page.labels.pageName) return {}
  return pageMetadata(site, page.project.seo, `/work/${page.project.slug}`, 'article')
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const [site, page] = await Promise.all([getSite(), getProjectPage(slug)])
  if (page.loadError) {
    return (
      <SectionPageShell loadError={false} >
        <LoadError>{WORK_LOAD_ERROR}</LoadError>
      </SectionPageShell>
    )
  }
  const { project, labels } = page
  if (!project || !labels.pageName) notFound()

  const visitLink =
    project.link && labels.visitSiteLabel
      ? { href: project.link, label: labels.visitSiteLabel }
      : null
  const sourceLink =
    project.githubUrl && labels.sourceLabel
      ? { href: project.githubUrl, label: labels.sourceLabel }
      : null

  return (
    <SectionPageShell loadError={site.loadError} >
      <article>
        <h2 className={`${portfolioTypeDisplayLg} ${portfolioTextPrimary} ${portfolioSpaceStack}`}>
          {project.name}
        </h2>

        {project.description ? (
          <p className={`max-w-[38rem] ${portfolioBody} ${portfolioSpaceNudge}`}>
            {project.description}
          </p>
        ) : null}

        {visitLink || sourceLink ? (
          <p
            className={`flex flex-wrap gap-x-4 gap-y-2 ${portfolioTypeBody} ${portfolioTextPrimary} ${portfolioSpaceStack}`}
          >
            {visitLink ? (
              <a
                href={visitLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 ${linkClass}`}
              >
                {visitLink.label}
                <span aria-hidden>↗</span>
                <NewTabNote note={site.newTabNote} />
              </a>
            ) : null}
            {sourceLink ? (
              <a
                href={sourceLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 ${linkClass}`}
              >
                {sourceLink.label}
                <span aria-hidden>↗</span>
                <NewTabNote note={site.newTabNote} />
              </a>
            ) : null}
          </p>
        ) : null}

        {project.photos.length > 0 ? (
          <div className={portfolioSpaceSection}>
            <ProjectGallery
              photos={project.photos}
              labels={{
                ariaLabel: labels.galleryAriaLabel,
                openPhotoLabel: labels.openPhotoLabel,
                previousLabel: labels.previousPhotoLabel,
                nextLabel: labels.nextPhotoLabel,
                closeLabel: labels.closePhotoLabel,
              }}
            />
          </div>
        ) : null}

        {project.details.length > 0 ? (
          <div className={portfolioSpaceSectionLg}>
            <ProjectDetails blocks={project.details} newTabNote={site.newTabNote} />
          </div>
        ) : null}
      </article>
    </SectionPageShell>
  )
}