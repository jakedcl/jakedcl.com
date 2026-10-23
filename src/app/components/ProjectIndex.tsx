import { client } from '@/sanity/lib/client'
import { projectsQuery } from '@/sanity/lib/queries'
import { projectCopy } from '@/lib/projectText'
import type { Project, SanityImage as SanityAsset } from '@/types/sanity'
import ProjectPreviewReset from './ProjectPreviewReset'
import SanityImage from './SanityImage'

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

function screenshotOf(project: Project): SanityAsset | undefined {
  return project.photos?.find((photo) => photo?.asset?.url)
}

function ProjectRow({ project }: { project: Project }) {
  const { name, description } = projectCopy(project.title)
  const photo = screenshotOf(project)
  const width = photo?.asset.metadata?.dimensions?.width ?? 1024
  const height = photo?.asset.metadata?.dimensions?.height ?? 768

  const nameEl = project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-medium text-ink ${linkClass}`}
    >
      {name}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <span className="font-medium text-ink">{name}</span>
  )

  return (
    <li className="project-row relative py-3">
      <p className="text-[0.95rem] leading-relaxed text-ink/80 md:truncate">
        {nameEl}
        {description ? <span> - {description}</span> : null}
      </p>
      <div className="project-preview" aria-hidden="true">
        {photo?.asset.url ? (
          <SanityImage
            src={photo.asset.url}
            alt=""
            width={width}
            height={height}
            sizes="16rem"
            className="aspect-[4/3] w-full object-cover"
          />
        ) : null}
        <div className="p-3">
          <p className="font-display text-base font-extrabold leading-tight tracking-tight text-ink">
            {name}
          </p>
          {description ? (
            <p className="mt-1.5 text-sm leading-snug text-ink/75">{description}</p>
          ) : (
            <p className="mt-1.5 text-sm leading-snug text-ink/45">No description yet.</p>
          )}
        </div>
      </div>
    </li>
  )
}

export default async function ProjectIndex() {
  let projects: Project[] = []

  try {
    projects = (await client.fetch<Project[]>(projectsQuery)) ?? []
  } catch {
    return (
      <p role="alert" className="text-sm leading-relaxed text-ink/70">
        Projects could not load. Refresh the page to try again.
      </p>
    )
  }

  if (projects.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-ink/55">
        No projects on the board — check back soon.
      </p>
    )
  }

  return (
    <>
      <ProjectPreviewReset />
      <ul>
        {projects.map((project) => (
          <ProjectRow key={project._id} project={project} />
        ))}
      </ul>
    </>
  )
}
