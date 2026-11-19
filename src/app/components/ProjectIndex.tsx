import Link from 'next/link'

import type { ProjectRow as Project } from '@/lib/content'
import { contentLinkClass, contentLinkMarkClass } from '@/lib/contentLink'
import PhotoRotator from './PhotoRotator'

function RowContent({ project }: { project: Project }) {
  const nameId = `project-${project._id}-name`
  const descriptionId = `project-${project._id}-description`
  return (
    <>
      <div className="min-w-0">
        <p
          id={nameId}
          className={`${contentLinkMarkClass} font-medium text-ink underline decoration-ink/30 underline-offset-[3px]`}
        >
          {project.name}
        </p>
        {project.description ? (
          <p
            id={descriptionId}
            className="mt-1.5 line-clamp-4 text-[0.95rem] leading-relaxed text-ink/80"
          >
            {project.description}
          </p>
        ) : null}
      </div>
      {project.photos.length > 0 ? (
        <PhotoRotator photos={project.photos} sizes="(min-width: 640px) 11rem, 7rem" />
      ) : null}
    </>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const grid =
    project.photos.length > 0
      ? 'grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-6'
      : 'block'
  const rowClass = `group ${grid} py-5`

  if (!project.slug) {
    return (
      <li>
        <div className={rowClass}>
          <RowContent project={project} />
        </div>
      </li>
    )
  }

  return (
    <li>
      <Link
        href={`/work/${project.slug}`}
        aria-labelledby={`project-${project._id}-name`}
        {...(project.description ? { 'aria-describedby': `project-${project._id}-description` } : {})}
        className={`${contentLinkClass} ${rowClass} -mx-2 px-2 transition-colors hover:bg-cream/70`}
      >
        <RowContent project={project} />
      </Link>
    </li>
  )
}

/** Every project as a row: name and short description, screenshots rotating on the right. */
export default function ProjectIndex({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <ul className="divide-y divide-ink/10">
      {projects.map((project) => (
        <ProjectRow key={project._id} project={project} />
      ))}
    </ul>
  )
}
