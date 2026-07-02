'use client'

import { resume, type ResumeLink, type ResumeRole } from '@/data/resume'
import { ScrollFocus } from './ScrollFocus'
import TextMotion from './TextMotion'

function ContactLine({ links }: { links: ResumeLink[] }) {
  const isPhone = (link: ResumeLink) => link.href.startsWith('tel:')
  const primary = links.filter((link) => !isPhone(link))
  const phone = links.find(isPhone)

  const renderLink = (link: ResumeLink) =>
    link.href ? (
      <a
        href={link.href}
        className="underline underline-offset-2 transition-colors hover:text-black"
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
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-700 md:text-base">
      {primary.map((link, index) => (
        <span key={link.label} className="inline-flex items-center gap-2">
          {index > 0 && <span className="text-neutral-400" aria-hidden>|</span>}
          {renderLink(link)}
        </span>
      ))}
      {phone && (
        <>
          <span className="hidden text-neutral-400 md:inline" aria-hidden>
            |
          </span>
          <span className="hidden md:inline">{renderLink(phone)}</span>
        </>
      )}
    </p>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-neutral-200 pb-1 text-xs font-bold uppercase tracking-wide text-black sm:text-sm">
      {children}
    </h2>
  )
}

function RoleHeader({ role }: { role: ResumeRole }) {
  return (
    <div className="space-y-0.5">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-3">
        <h3 className="text-[0.95rem] font-semibold leading-snug text-black sm:text-base md:text-lg">
          {role.title}
        </h3>
        <p className="text-xs text-neutral-500 sm:shrink-0 sm:text-sm sm:text-neutral-600">
          {role.period}
        </p>
      </div>
      <p className="text-sm leading-snug text-neutral-600">{role.organization}</p>
    </div>
  )
}

function RoleEntry({ role }: { role: ResumeRole }) {
  return (
    <article className="space-y-2">
      <RoleHeader role={role} />
      {role.bullets.length > 0 && (
        <ul className="list-disc space-y-1.5 pl-4 text-sm leading-snug text-neutral-800 sm:pl-5 sm:leading-relaxed md:text-base">
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

export default function Resume() {
  return (
    <TextMotion>
      <div className="w-full max-w-3xl space-y-6 text-black sm:space-y-8">
        <ScrollFocus intensity="normal">
          <div className="space-y-2.5 sm:space-y-3">
            <p className="text-xl font-medium leading-tight text-neutral-900 sm:text-lg md:text-xl">
              {resume.legalName}
            </p>
            <ContactLine links={resume.contact} />
            <p className="text-sm leading-snug text-neutral-800 sm:leading-relaxed md:text-base">
              {resume.summary}
            </p>
          </div>
        </ScrollFocus>

        <ScrollFocus intensity="subtle">
          <section className="space-y-2 sm:space-y-3">
            <SectionHeading>Education</SectionHeading>
            {resume.education.map((role) => (
              <article key={`${role.title}-${role.organization}`}>
                <RoleHeader role={role} />
              </article>
            ))}
          </section>
        </ScrollFocus>

        <ScrollFocus intensity="subtle">
          <section>
            <SectionHeading>Technical Skills</SectionHeading>
            <ul className="space-y-3 text-sm sm:space-y-2 sm:text-base">
              {resume.skills.map((group) => (
                <li key={group.label} className="leading-snug sm:leading-relaxed">
                  <p className="mb-0.5 font-semibold text-black">{group.label}</p>
                  <p className="text-neutral-800">{group.items.join(', ')}</p>
                </li>
              ))}
            </ul>
          </section>
        </ScrollFocus>

        <ScrollFocus intensity="normal">
          <section>
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-4 sm:space-y-5">
              {resume.experience.map((role) => (
                <RoleEntry key={`${role.title}-${role.organization}`} role={role} />
              ))}
            </div>
            <p className="mt-3 text-sm text-neutral-500">
              <a
                href="/resume.pdf"
                download="Jake_DeCore_Lurker_Resume.pdf"
                className="underline underline-offset-2 transition-colors hover:text-black"
              >
                Download Resume PDF
              </a>
            </p>
          </section>
        </ScrollFocus>
      </div>
    </TextMotion>
  )
}
