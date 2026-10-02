'use client'

import { resume, type ResumeLink, type ResumeRole } from '@/data/resume'
import { logoForSkill } from '@/data/skillLogos'
import { useEffect, useMemo, useRef, useState } from 'react'
import NameTypewriter from './NameTypewriter'
import SkillLogoLane from './SkillLogoLane'

const CHIP = [
  'bg-signal-yellow text-ink',
  'bg-signal-blue text-cream',
  'bg-signal-red text-cream',
  'bg-signal-green text-ink',
] as const

function ContactLine({ links }: { links: ResumeLink[] }) {
  const isPhone = (link: ResumeLink) => link.href.startsWith('tel:')
  const primary = links.filter((link) => !isPhone(link))
  const phone = links.find(isPhone)

  const renderLink = (link: ResumeLink) =>
    link.href ? (
      <a
        href={link.href}
        className="text-ink underline decoration-ink/25 underline-offset-2 transition-colors hover:text-signal-blue hover:decoration-signal-blue"
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
    <p className="font-utility flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.08em] text-ink/80">
      {primary.map((link, index) => (
        <span key={link.label} className="inline-flex items-center gap-2">
          {index > 0 && (
            <span className="text-ink/30" aria-hidden>
              ·
            </span>
          )}
          {renderLink(link)}
        </span>
      ))}
      {phone && (
        <>
          <span className="hidden text-ink/30 md:inline" aria-hidden>
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
    <h2 className="font-shape mb-4 border-b-2 border-ink pb-2 text-sm font-extrabold uppercase tracking-[0.08em] text-ink">
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
      className="underline decoration-ink/25 underline-offset-2 hover:text-signal-blue hover:decoration-signal-blue"
    >
      {children}
    </a>
  )
}

function RoleHeader({ role }: { role: ResumeRole }) {
  return (
    <div className="space-y-0.5">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-3">
        <h3 className="text-base font-medium leading-snug text-ink">{role.title}</h3>
        {role.period ? (
          <p className="font-utility text-xs uppercase tracking-[0.1em] text-ink/50 sm:shrink-0">
            {role.period}
          </p>
        ) : null}
      </div>
      <p className="text-sm leading-snug text-ink/75">
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
        <ul className="list-disc space-y-1 pl-4 text-sm leading-snug text-ink">
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

function logosForGroup(items: string[]) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of items) {
    const src = logoForSkill(item)
    if (!src || seen.has(src)) continue
    seen.add(src)
    out.push(src)
  }
  return out
}

export default function Resume({ part = 'all' }: { part?: 'all' | 'intro' | 'body' }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [motionActive, setMotionActive] = useState(false)

  const groupLogos = useMemo(
    () =>
      resume.skills.map((group) => ({
        label: group.label,
        logos: logosForGroup(group.items),
      })),
    [],
  )

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMotionActive(true)
          io.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`w-full text-ink ${part === 'body' ? 'space-y-10' : 'max-w-3xl space-y-4'}`}
    >
      {part !== 'body' && (
        <div className="space-y-3">
          <NameTypewriter active={motionActive} />
          <ContactLine links={resume.contact} />
          <p className="max-w-2xl text-sm leading-relaxed text-ink/90 md:text-base">
            {resume.summary}
          </p>
        </div>
      )}

      {part !== 'intro' && (
        <>
          {part === 'body' && (
            <div className="space-y-3 border-b-2 border-ink pb-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-utility text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                    Printout
                  </p>
                  <NameTypewriter active={motionActive} />
                </div>
                <span className="signal-badge bg-signal-yellow text-ink">CV</span>
              </div>
              <ContactLine links={resume.contact} />
            </div>
          )}

          <section>
            <SectionHeading>Education</SectionHeading>
            {resume.education.map((role) => (
              <article key={`${role.title}-${role.organization}`}>
                <RoleHeader role={role} />
              </article>
            ))}
          </section>

          {resume.certifications.length > 0 && (
            <section>
              <SectionHeading>Certification</SectionHeading>
              {resume.certifications.map((role) => (
                <article key={`${role.title}-${role.organization}`}>
                  <RoleHeader role={role} />
                </article>
              ))}
            </section>
          )}

          <section>
            <SectionHeading>Technical Skills</SectionHeading>
            <div className="space-y-5">
              {resume.skills.map((group, groupIndex) => {
                const logos =
                  groupLogos.find((g) => g.label === group.label)?.logos ?? []
                return (
                  <div key={group.label}>
                    <div className="mb-2 flex min-h-10 items-center gap-3">
                      <p className="font-shape shrink-0 text-xs font-bold uppercase tracking-[0.06em] text-ink/55">
                        {group.label}
                      </p>
                      <SkillLogoLane logos={logos} active={motionActive} />
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item, itemIndex) => (
                        <li
                          key={item}
                          className={`font-shape px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.02em] ${CHIP[(groupIndex + itemIndex) % CHIP.length]}`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-6">
              {resume.experience.map((role) => (
                <RoleEntry key={`${role.title}-${role.organization}`} role={role} />
              ))}
            </div>
            <p className="mt-8">
              <a
                href="/resume.pdf"
                download="Jake_DeCore_Lurker_Resume.pdf"
                className="stamp-btn stamp-btn-ink text-sm"
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
