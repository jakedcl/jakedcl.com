'use client'

import type { ReactNode } from 'react'
import { resume, type ResumeLink, type ResumeRole } from '@/data/resume'
import { ScrollFocus } from './ScrollFocus'
import TextMotion from './TextMotion'

function ContactLine({ links, compact = false }: { links: ResumeLink[]; compact?: boolean }) {
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
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-700 ${
        compact ? 'text-[11px]' : 'text-sm md:text-base'
      }`}
    >
      {primary.map((link, index) => (
        <span key={link.label} className="inline-flex items-center gap-2">
          {index > 0 && (
            <span className="text-neutral-400" aria-hidden>
              |
            </span>
          )}
          {renderLink(link)}
        </span>
      ))}
      {phone && (
        <>
          <span className="hidden text-neutral-400 md:inline" aria-hidden>
            |
          </span>
          <span className={compact ? 'inline' : 'hidden md:inline'}>{renderLink(phone)}</span>
        </>
      )}
    </p>
  )
}

function SectionHeading({
  children,
  compact = false,
}: {
  children: ReactNode
  compact?: boolean
}) {
  return (
    <h2
      className={`mb-3 border-b pb-1 font-bold uppercase tracking-wide text-black ${
        compact ? 'border-neutral-300 text-[10px]' : 'border-neutral-200 text-xs sm:text-sm'
      }`}
    >
      {children}
    </h2>
  )
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 transition-colors hover:text-black"
    >
      {children}
    </a>
  )
}

function RoleHeader({ role, compact = false }: { role: ResumeRole; compact?: boolean }) {
  return (
    <div className="space-y-0.5">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-3">
        <h3
          className={`font-semibold leading-snug text-black ${
            compact ? 'text-[12px]' : 'text-[0.95rem] sm:text-base md:text-lg'
          }`}
        >
          {role.title}
        </h3>
        <p className={`text-neutral-500 ${compact ? 'text-[10px]' : 'text-xs sm:text-sm sm:text-neutral-600'}`}>
          {role.period}
        </p>
      </div>
      <p className={`leading-snug text-neutral-600 ${compact ? 'text-[11px]' : 'text-sm'}`}>
        {role.organizationUrl ? (
          <ExternalLink href={role.organizationUrl}>{role.organization}</ExternalLink>
        ) : (
          role.organization
        )}
      </p>
    </div>
  )
}

function RoleEntry({ role, compact = false }: { role: ResumeRole; compact?: boolean }) {
  return (
    <article className="space-y-2">
      <RoleHeader role={role} compact={compact} />
      {role.bullets.length > 0 && (
        <ul
          className={`list-disc space-y-1.5 pl-4 text-neutral-800 ${
            compact ? 'text-[11px] leading-snug' : 'text-sm leading-snug sm:pl-5 sm:leading-relaxed md:text-base'
          }`}
        >
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

function PaperResume() {
  return (
    <div className="w-full space-y-4 text-black">
      <div className="space-y-2">
        <p className="text-base font-medium leading-tight text-neutral-900">{resume.legalName}</p>
        <ContactLine links={resume.contact} compact />
        <p className="text-[11px] leading-snug text-neutral-800">{resume.summary}</p>
      </div>

      <section>
        <SectionHeading compact>Technical Skills</SectionHeading>
        <ul className="space-y-2 text-[11px]">
          {resume.skills.map((group) => (
            <li key={group.label} className="leading-snug">
              <p className="mb-0.5 font-semibold text-black">{group.label}</p>
              <p className="text-neutral-800">{group.items.join(', ')}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading compact>Experience</SectionHeading>
        <div className="space-y-3">
          {resume.experience.map((role) => (
            <RoleEntry key={`${role.title}-${role.organization}`} role={role} compact />
          ))}
        </div>
        <p className="mt-3 text-[11px] text-neutral-500">
          <a
            href="/resume.pdf"
            download="Jake_DeCore_Lurker_Resume.pdf"
            className="underline underline-offset-2 transition-colors hover:text-black"
          >
            Download Resume PDF
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <SectionHeading compact>Education</SectionHeading>
        {resume.education.map((role) => (
          <article key={`${role.title}-${role.organization}`}>
            <RoleHeader role={role} compact />
          </article>
        ))}
      </section>
    </div>
  )
}

export default function Resume({ variant = 'default' }: { variant?: 'default' | 'paper' }) {
  if (variant === 'paper') {
    return <PaperResume />
  }

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
