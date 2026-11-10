import type { ProjectRow as Project } from '@/lib/content'
import NewTabNote from './NewTabNote'
import ProjectPreviewReset from './ProjectPreviewReset'
import SanityImage from './SanityImage'

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

function ProjectRow({ project, newTabNote }: { project: Project; newTabNote: string }) {
  const { name, description, photo } = project

  const nameEl = project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-medium text-ink ${linkClass}`}
    >
      {name}
      <NewTabNote note={newTabNote} />
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
      {/* Decorative hover card that repeats the row, so it is hidden from screen readers. */}
      <div className="project-preview" aria-hidden="true">
        {photo ? (
          <SanityImage
            src={photo.url}
            alt=""
            width={photo.width ?? 1024}
            height={photo.height ?? 768}
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
          ) : null}
        </div>
      </div>
    </li>
  )
}

export default function ProjectIndex({
  projects,
  newTabNote,
}: {
  projects: Project[]
  newTabNote: string
}) {
  if (projects.length === 0) return null

  return (
    <>
      <ProjectPreviewReset />
      <ul>
        {projects.map((project) => (
          <ProjectRow key={project._id} project={project} newTabNote={newTabNote} />
        ))}
      </ul>
    </>
  )
}
