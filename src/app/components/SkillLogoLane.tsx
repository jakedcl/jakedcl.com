'use client'

type Props = {
  logos: string[]
  active: boolean
}

/** Logos drop into the row with a short CSS stagger — no canvas, no physics. */
export default function SkillLogoLane({ logos, active }: Props) {
  if (logos.length === 0) return null

  return (
    <div className="flex min-h-10 min-w-0 flex-1 flex-wrap items-center gap-2">
      {logos.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          width={20}
          height={16}
          decoding="async"
          className={`skill-logo h-4 w-auto object-contain ${active ? 'skill-logo-in' : ''}`}
          style={{ animationDelay: `${i * 45}ms` }}
          aria-hidden
        />
      ))}
    </div>
  )
}
