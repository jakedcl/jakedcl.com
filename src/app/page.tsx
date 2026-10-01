import { client } from '@/sanity/lib/client'
import { projectsQuery, settingsQuery } from '@/sanity/lib/queries'
import { Project, Settings } from '@/types/sanity'
import ProjectCard from './components/ProjectCard'
import Resume from './components/Resume'
import SignalHero from './components/SignalHero'
import { resume } from '@/data/resume'

export const revalidate = 0

async function getProjects(): Promise<Project[]> {
  return await client.fetch(projectsQuery)
}

async function getSettings(): Promise<Settings | null> {
  return await client.fetch(settingsQuery)
}

function ProjectsList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="border-b border-ink/10 px-5 py-16 md:px-8">
        <p className="font-utility text-sm uppercase tracking-[0.16em] text-ink/40">
          No projects on the board — check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 border-b border-ink/10 pb-6 pt-2 md:gap-3 md:pb-10">
      {projects.map((project, index) => (
        <ProjectCard key={project._id} project={project} index={index} />
      ))}
    </div>
  )
}

export default async function Home() {
  const projects = await getProjects()
  const settings = await getSettings()
  const email = resume.contact.find((c) => c.href.startsWith('mailto:'))

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jake DCL',
    url: 'https://jakedcl.com',
    jobTitle: 'Web Developer',
    description: 'Portfolio website for Jacob Decore Lurker (Jake DCL).',
    sameAs: [
      'https://github.com/jakedcl',
      'https://www.linkedin.com/in/jakedcl',
    ],
  }

  return (
    <div className="min-h-screen bg-background text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="relative overflow-x-hidden">
        <SignalHero photos={settings?.galleryPhotos} />

        <section id="work" className="scroll-mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-4 py-4 md:px-6">
            <div className="flex items-center gap-3">
              <span className="signal-badge bg-signal-yellow text-ink">W</span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
                WORK
              </h2>
            </div>
            <p className="font-utility text-[0.65rem] uppercase tracking-[0.18em] text-ink/40">
              {projects.length > 0
                ? `${String(projects.length).padStart(2, '0')} projects`
                : 'coming soon'}
            </p>
          </div>
          <ProjectsList projects={projects} />
        </section>

        <section
          id="resume"
          className="scroll-mt-4 px-4 py-12 md:px-6 md:py-16"
        >
          <div className="mx-auto max-w-3xl">
            <div className="clip-ticket-alt border border-ink/10 bg-cream px-5 py-8 text-ink shadow-[8px_12px_0_0_rgba(10,10,10,0.08)] md:px-10 md:py-12">
              <Resume part="body" />
            </div>
          </div>
        </section>

        <footer className="border-t border-ink/10 px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
              JAKEDCL.COM · NYC
            </p>
            {email && (
              <a
                href={email.href}
                className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-signal-blue transition-colors hover:text-signal-red"
              >
                {email.label}
              </a>
            )}
          </div>
        </footer>
      </main>
    </div>
  )
}
