import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  CaseStudyFacts,
  CaseStudyGallery,
  CaseStudyLinks,
  CaseStudySteps,
} from '@/app/components/CaseStudyInteractive'
import LoadError, { CASE_STUDY_LOAD_ERROR } from '@/app/components/LoadError'
import { getCaseStudy, getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import { SHOWCASE_PATH } from '@/lib/routes'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [site, caseStudy] = await Promise.all([getSite(), getCaseStudy()])
  if (!caseStudy.name) return {}
  return pageMetadata(site, caseStudy.seo, SHOWCASE_PATH, 'article')
}

export default async function ShowcasePage() {
  const [site, caseStudy] = await Promise.all([getSite(), getCaseStudy()])
  if (caseStudy.loadError) return <LoadError>{CASE_STUDY_LOAD_ERROR}</LoadError>
  if (!caseStudy.name) notFound()

  return (
    <article className="case-study mt-14">
      {caseStudy.eyebrow ? (
        <p className="font-utility text-[0.65rem] uppercase tracking-[0.18em] text-ink/50">
          {caseStudy.eyebrow}
        </p>
      ) : null}
      <h1 className="font-display mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-[1.75rem]">
        {caseStudy.name}
      </h1>
      {caseStudy.intro ? (
        <p className="mt-4 max-w-[38rem] text-[0.95rem] leading-relaxed text-ink/90 md:text-base">
          {caseStudy.intro}
        </p>
      ) : null}

      <div className="mt-8">
        <CaseStudyGallery
          images={caseStudy.screenshots}
          ariaLabel={caseStudy.galleryAriaLabel}
          previousLabel={caseStudy.previousLabel}
          nextLabel={caseStudy.nextLabel}
        />
      </div>

      <CaseStudyFacts
        facts={caseStudy.facts}
        heading={caseStudy.factsHeading}
        ariaLabel={caseStudy.factsAriaLabel}
      />
      <CaseStudySteps
        steps={caseStudy.steps}
        heading={caseStudy.stepsHeading}
        ariaLabel={caseStudy.stepsAriaLabel}
      />

      {caseStudy.stackNote ? (
        <section className="mt-14">
          {caseStudy.stackHeading ? (
            <h2 className="font-shape mb-3 text-lg font-bold tracking-tight text-ink">
              {caseStudy.stackHeading}
            </h2>
          ) : null}
          <p className="max-w-[38rem] text-[0.95rem] leading-relaxed text-ink/85">
            {caseStudy.stackNote}
          </p>
        </section>
      ) : null}

      {caseStudy.processNote ? (
        <section className="mt-10 border-l-2 border-signal-yellow pl-4">
          {caseStudy.processHeading ? (
            <h2 className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/50">
              {caseStudy.processHeading}
            </h2>
          ) : null}
          <p className="mt-2 max-w-[38rem] text-sm leading-relaxed text-ink/80">
            {caseStudy.processNote}
          </p>
        </section>
      ) : null}

      <CaseStudyLinks
        links={[caseStudy.productLink, caseStudy.repoLink]}
        newTabNote={site.newTabNote}
      />
    </article>
  )
}
