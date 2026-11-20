import type { Certification, Role, SkillGroup } from '@/lib/content'
import { contentLinkClass } from '@/lib/contentLink'
import {
  portfolioBodySecondary,
  portfolioGapProseRelaxed,
  portfolioMetaPlain,
  portfolioSpaceNudge,
  portfolioSpaceTight,
  portfolioTextMeta,
  portfolioTextPrimary,
  portfolioTypeBody,
  portfolioTypeUi,
} from '@/lib/portfolioUi'

import NewTabNote from './NewTabNote'

const linkClass = contentLinkClass

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
    <article className="py-3">
      <div className="flex items-baseline justify-between gap-x-4">
        <h3 className={`min-w-0 leading-snug ${portfolioTypeBody} ${portfolioTextPrimary}`}>
          {title}
          {org ? (
            <>
              <span className={portfolioTextMeta}> - </span>
              {org}
            </>
          ) : null}
        </h3>
        {period ? (
          <p className={`shrink-0 text-right ${portfolioMetaPlain}`}>{period}</p>
        ) : null}
      </div>
      {bullets.length > 0 && (
        <ul
          className={`${portfolioSpaceNudge} list-disc space-y-1 pl-5 ${portfolioBodySecondary}`}
        >
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
              <span className={portfolioTextMeta}> · </span>
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
    <div className={portfolioGapProseRelaxed}>
      {groups.map((group) => (
        <div key={group._key ?? group.label}>
          <h3 className={`font-medium ${portfolioTypeUi} ${portfolioTextPrimary}`}>{group.label}</h3>
          <p className={`${portfolioSpaceTight} ${portfolioBodySecondary}`}>
            {group.items.join(', ')}
          </p>
        </div>
      ))}
    </div>
  )
}
