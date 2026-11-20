'use client'

import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react'

import { contentLinkBareClass, contentLinkClass } from '@/lib/contentLink'
import type { FeaturedProject, Image } from '@/lib/content'
import sanityImageLoader from '@/lib/sanityImageLoader'
import PhotoRotator from './PhotoRotator'
import useReducedMotion from './useReducedMotion'

/** How long each featured project stays on screen. Photos advance at half this. */
const TURN_MS = 4500
const nameLinkClass = contentLinkClass

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
      className="featured-block mt-6 sm:mt-7"
      {...(label ? { 'aria-label': label } : {})}
    >
      {label ? (
        <p className="font-utility text-[0.65rem] uppercase tracking-[0.18em] text-ink/50">{label}</p>
      ) : null}

      <div className="featured-turn mt-2">
        <div
          className={`grid gap-4 ${
            shownPhotos.length > 0
              ? 'sm:grid-cols-[minmax(0,3fr)_minmax(0,5fr)] sm:items-start sm:gap-3.5'
              : ''
          }`}
        >
          {shownPhotos.length > 0 ? (
            <div className="featured-media min-w-0 w-full sm:col-start-2 sm:row-start-1">
              <Link
                href={`/work/${current.slug}`}
                aria-label={current.name}
                className={contentLinkBareClass}
                data-featured-pause=""
                onMouseEnter={pause}
                onMouseLeave={resumeUnlessMovingToPauseTarget}
                onFocus={pause}
                onBlur={resumeUnlessMovingToPauseTarget}
              >
                <PhotoRotator
                  photos={shownPhotos}
                  preloadPhotos={preloadPhotos}
                  sizes="(min-width: 640px) 26rem, 100vw"
                  intervalMs={photoMs}
                  fit="contain"
                  paused={paused}
                  priority={index === 0}
                  className="featured-photo-frame"
                />
              </Link>
              {count > 1 ? <FeaturedProgress projects={order} index={index} paused={paused} reduced={reduced} onGoTo={goTo} /> : null}
            </div>
          ) : null}
          <FeaturedCopy
            className={shownPhotos.length > 0 ? 'sm:col-start-1 sm:row-start-1' : undefined}
            projects={order}
            currentId={current._id}
            reduced={reduced}
            onPause={pause}
            onResume={resumeUnlessMovingToPauseTarget}
          />
        </div>
      </div>

      {shownPhotos.length === 0 && count > 1 ? (
        <FeaturedProgress projects={order} index={index} paused={paused} reduced={reduced} onGoTo={goTo} />
      ) : null}
    </section>
  )
}


function FeaturedProgress({
  projects,
  index,
  paused,
  reduced,
  onGoTo,
}: {
  projects: FeaturedProject[]
  index: number
  paused: boolean
  reduced: boolean
  onGoTo: (nextIndex: number) => void
}) {
  const count = projects.length
  return (
    /* 7px visual gap to the photo; the bars themselves are 13×2.5px.
       The button's hit area extends around the bar without changing that gap. */
    <div className="mt-[7px] flex justify-center gap-[3px]">
      {projects.map((project, i) => {
        const active = i === index % count
        return (
          <button
            key={project._id}
            type="button"
            aria-label={project.name}
            aria-current={active ? 'true' : undefined}
            onClick={() => onGoTo(i)}
            className="group relative h-[2.5px] w-[13px] after:absolute after:-inset-y-2 after:-inset-x-px"
          >
            <span className="relative block h-full w-full overflow-hidden rounded-[1px] bg-ink/15 group-hover:bg-ink/30">
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
            </span>
          </button>
        )
      })}
    </div>
  )
}

function FeaturedCopy({
  className,
  projects,
  currentId,
  reduced,
  onPause,
  onResume,
}: {
  className?: string
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
      <h2 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-[clamp(1rem,0.94rem+0.18vw,1.125rem)]">
        {interactive ? (
          <Link
            href={`/work/${project.slug}`}
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
      <div className={`featured-copy min-w-0${className ? ` ${className}` : ''}`}>
        {title(current, true)}
        {current.pitch ? (
          <p className="featured-pitch portfolio-body-copy-size mt-2 leading-relaxed text-ink/85">
            {current.pitch}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className={`featured-copy min-w-0 grid${className ? ` ${className}` : ''}`}>
      {projects.map((project) => (
        <div
          key={project._id}
          className={`col-start-1 row-start-1 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            project._id === currentId ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {title(project, project._id === currentId)}
          {project.pitch ? (
            <p className="featured-pitch portfolio-body-copy-size mt-2 leading-relaxed text-ink/85">
              {project.pitch}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  )
}
