import { Suspense, type ReactNode } from 'react'
import { getHomeContent, type HomeContent } from '@/lib/siteContent'
import BioCopy from './components/BioCopy'
import IntroName from './components/IntroName'
import ProjectIndex from './components/ProjectIndex'
import { RoleList, SkillsList } from './components/ResumeSections'

export const revalidate = 60

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

const accents = [
  'bg-signal-yellow',
  'bg-signal-blue',
  'bg-signal-red',
  'bg-signal-green',
] as const

function Section({
  id,
  title,
  accent,
  children,
}: {
  id: string
  title: string
  accent: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-8 mt-14">
      <h2 className="font-shape mb-4 flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink">
        <span className={`h-2.5 w-2.5 shrink-0 ${accent}`} aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  )
}

export default async function Home() {
  const content = await getHomeContent()

  return (
    <div className="min-h-screen bg-background text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(content)) }}
      />
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-[max(1.75rem,env(safe-area-inset-top))] sm:pt-14">
        <header>
          <IntroName />
          {content.legalName ? (
            <p className="mt-5 text-sm text-ink/70">{content.legalName}</p>
          ) : null}
          {content.tagline ? (
            <p className="font-utility mt-1 text-sm text-ink/60">{content.tagline}</p>
          ) : null}
        </header>

        {content.loadError ? (
          <p role="alert" className="mt-8 text-sm leading-relaxed text-ink/70">
            The page copy could not load. Refresh to try again.
          </p>
        ) : null}

        {content.bio.length > 0 ? (
          <div className="mt-8 space-y-4 text-[0.95rem] leading-relaxed text-ink/90 md:text-base">
            <BioCopy blocks={content.bio} />
          </div>
        ) : null}

        {content.links.length > 0 ? (
          <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[0.95rem]">
            {content.links.map((link) => {
              const external = link.href.startsWith('http')
              return (
                <a
                  key={link._key ?? link.href}
                  href={link.href}
                  className={linkClass}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {link.label}
                  {external ? (
                    <span className="sr-only"> (opens in a new tab)</span>
                  ) : null}
                </a>
              )
            })}
          </p>
        ) : null}

        {content.resumeUrl ? (
          <p className="mt-3 text-[0.95rem]">
            <a href="/resume.pdf" className={linkClass}>
              Download resume (PDF)
            </a>
          </p>
        ) : null}

        <Section id="projects" title="Projects" accent={accents[0]}>
          <Suspense
            fallback={
              <p className="text-sm text-ink/55" role="status">
                Loading projects…
              </p>
            }
          >
            <ProjectIndex />
          </Suspense>
        </Section>

        {content.experience.length > 0 ? (
          <Section id="experience" title="Experience" accent={accents[1]}>
            <RoleList roles={content.experience} />
          </Section>
        ) : null}

        {content.education.length > 0 ? (
          <Section id="education" title="Education" accent={accents[2]}>
            <RoleList roles={content.education} />
          </Section>
        ) : null}

        {content.skills.length > 0 ? (
          <Section id="skills" title="Skills" accent={accents[3]}>
            <SkillsList groups={content.skills} />
          </Section>
        ) : null}

        {content.certifications.length > 0 ? (
          <Section id="certifications" title="Certifications" accent={accents[0]}>
            <RoleList roles={content.certifications} />
          </Section>
        ) : null}

        <footer className="mt-16 pt-4">
          <p className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
            JAKEDCL.COM · NYC
          </p>
        </footer>
      </main>
    </div>
  )
}

function structuredData(content: HomeContent) {
  const email = content.links.find((link) => link.href.startsWith('mailto:'))
  const telephone = content.links.find((link) => link.href.startsWith('tel:'))
  const sameAs = content.links
    .map((link) => link.href)
    .filter((href) => href.startsWith('http'))

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    url: 'https://jakedcl.com',
    ...(content.legalName ? { name: content.legalName } : {}),
    ...(email ? { email: email.href.slice('mailto:'.length) } : {}),
    ...(telephone ? { telephone: telephone.href.slice('tel:'.length) } : {}),
    ...(content.summary ? { description: content.summary } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}
