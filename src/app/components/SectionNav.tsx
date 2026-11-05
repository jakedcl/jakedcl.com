'use client'

import Link from 'next/link'
import { useLayoutEffect, useRef, useState } from 'react'

import type { SectionNavItem, SectionSlug } from '@/lib/sections'

const linkBase =
  'section-nav-link font-shape text-sm font-bold tracking-tight text-ink underline underline-offset-[4px] decoration-2 transition-colors hover:text-signal-blue'

const accentBullet: Record<string, string> = {
  'decoration-signal-yellow': 'before:bg-signal-yellow',
  'decoration-signal-blue': 'before:bg-signal-blue',
  'decoration-signal-red': 'before:bg-signal-red',
  'decoration-signal-green': 'before:bg-signal-green',
  'decoration-signal-purple': 'before:bg-signal-purple',
}

const NAV_GAP_PX = 16
const NAV_MOTION_MS = 280
const NAV_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function linkClass(item: SectionNavItem, dropped: boolean) {
  const bullet = accentBullet[item.accentDecoration] ?? 'before:bg-signal-purple'
  return [
    linkBase,
    item.accentDecoration,
    dropped ? `section-nav-link--dropped before:content-[""] ${bullet}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export default function SectionNav({
  items,
  active,
}: {
  items: SectionNavItem[]
  active?: SectionSlug
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const prevRects = useRef<Map<string, DOMRect>>(new Map())
  const [slotLeft, setSlotLeft] = useState<Record<string, number>>({})

  useLayoutEffect(() => {
    const measure = measureRef.current
    if (measure) {
      const nextSlots: Record<string, number> = {}
      items.forEach((item) => {
        const el = measure.querySelector<HTMLElement>(
          `[data-measure-slug="${item.slug}"]`,
        )
        if (el) nextSlots[item.slug] = el.offsetLeft
      })
      setSlotLeft(nextSlots)
    }

    const track = trackRef.current
    if (!track) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const links = track.querySelectorAll<HTMLElement>('[data-nav-slug]')
    const nextRects = new Map<string, DOMRect>()

    links.forEach((link) => {
      const slug = link.dataset.navSlug
      if (!slug) return
      const next = link.getBoundingClientRect()
      nextRects.set(slug, next)

      if (reduced) return

      const prev = prevRects.current.get(slug)
      if (!prev) return

      const dx = prev.left - next.left
      const dy = prev.top - next.top
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return

      link.style.transition = 'none'
      link.style.transform = `translate(${dx}px, ${dy}px)`

      requestAnimationFrame(() => {
        link.style.transition = `transform ${NAV_MOTION_MS}ms ${NAV_EASE}`
        link.style.transform = ''
        const onEnd = () => {
          link.style.transition = ''
          link.removeEventListener('transitionend', onEnd)
        }
        link.addEventListener('transitionend', onEnd)
      })
    })

    prevRects.current = nextRects
  }, [active, items])

  if (items.length === 0) return null

  const hasDrop = active !== undefined

  return (
    <nav aria-label="Site sections" className="section-nav">
      <div
        ref={measureRef}
        aria-hidden
        className="section-nav-measure pointer-events-none absolute left-0 top-0 flex h-0 flex-nowrap gap-x-4 overflow-hidden opacity-0"
      >
        {items.map((item) => (
          <span
            key={`measure-${item.slug}`}
            data-measure-slug={item.slug}
            className={`${linkBase} ${item.accentDecoration}`}
          >
            {item.label}
          </span>
        ))}
      </div>

      <div
        ref={trackRef}
        className={
          hasDrop
            ? 'section-nav-track section-nav-track--drop relative flex flex-nowrap gap-x-4'
            : 'section-nav-track relative flex flex-nowrap gap-x-4'
        }
      >
        {items.map((item) => {
          const dropped = active === item.slug
          const left = slotLeft[item.slug] ?? 0

          return (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              data-nav-slug={item.slug}
              data-dropped={dropped ? 'true' : undefined}
              className={linkClass(item, dropped)}
              style={
                dropped
                  ? {
                      left: `${left}px`,
                      marginTop: `${NAV_GAP_PX / 2}px`,
                    }
                  : undefined
              }
              {...(dropped ? { 'aria-current': 'page' as const } : {})}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
