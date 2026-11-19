'use client'

import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react'

import type { FeaturedProject, Image } from '@/lib/content'
import sanityImageLoader from '@/lib/sanityImageLoader'
import PhotoRotator from './PhotoRotator'
import useReducedMotion from './useReducedMotion'

/** How long each featured project stays on screen. Photos advance at half this. */
const TURN_MS = 4500
const nameLinkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

type Seed = { order: FeaturedProject[]; firstPhotos: Image[]; nextPhotos: Image[] }

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
  const seed = {
    order,
    firstPhotos: pickPhotos(order[0]?.photos ?? []),
    nextPhotos: order.length > 1 ? pickPhotos(order[1]?.photos ?? []) : [],
  }
  clientSeeds.set(projects, seed)
  return seed
}

function getServerSeed(projects: FeaturedProject[]): Seed {
  const cached = serverSeeds.get(projects)
  if (cached) return cached
  const seed = {
    order: projects,
    firstPhotos: firstPaintPhotos(projects[0]?.photos ?? []),
    nextPhotos: [] as Image[],
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

function preloadSanityImage(url: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  const src = sanityImageLoader({ src: url, width: 960, quality: 75 })
  const img = new window.Image()
  img.src = src
  if (img.decode) return img.decode().then(() => undefined, () => undefined)
  if (img.complete) return Promise.resolve()
  return new Promise((resolve) => {
    img.onload = () => resolve()
    img.onerror = () => resolve()
  })
}

function preloadAll(photos: Image[]): Promise<void> {
  if (photos.length === 0) return Promise.resolve()
  return Promise.all(photos.map((photo) => preloadSanityImage(photo.url))).then(() => undefined)
}

/**
 * Homepage feature. Every project marked "Featured on homepage" takes a turn.
 * Order is shuffled on each page load (after mount, so hydration stays stable).
 * Each turn shows two random screenshots — or one, if that's all the project
 * has — at half the turn interval. The next project's photos are preloaded so
 * a project change crossfades like a photo change, with no blank frame.
 * Hover or keyboard focus on the project title link or the photo pauses;
 * reduced motion turns the automatic turns off (the bars still switch projects).
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
  const [upcoming, setUpcoming] = useState<Image[] | null>(null)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const order = seed.order
  const count = order.length
  const current = order[index % Math.max(count, 1)]
  const shownPhotos = photos ?? seed.firstPhotos
  const preloadPhotos = upcoming ?? seed.nextPhotos
  const photoMs = TURN_MS / 2

  useEffect(() => {
    for (const photo of preloadPhotos) void preloadSanityImage(photo.url)
  }, [preloadPhotos])

  useEffect(() => {
    if (count < 2 || paused || reduced) return
    const nextIndex = (index + 1) % count
    const nextPhotos =
      preloadPhotos.length > 0 ? preloadPhotos : pickPhotos(order[nextIndex]?.photos ?? [])
    const following = pickPhotos(order[(nextIndex + 1) % count]?.photos ?? [])
    const timer = window.setTimeout(() => {
      void preloadAll(nextPhotos.slice(0, 1)).finally(() => {
        setIndex(nextIndex)
        setPhotos(nextPhotos)
        setUpcoming(following)
      })
    }, TURN_MS)
    return () => window.clearTimeout(timer)
  }, [count, paused, reduced, index, order, preloadPhotos])

  function goTo(nextIndex: number) {
    if (nextIndex === index) return
    const nextIsPreloaded = nextIndex === (index + 1) % count && preloadPhotos.length > 0
    const nextPhotos = nextIsPreloaded
      ? preloadPhotos
      : pickPhotos(order[nextIndex]?.photos ?? [])
    const following = pickPhotos(order[(nextIndex + 1) % count]?.photos ?? [])
    void preloadAll(nextPhotos.slice(0, 1)).finally(() => {
      setIndex(nextIndex)
      setPhotos(nextPhotos)
      setUpcoming(following)
    })
  }

  if (!current) return null

  function pause() {
    setPaused(true)
  }

  function resumeUnlessMovingToPauseTarget(event: { relatedTarget: EventTarget | null }) {
    const next = event.relatedTarget
    if (next instanceof Element && next.closest('[data-featured-pause]')) return
    setPaused(false)
  }

  return (
    <section
      className="featured-block mt-6"
      {...(label ? { 'aria-label': label } : {})}
    >
      {label ? (
        <p className="font-utility text-[0.65rem] uppercase tracking-[0.18em] text-ink/50">{label}</p>
      ) : null}

      <div className="featured-turn mt-3">
        <div
          className={`grid gap-5 ${
            shownPhotos.length > 0 ? 'sm:grid-cols-[auto_1fr] sm:items-start' : ''
          }`}
        >
          {shownPhotos.length > 0 ? (
            <Link
              href={`/projects/${current.slug}`}
              aria-label={current.name}
              data-featured-pause=""
              onMouseEnter={pause}
              onMouseLeave={resumeUnlessMovingToPauseTarget}
              onFocus={pause}
              onBlur={resumeUnlessMovingToPauseTarget}
            >
              <PhotoRotator
                photos={shownPhotos}
                preloadPhotos={preloadPhotos}
                sizes="(min-width: 640px) 16rem, 100vw"
                intervalMs={photoMs}
                fit="contain"
                paused={paused}
                priority={index === 0}
                className="featured-photo-frame"
              />
            </Link>
          ) : null}
          <FeaturedCopy
            projects={order}
            currentId={current._id}
            reduced={reduced}
            onPause={pause}
            onResume={resumeUnlessMovingToPauseTarget}
          />
        </div>
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

function FeaturedCopy({
  projects,
  currentId,
  reduced,
  onPause,
  onResume,
}: {
  projects: FeaturedProject[]
  currentId: string
  reduced: boolean
  onPause: () => void
  onResume: (event: { relatedTarget: EventTarget | null }) => void
}) {
  /* Every project's title and pitch stay stacked in the same grid cell so the
     block keeps a stable height, and the outgoing copy stays visible until the
     incoming one is ready (the parent waits for the next photo). They then
     crossfade together. Only the current title is a link, so hover and
     keyboard focus on that link (not the pitch) can pause the rotation. */
  function title(project: FeaturedProject, interactive: boolean) {
    return (
      <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
        {interactive ? (
          <Link
            href={`/projects/${project.slug}`}
            className={nameLinkClass}
            data-featured-pause=""
            onMouseEnter={onPause}
            onMouseLeave={onResume}
            onFocus={onPause}
            onBlur={onResume}
          >
            {project.name}
          </Link>
        ) : (
          <span className={nameLinkClass}>{project.name}</span>
        )}
      </h2>
    )
  }

  if (reduced) {
    const current = projects.find((project) => project._id === currentId)
    if (!current) return null
    return (
      <div>
        {title(current, true)}
        {current.pitch ? (
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/85">{current.pitch}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="grid">
      {projects.map((project) => (
        <div
          key={project._id}
          className={`col-start-1 row-start-1 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            project._id === currentId ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {title(project, project._id === currentId)}
          {project.pitch ? (
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/85">{project.pitch}</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}
