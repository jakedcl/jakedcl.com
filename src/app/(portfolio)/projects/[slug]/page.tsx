import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import LoadError, { PROJECTS_LOAD_ERROR } from '@/app/components/LoadError'
import NewTabNote from '@/app/components/NewTabNote'
import ProjectDetails from '@/app/components/ProjectDetails'
import ProjectGallery from '@/app/components/ProjectGallery'
import SectionPageShell from '@/app/components/SectionPageShell'
import { getProjectPage, getProjectSlugs, getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

export const revalidate = 60

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const [site, page] = await Promise.all([getSite(), getProjectPage(slug)])
  if (!page.project || !page.labels.pageName) return {}
  return pageMetadata(site, page.project.seo, `/projects/${page.project.slug}`, 'article')
}

function host(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const [site, page] = await Promise.all([getSite(), getProjectPage(slug)])
  if (page.loadError) {
    return (
      <SectionPageShell loadError={false} footer={site.footer}>
        <LoadError>{PROJECTS_LOAD_ERROR}</LoadError>
      </SectionPageShell>
    )
  }
  const { project, labels } = page
  if (!project || !labels.pageName) notFound()

  return (
    <SectionPageShell loadError={site.loadError} footer={site.footer}>
      <article>
        {labels.backLinkLabel ? (
          <p className="font-utility text-xs text-ink/60">
            <Link href="/projects" className={`inline-flex items-center gap-1.5 ${linkClass}`}>
              <span aria-hidden>←</span>
              {labels.backLinkLabel}
            </Link>
          </p>
        ) : null}

        <h2 className="font-display mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-[1.75rem]">
          {project.name}
        </h2>

        {project.description ? (
          <p className="mt-3 max-w-[38rem] text-[0.95rem] leading-relaxed text-ink/90 md:text-base">
            {project.description}
          </p>
        ) : null}

        {project.link && labels.visitLinkLabel ? (
          <p className="mt-4 text-sm">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-shape font-bold text-ink ${linkClass} decoration-signal-yellow`}
            >
              {labels.visitLinkLabel}
              <span className="font-utility ml-2 font-normal text-ink/60">{host(project.link)}</span>
              <span aria-hidden className="ml-1">↗</span>
              <NewTabNote note={site.newTabNote} />
            </a>
          </p>
        ) : null}

        {project.photos.length > 0 ? (
          <div className="mt-8">
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
          <div className="mt-10">
            <ProjectDetails blocks={project.details} newTabNote={site.newTabNote} />
          </div>
        ) : null}
      </article>
    </SectionPageShell>
  )
}
