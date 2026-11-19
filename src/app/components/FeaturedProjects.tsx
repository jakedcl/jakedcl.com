'use client'

import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react'

import type { FeaturedProject, Image } from '@/lib/content'
import PhotoRotator from './PhotoRotator'
import useReducedMotion from './useReducedMotion'

/** How long each featured project stays on screen. Photos advance at half this. */
const TURN_MS = 3000

const nameLinkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors group-hover:text-signal-blue group-hover:decoration-signal-blue'

type Seed = { order: FeaturedProject[]; firstPhotos: Image[] }

const clientSeeds = new WeakMap<FeaturedProject[], Seed>()
const serverSeeds = new WeakMap<FeaturedProject[], Seed>()

function emptySubscribe() {
  return () => {}
}

function shuffled<T>(items: T[]): T[] {
  const next = items.slice()
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const left = next[i]
    const right = next[j]
    if (left === undefined || right === undefined) continue
    next[i] = right
    next[j] = left
  }
  return next
}

function pickPhotos(photos: Image[]): Image[] {
  if (photos.length <= 1) return photos
  return shuffled(photos).slice(0, 2)
}

/** First paint only: a deterministic slice so server HTML matches hydration. */
function firstPaintPhotos(photos: Image[]): Image[] {
  return photos.slice(0, Math.min(2, photos.length))
}

function getClientSeed(projects: FeaturedProject[]): Seed {
  const cached = clientSeeds.get(projects)
  if (cached) return cached
  const order = shuffled(projects)
  const seed = { order, firstPhotos: pickPhotos(order[0]?.photos ?? []) }
  clientSeeds.set(projects, seed)
  return seed
}

function getServerSeed(projects: FeaturedProject[]): Seed {
  const cached = serverSeeds.get(projects)
  if (cached) return cached
  const seed = {
    order: projects,
    firstPhotos: firstPaintPhotos(projects[0]?.photos ?? []),
  }
  serverSeeds.set(projects, seed)
  return seed
}

function useFeaturedSeed(projects: FeaturedProject[]): Seed {
  return useSyncExternalStore(
    emptySubscribe,
    () => getClientSeed(projects),
    () => getServerSeed(projects),
  )
}

/**
 * Homepage feature. Every project marked "Featured on homepage" takes a turn.
 * Order is shuffled on each page load (after mount, so hydration stays stable).
 * Each turn shows two random screenshots — or one, if that's all the project
 * has — at half the turn interval. Hover or keyboard focus pauses; reduced
 * motion turns the automatic turns off (the bars still switch projects).
 */
export default function FeaturedProjects({
  label,
  projects,
}: {
  label: string
  projects: FeaturedProject[]
}) {
  const seed = useFeaturedSeed(projects)
  const [index, setIndex] = useState(0)
  const [photos, setPhotos] = useState<Image[] | null>(null)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const order = seed.order
  const count = order.length
  const current = order[index % Math.max(count, 1)]
  const shownPhotos = photos ?? seed.firstPhotos
  const photoMs = TURN_MS / 2

  useEffect(() => {
    if (count < 2 || paused || reduced) return
    const timer = window.setTimeout(() => {
      const nextIndex = (index + 1) % count
      const nextProject = order[nextIndex]
      setIndex(nextIndex)
      setPhotos(pickPhotos(nextProject?.photos ?? []))
    }, TURN_MS)
    return () => window.clearTimeout(timer)
  }, [count, paused, reduced, index, order])

  function goTo(nextIndex: number) {
    const nextProject = order[nextIndex]
    setIndex(nextIndex)
    setPhotos(pickPhotos(nextProject?.photos ?? []))
  }

  if (!current) return null

  return (
    <section
      className="featured-block mt-8 border-t border-ink/10 pt-8"
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
            shownPhotos.length > 0 ? 'sm:grid-cols-[auto_1fr] sm:items-start' : ''
          }`}
        >
          {shownPhotos.length > 0 ? (
            <PhotoRotator
              key={shownPhotos.map((photo) => photo.url).join('|')}
              photos={shownPhotos}
              sizes="(min-width: 640px) 16rem, 100vw"
              intervalMs={photoMs}
              fit="contain"
              paused={paused}
              priority={index === 0}
              className="featured-photo-frame"
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
          {order.map((project, i) => {
            const active = i === index % count
            return (
              <button
                key={project._id}
                type="button"
                aria-label={project.name}
                aria-current={active ? 'true' : undefined}
                onClick={() => goTo(i)}
                className="relative h-1.5 w-6 overflow-hidden bg-ink/15 hover:bg-ink/30"
              >
                {active ? (
                  <span
                    key={index}
                    className={`featured-progress-fill absolute inset-0 origin-left bg-signal-yellow ${
                      reduced ? 'scale-x-100' : ''
                    }`}
                    style={
                      reduced
                        ? undefined
                        : ({
                            '--featured-turn': `${TURN_MS}ms`,
                            animationPlayState: paused ? 'paused' : 'running',
                          } as CSSProperties)
                    }
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
