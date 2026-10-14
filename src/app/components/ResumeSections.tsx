import { resume, type ResumeRole } from '@/data/resume'

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

function Org({ role }: { role: ResumeRole }) {
  if (!role.organizationUrl) return role.organization
  const external = role.organizationUrl.startsWith('http')
  return (
    <a
      href={role.organizationUrl}
      className={linkClass}
      {...(external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    >
      {role.organization}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  )
}

export function RoleList({
  roles,
  empty,
}: {
  roles: ResumeRole[]
  empty: string
}) {
  if (roles.length === 0) {
    return <p className="text-sm text-ink/55">{empty}</p>
  }

  return (
    <div>
      {roles.map((role) => (
        <article
          key={`${role.title}-${role.organization}`}
          className="py-4"
        >
          <div className="flex items-baseline justify-between gap-x-4">
            <h3 className="min-w-0 text-[0.95rem] leading-snug text-ink">
              {role.title}
              <span className="text-ink/40"> - </span>
              <Org role={role} />
            </h3>
            {role.period ? (
              <p className="font-utility shrink-0 text-right text-xs text-ink/55">
                {role.period}
              </p>
            ) : null}
          </div>
          {role.bullets.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink/85">
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  )
}

export function SkillsList() {
  if (resume.skills.length === 0) {
    return <p className="text-sm text-ink/55">No skills listed.</p>
  }

  return (
    <div className="space-y-5">
      {resume.skills.map((group) => (
        <div key={group.label}>
          <h3 className="text-sm font-medium text-ink">{group.label}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink/80">
            {group.items.length > 0 ? group.items.join(', ') : 'None listed.'}
          </p>
        </div>
      ))}
    </div>
  )
}
