import type { HomeRole, HomeSkillGroup } from '@/types/home'

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

function Org({ role }: { role: HomeRole }) {
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

export function RoleList({ roles }: { roles: HomeRole[] }) {
  if (roles.length === 0) return null

  return (
    <div>
      {roles.map((role) => (
        <article
          key={role._key ?? `${role.title}-${role.organization}`}
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

export function SkillsList({ groups }: { groups: HomeSkillGroup[] }) {
  if (groups.length === 0) return null

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group._key ?? group.label}>
          <h3 className="text-sm font-medium text-ink">{group.label}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink/80">
            {group.items.join(', ')}
          </p>
        </div>
      ))}
    </div>
  )
}
