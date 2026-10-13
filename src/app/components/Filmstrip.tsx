'use client'

import { urlFor } from '@/sanity/lib/image'
import type { Project, SanityImage } from '@/types/sanity'
import type { PortableTextBlock } from 'next-sanity'
import { useCallback, useEffect, useRef, useState } from 'react'
import FilmStrip3D, { type FilmStripItem } from './FilmStrip3D'

const GROUP = 3
const FRAME_ASPECT = 4 / 3
const STEP_MS = 5000

const mod = (n: number, m: number) => ((n % m) + m) % m

function blockText(block: PortableTextBlock | undefined) {
  if (!block || !Array.isArray(block.children)) return ''
  return block.children
    .map((child) =>
      child && typeof child === 'object' && 'text' in child && typeof child.text === 'string'
        ? child.text
        : '',
    )
    .join('')
    .trim()
}

function shotUrl(shot: SanityImage, width: number, height: number) {
  if (!shot.asset?.url && !shot.asset?._ref) return ''
  try {
    return urlFor(shot).width(width).height(height).fit('crop').auto('format').quality(68).url()
  } catch {
    return shot.asset?.url ?? ''
  }
}

function framesFor(projects: Project[]): FilmStripItem[] {
  const frames: FilmStripItem[] = []
  for (const project of projects) {
    const blocks = project.title ?? []
    const title = blockText(blocks.find((block) => block.style === 'h3') ?? blocks[0]) || 'Untitled'
    const description = blocks.length > 1 ? blockText(blocks[1]) : ''
    const stack = (project.stack ?? []).map((item) => item.trim()).filter(Boolean)
    frames.push({
      src: '',
      alt: title,
      label: `Open ${title}`,
      aspect: FRAME_ASPECT,
      copy: { title, description, stack },
    })
    for (let i = 0; i < 2; i++) {
      const shot = project.screenshots?.[i]
      const src = shot ? shotUrl(shot, 480, 360) : ''
      const src2x = shot ? shotUrl(shot, 800, 600) : ''
      frames.push({
        src,
        src2x: src2x || undefined,
        placeholder: shot?.asset?.metadata?.lqip,
        alt: shot?.alt || `${title} screenshot ${i + 1}`,
        label: `Open ${title}`,
        aspect: FRAME_ASPECT,
      })
    }
  }
  return frames
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M10 3 L5 8 L10 13' : 'M6 3 L11 8 L6 13'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  )
}

export default function Filmstrip({
  projects,
  entrance = false,
}: {
  projects: Project[]
  entrance?: boolean
}) {
  const [cursor, setCursor] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [revealed, setRevealed] = useState(!entrance)
  const sectionRef = useRef<HTMLElement>(null)
  const cursorRef = useRef(0)
  cursorRef.current = cursor

  const count = projects.length
  const index = count ? mod(cursor, count) : 0
  const project = projects[index]
  const blocks = project?.title ?? []
  const title = blockText(blocks.find((block) => block.style === 'h3') ?? blocks[0]) || 'Untitled'
  const description = blocks.length > 1 ? blockText(blocks[1]) : ''

  const onReady = useCallback(() => setRevealed(true), [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    if (reduced || hovering || engaged || hidden || count < 2) return
    const id = window.setTimeout(() => setCursor((c) => c + 1), STEP_MS)
    return () => window.clearTimeout(id)
  }, [reduced, hovering, engaged, hidden, count, cursor])

  const open = useCallback(() => {
    const current = projects[mod(cursorRef.current, projects.length)]
    const href = current?.link || 'https://example.com'
    window.open(href, '_blank', 'noopener,noreferrer')
  }, [projects])

  const step = (dir: 1 | -1) => setCursor((c) => c + dir)

  const onSectionClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('[data-film-nav]')) return
    if (e.currentTarget.getAttribute('data-suppress-click')) {
      e.currentTarget.removeAttribute('data-suppress-click')
      return
    }
    open()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      step(e.key === 'ArrowRight' ? 1 : -1)
      return
    }
    if (e.key !== 'Enter' && e.key !== ' ') return
    if ((e.target as HTMLElement).closest('[data-film-nav]')) return
    e.preventDefault()
    open()
  }

  const items = framesFor(projects)

  return (
    <section
      ref={sectionRef}
      id="work"
      data-film-showcase=""
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label={`${title}. ${description}`.trim()}
      className={`relative w-full overflow-x-clip overflow-y-visible outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal-yellow ${
        entrance ? (revealed ? 'hero-film-in' : 'hero-film-hold') : ''
      }`}
      style={{
        ['--fs3d-height' as string]: 'clamp(220px, 36svh, 300px)',
        ['--fs3d-height-md' as string]: 'clamp(420px, 56svh, 640px)',
        ['--fs3d-ink' as string]: 'var(--signal-yellow)',
      }}
      onClick={onSectionClick}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHovering(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setHovering(false)
      }}
    >
      <p className="sr-only" aria-live="polite">
        {title}
        {description ? `. ${description}` : ''}
      </p>
      <FilmStrip3D
        items={items}
        stepSize={GROUP}
        groupCursor={cursor}
        speed={0}
        variant="loop"
        turnSharpness={1}
        depth={1}
        ariaLabel={`${title} film strip`}
        onReady={entrance ? onReady : undefined}
        onStep={step}
        onEngageChange={setEngaged}
        onSelect={open}
      />
      <button
        type="button"
        data-film-nav=""
        aria-label="Previous project"
        className="absolute top-1/2 left-1 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-ink/15 bg-cream/90 text-ink shadow-[2px_2px_0_0_rgba(10,10,10,0.08)] transition-colors hover:bg-signal-yellow md:left-2"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          step(-1)
        }}
      >
        <Arrow dir="left" />
      </button>
      <button
        type="button"
        data-film-nav=""
        aria-label="Next project"
        className="absolute top-1/2 right-1 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-ink/15 bg-cream/90 text-ink shadow-[2px_2px_0_0_rgba(10,10,10,0.08)] transition-colors hover:bg-signal-yellow md:right-2"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          step(1)
        }}
      >
        <Arrow dir="right" />
      </button>
    </section>
  )
}
