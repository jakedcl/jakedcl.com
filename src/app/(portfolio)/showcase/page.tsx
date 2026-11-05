import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  CaseStudyFacts,
  CaseStudyGallery,
  CaseStudyLinks,
  CaseStudySteps,
} from '@/app/components/CaseStudyInteractive'
import { getCaseStudyPageBundle } from '@/lib/caseStudyContent'
import { SHOWCASE_PATH } from '@/lib/showcase'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const { caseStudy, siteTitle } = await getCaseStudyPageBundle()
  if (!caseStudy.visible) return {}
  const title =
    caseStudy.name && siteTitle
      ? `${caseStudy.name} case study · ${siteTitle}`
      : caseStudy.name || siteTitle || undefined

  return {
    ...(title ? { title } : {}),
    ...(caseStudy.intro ? { description: caseStudy.intro.slice(0, 160) } : {}),
    alternates: { canonical: SHOWCASE_PATH },
    openGraph: {
      type: 'article',
      url: `https://jakedcl.com${SHOWCASE_PATH}`,
      ...(caseStudy.name ? { title: `${caseStudy.name} case study` } : {}),
    },
  }
}

export default async function ShowcasePage() {
  const { caseStudy } = await getCaseStudyPageBundle()
  if (caseStudy.loadError) {
    return (
      <p role="alert" className="mt-8 text-sm leading-relaxed text-ink/70">
        The case study could not load. Refresh to try again.
      </p>
    )
  }
  if (!caseStudy.visible) notFound()

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
        <CaseStudyGallery images={caseStudy.gallery} />
      </div>

      <CaseStudyFacts facts={caseStudy.facts} />
      <CaseStudySteps steps={caseStudy.steps} />

      {caseStudy.stackNote ? (
        <section className="mt-14">
          <h2 className="font-shape mb-3 text-lg font-bold tracking-tight text-ink">
            Under the hood
          </h2>
          <p className="max-w-[38rem] text-[0.95rem] leading-relaxed text-ink/85">
            {caseStudy.stackNote}
          </p>
        </section>
      ) : null}

      {caseStudy.processNote ? (
        <section className="mt-10 border-l-2 border-signal-yellow pl-4">
          <h2 className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/50">
            How this shipped
          </h2>
          <p className="mt-2 max-w-[38rem] text-sm leading-relaxed text-ink/80">
            {caseStudy.processNote}
          </p>
        </section>
      ) : null}

      <CaseStudyLinks
        productUrl={caseStudy.productUrl}
        repoUrl={caseStudy.repoUrl}
        productLinkLabel={caseStudy.productLinkLabel}
        repoLinkLabel={caseStudy.repoLinkLabel}
      />
    </article>
  )
}
