import type { Certification, Role, SkillGroup } from '@/lib/content'
import NewTabNote from './NewTabNote'

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

function OutLink({ href, label, newTabNote }: { href: string; label: string; newTabNote: string }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      className={linkClass}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {label}
      {external ? <NewTabNote note={newTabNote} /> : null}
    </a>
  )
}

function Entry({
  title,
  org,
  period,
  bullets,
}: {
  title: string
  org: React.ReactNode
  period: string
  bullets: string[]
}) {
  return (
    <article className="py-4">
      <div className="flex items-baseline justify-between gap-x-4">
        <h3 className="min-w-0 text-[0.95rem] leading-snug text-ink">
          {title}
          {org ? (
            <>
              <span className="text-ink/40"> - </span>
              {org}
            </>
          ) : null}
        </h3>
        {period ? (
          <p className="font-utility shrink-0 text-right text-xs text-ink/55">{period}</p>
        ) : null}
      </div>
      {bullets.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink/85">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function RoleList({ roles, newTabNote }: { roles: Role[]; newTabNote: string }) {
  if (roles.length === 0) return null

  return (
    <div>
      {roles.map((role) => (
        <Entry
          key={role._key ?? `${role.title}-${role.organization}`}
          title={role.title}
          org={
            role.organizationUrl ? (
              <OutLink href={role.organizationUrl} label={role.organization} newTabNote={newTabNote} />
            ) : (
              role.organization
            )
          }
          period={role.period}
          bullets={role.bullets}
        />
      ))}
    </div>
  )
}

export function CertificationList({
  certifications,
  newTabNote,
}: {
  certifications: Certification[]
  newTabNote: string
}) {
  if (certifications.length === 0) return null

  return (
    <div>
      {certifications.map((cert) => {
        const link =
          cert.url && cert.linkText ? (
            <OutLink href={cert.url} label={cert.linkText} newTabNote={newTabNote} />
          ) : null
        const org =
          cert.issuer && link ? (
            <>
              {cert.issuer}
              <span className="text-ink/40"> · </span>
              {link}
            </>
          ) : (
            cert.issuer || link
          )
        return (
          <Entry
            key={cert._key ?? cert.name}
            title={cert.name}
            org={org}
            period={cert.date}
            bullets={[]}
          />
        )
      })}
    </div>
  )
}

export function SkillsList({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group._key ?? group.label}>
          <h3 className="text-sm font-medium text-ink">{group.label}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink/80">{group.items.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}
