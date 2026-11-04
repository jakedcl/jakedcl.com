import { Suspense, type ReactNode } from 'react'

import type { SectionSlug } from '@/lib/sections'
import type { HomeContent } from '@/lib/siteContent'
import BioCopy from './BioCopy'
import ProjectIndex from './ProjectIndex'
import { RoleList, SkillsList } from './ResumeSections'

function CertificationsBlock({ content }: { content: HomeContent }) {
  if (content.certifications.length === 0) return null

  return (
    <div className={content.education.length > 0 ? 'mt-14' : undefined}>
      {content.certificationsHeading ? (
        <h2 className="font-shape mb-4 flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink">
          <span className="h-2.5 w-2.5 shrink-0 bg-signal-yellow" aria-hidden />
          {content.certificationsHeading}
        </h2>
      ) : null}
      <RoleList roles={content.certifications} />
    </div>
  )
}

export default function SectionBody({
  section,
  content,
}: {
  section: SectionSlug
  content: HomeContent
}) {
  let body: ReactNode = null

  switch (section) {
    case 'projects':
      body = (
        <Suspense fallback={null}>
          <ProjectIndex />
        </Suspense>
      )
      break
    case 'experience':
      body = <RoleList roles={content.experience} />
      break
    case 'education':
      body = (
        <>
          {content.education.length > 0 ? (
            <RoleList roles={content.education} />
          ) : null}
          <CertificationsBlock content={content} />
        </>
      )
      break
    case 'skills':
      body = <SkillsList groups={content.skills} />
      break
    case 'about':
      body =
        content.aboutLong.length > 0 ? (
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-ink/90 md:text-base">
            <BioCopy blocks={content.aboutLong} />
          </div>
        ) : null
      break
  }

  return body
}
