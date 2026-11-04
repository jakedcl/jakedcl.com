import { Suspense, type ReactNode } from 'react'

import type { SectionSlug } from '@/lib/sections'
import type { HomeContent } from '@/lib/siteContent'
import BioCopy from './BioCopy'
import ProjectIndex from './ProjectIndex'
import { RoleList, SkillsList } from './ResumeSections'

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
      body = <RoleList roles={content.education} />
      break
    case 'skills':
      body = <SkillsList groups={content.skills} />
      break
    case 'certifications':
      body = <RoleList roles={content.certifications} />
      break
    case 'bio':
      body =
        content.bioLong.length > 0 ? (
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-ink/90 md:text-base">
            <BioCopy blocks={content.bioLong} />
          </div>
        ) : null
      break
  }

  return body
}
