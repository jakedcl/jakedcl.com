'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { FeaturedProject } from '@/lib/content'
import PhotoRotator from './PhotoRotator'
import useReducedMotion from './useReducedMotion'

const PHOTO_MS = 3000
const MIN_TURN_MS = 6000

const nameLinkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors group-hover:text-signal-blue group-hover:decoration-signal-blue'

/**
 * Homepage feature. Every project marked "Featured on homepage" takes a turn, in Studio order.
 * Each turn lasts long enough for its screenshots to cycle once. Hover or keyboard focus pauses;
 * reduced motion turns the automatic turns off (the dots still switch projects).
 */
export default function FeaturedProjects({
  label,
  projects,
}: {
  label: string
  projects: FeaturedProject[]
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const count = projects.length
  const current = projects[index % Math.max(count, 1)]
  const turnMs = current ? Math.max(MIN_TURN_MS, current.photos.length * PHOTO_MS) : MIN_TURN_MS

  useEffect(() => {
    if (count < 2 || paused || reduced) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), turnMs)
    return () => window.clearTimeout(timer)
  }, [count, paused, reduced, turnMs, index])

  if (!current) return null

  return (
    <section
      className="mt-8 border-t border-ink/10 pt-8"
      {...(label ? { 'aria-label': label } : {})}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      {label ? (
        <p className="font-utility text-[0.65rem] uppercase tracking-[0.18em] text-ink/50">{label}</p>
      ) : null}

      <div key={current._id} className="featured-turn mt-3">
        <Link
          href={`/projects/${current.slug}`}
          className={`group grid gap-5 ${
            current.photos.length > 0 ? 'sm:grid-cols-[min(42%,13rem)_1fr] sm:items-start' : ''
          }`}
        >
          {current.photos.length > 0 ? (
            <PhotoRotator
              photos={current.photos}
              sizes="(min-width: 640px) 13rem, 100vw"
              paused={paused}
              priority={index === 0}
            />
          ) : null}
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
              <span className={nameLinkClass}>{current.name}</span>
            </h2>
            {current.pitch ? (
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/85">{current.pitch}</p>
            ) : null}
          </div>
        </Link>
      </div>

      {count > 1 ? (
        <div className="mt-4 flex gap-2">
          {projects.map((project, i) => (
            <button
              key={project._id}
              type="button"
              aria-label={project.name}
              aria-current={i === index % count ? 'true' : undefined}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-6 transition-colors ${
                i === index % count ? 'bg-signal-yellow' : 'bg-ink/15 hover:bg-ink/30'
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
