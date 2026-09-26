'use client'

import { resume, type ResumeLink, type ResumeRole } from '@/data/resume'
import NameTypewriter from './NameTypewriter'

function ContactLine({ links }: { links: ResumeLink[] }) {
  const isPhone = (link: ResumeLink) => link.href.startsWith('tel:')
  const primary = links.filter((link) => !isPhone(link))
  const phone = links.find(isPhone)

  const renderLink = (link: ResumeLink) =>
    link.href ? (
      <a
        href={link.href}
        className="hover:underline"
        {...(link.href.startsWith('http')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {link.label}
      </a>
    ) : (
      <span>{link.label}</span>
    )

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-800">
      {primary.map((link, index) => (
        <span key={link.label} className="inline-flex items-center gap-2">
          {index > 0 && <span className="text-neutral-400" aria-hidden>·</span>}
          {renderLink(link)}
        </span>
      ))}
      {phone && (
        <>
          <span className="hidden text-neutral-400 md:inline" aria-hidden>
            ·
          </span>
          <span className="hidden md:inline">{renderLink(phone)}</span>
        </>
      )}
    </p>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-neutral-300 pb-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-neutral-500">
      {children}
    </h2>
  )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      {children}
    </a>
  )
}

function RoleHeader({ role }: { role: ResumeRole }) {
  return (
    <div className="space-y-0.5">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-3">
        <h3 className="text-base font-medium leading-snug text-black">
          {role.title}
        </h3>
        <p className="text-sm text-neutral-500 sm:shrink-0">
          {role.period}
        </p>
      </div>
      <p className="text-sm leading-snug text-neutral-700">
        {role.organizationUrl ? (
          <ExternalLink href={role.organizationUrl}>{role.organization}</ExternalLink>
        ) : (
          role.organization
        )}
      </p>
    </div>
  )
}

function RoleEntry({ role }: { role: ResumeRole }) {
  return (
    <article className="space-y-2">
      <RoleHeader role={role} />
      {role.bullets.length > 0 && (
        <ul className="list-disc space-y-1 pl-4 text-sm leading-snug text-neutral-900">
          {role.bullets.map((bullet) => (
            <li key={bullet} className="pl-0.5">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default function Resume({ part = 'all' }: { part?: 'all' | 'intro' | 'body' }) {
  return (
    <div
      className={`w-full text-black ${part === 'body' ? 'space-y-10' : 'max-w-3xl space-y-4'}`}
    >
      {part !== 'body' && (
        <div className="space-y-3">
          <NameTypewriter />
          <ContactLine links={resume.contact} />
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-900 md:text-base">
            {resume.summary}
          </p>
        </div>
      )}

        {part !== 'intro' && (
        <>
          <section>
            <SectionHeading>Education</SectionHeading>
            {resume.education.map((role) => (
              <article key={`${role.title}-${role.organization}`}>
                <RoleHeader role={role} />
              </article>
            ))}
          </section>

          <section>
            <SectionHeading>Technical Skills</SectionHeading>
            <dl className="space-y-2 text-sm leading-snug">
              {resume.skills.map((group) => (
                <div key={group.label} className="grid gap-0.5 sm:grid-cols-[9.5rem_1fr] sm:gap-x-6">
                  <dt className="font-medium text-black">{group.label}</dt>
                  <dd className="text-neutral-800">{group.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-6">
              {resume.experience.map((role) => (
                <RoleEntry key={`${role.title}-${role.organization}`} role={role} />
              ))}
            </div>
            <p className="mt-4 text-sm">
              <a
                href="/resume.pdf"
                download="Jake_DeCore_Lurker_Resume.pdf"
                className="hover:underline"
              >
                Download Resume PDF
              </a>
            </p>
          </section>
        </>
      )}
    </div>
  )
}
