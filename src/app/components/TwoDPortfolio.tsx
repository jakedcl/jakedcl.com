import type { ReactNode } from 'react'
import type { Project, SanityImage } from '@/types/sanity'
import Filmstrip from './Filmstrip'
import ProjectCard from './ProjectCard'
import Resume from './Resume'

function ProjectsList({
  projects,
  compact = false,
  className = '',
}: {
  projects: Project[]
  compact?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} compact={compact} />
      ))}
    </div>
  )
}

export default function TwoDPortfolio({
  projects,
  photos,
  banner,
}: {
  projects: Project[]
  photos?: SanityImage[]
  banner?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {banner}
      <main className="relative overflow-x-hidden">
        {photos && photos.length > 0 && <Filmstrip photos={photos} />}

        <div className="px-6 pb-10 pt-10 md:px-10 lg:grid lg:grid-cols-[minmax(0,1fr)_min(19rem,26%)] lg:items-start lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_min(22rem,28%)] xl:gap-x-14">
          <header className="min-w-0 pb-6 lg:pb-0">
            <h1 className="sr-only">Jake DCL</h1>
            <Resume />
          </header>

          <aside className="hidden min-w-0 lg:sticky lg:top-8 lg:block lg:self-start">
            <h2 className="mb-5 text-lg font-bold text-black xl:text-xl">Recent Projects</h2>
            <ProjectsList projects={projects} compact className="space-y-6" />
          </aside>

          <section className="min-w-0 lg:hidden">
            <h2 className="mb-6 text-2xl font-bold text-black">Recent Projects</h2>
            <ProjectsList projects={projects} className="space-y-10" />
          </section>
        </div>
      </main>
    </div>
  )
}
