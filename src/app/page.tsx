import { Suspense, type ReactNode } from 'react'
import { resume } from '@/data/resume'
import { bioParagraphs, tagline } from '@/data/bio'
import IntroName from './components/IntroName'
import ProjectIndex from './components/ProjectIndex'
import { RoleList, SkillsList } from './components/ResumeSections'

export const revalidate = 0

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

export default function Home() {
  const email = resume.contact.find((item) => item.href.startsWith('mailto:'))
  const linkedin = resume.contact.find((item) => item.href.includes('linkedin'))
  const phone = resume.contact.find((item) => item.href.startsWith('tel:'))

  const links = [
    { label: 'GitHub', href: 'https://github.com/jakedcl' },
    linkedin ? { label: 'LinkedIn', href: linkedin.href } : null,
    email ? { label: 'Email', href: email.href } : null,
    phone ? { label: phone.label, href: phone.href } : null,
  ].filter((item): item is { label: string; href: string } => item !== null)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: resume.legalName,
    alternateName: 'Jake DCL',
    url: 'https://jakedcl.com',
    email: 'jakedecorelurker@gmail.com',
    telephone: '+1-347-733-1501',
    jobTitle: 'Web Developer',
    description: resume.summary,
    alumniOf: 'CUNY College of Staten Island',
    sameAs: ['https://github.com/jakedcl', 'https://www.linkedin.com/in/jakedcl'],
  }

  return (
    <div className="min-h-screen bg-background text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-[max(1.75rem,env(safe-area-inset-top))] sm:pt-14">
        <header>
          <IntroName />
          <p className="mt-5 text-sm text-ink/70">{resume.legalName}</p>
          <p className="font-utility mt-1 text-sm text-ink/60">{tagline}</p>
        </header>

        <div className="mt-8 space-y-4 text-[0.95rem] leading-relaxed text-ink/90 md:text-base">
          <p>{resume.summary}</p>
          {bioParagraphs.map((paragraph) =>
            paragraph.startsWith('TODO:') ? (
              <p
                key={paragraph}
                className="border-l-2 border-signal-yellow pl-3 text-ink/70"
              >
                {paragraph}
              </p>
            ) : (
              <p key={paragraph}>{paragraph}</p>
            ),
          )}
        </div>

        <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[0.95rem]">
          {links.map((link) => {
            const external = link.href.startsWith('http')
            return (
              <a
                key={link.href}
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
        <p className="mt-3 text-[0.95rem]">
          <a href="/resume.pdf" download="Jake_DeCore_Lurker_Resume.pdf" className={linkClass}>
            Download resume (PDF)
          </a>
        </p>

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

        <Section id="experience" title="Experience" accent={accents[1]}>
          <RoleList roles={resume.experience} empty="No experience listed." />
        </Section>

        <Section id="education" title="Education" accent={accents[2]}>
          <RoleList roles={resume.education} empty="No education listed." />
        </Section>

        <Section id="skills" title="Skills" accent={accents[3]}>
          <SkillsList />
        </Section>

        <Section id="certifications" title="Certifications" accent={accents[0]}>
          <RoleList roles={resume.certifications} empty="No certifications listed." />
        </Section>

        <footer className="mt-16 pt-4">
          <p className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
            JAKEDCL.COM · NYC
          </p>
        </footer>
      </main>
    </div>
  )
}
