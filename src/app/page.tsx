import { client } from '@/sanity/lib/client'
import { projectsQuery, settingsQuery } from '@/sanity/lib/queries'
import { Project, Settings } from '@/types/sanity'
import ProjectStack from './components/ProjectStack'
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
      <main className="relative overflow-x-clip">
        <SignalHero photos={settings?.galleryPhotos} />

        <section id="work" className="scroll-mt-4">
          <div className="flex flex-wrap items-center gap-3 border-b-2 border-ink px-4 py-5 md:px-6">
            <span className="signal-badge bg-signal-yellow text-ink">W</span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              WORK
            </h2>
          </div>
          <ProjectStack projects={projects} />
        </section>

        <section
          id="resume"
          className="scroll-mt-4 px-4 py-12 md:px-6 md:py-16"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 md:mb-8">
            <div className="flex items-center gap-3">
              <span className="signal-badge bg-signal-blue text-cream">R</span>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
                RESUME
              </h2>
            </div>
            <span className="stamp-chip">on file</span>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="clip-ticket-alt border-2 border-ink bg-cream px-5 py-8 text-ink shadow-[8px_12px_0_0_rgba(10,10,10,0.08)] md:px-10 md:py-12">
              <Resume part="body" />
            </div>
          </div>
        </section>

        <footer className="border-t-2 border-ink px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
              JAKEDCL.COM · NYC
            </p>
            {email && (
              <a href={email.href} className="stamp-btn text-[0.7rem]">
                {email.label}
              </a>
            )}
          </div>
        </footer>
      </main>
    </div>
  )
}
