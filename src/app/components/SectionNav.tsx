'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef } from 'react'

import {
  contentLinkMarkClass,
  contentLinkRowClass,
} from '@/lib/contentLink'
import {
  portfolioTextPrimary,
  portfolioTypeNav,
  portfolioTypeUi,
} from '@/lib/portfolioUi'
import type { SectionSlug } from '@/lib/routes'
import type { SectionNavItem } from '@/lib/sections'

const rowLinkBase = `section-nav-link ${portfolioTypeNav} ${portfolioTextPrimary} underline underline-offset-[4px] decoration-2 transition-colors`

const droppedTitleBase = `section-nav-link section-nav-link--dropped section-nav-page-title ${portfolioTypeUi} ${portfolioTextPrimary}`
const droppedTitleMuted = `${droppedTitleBase} no-underline`

const accentBullet: Record<string, string> = {
  'decoration-signal-yellow': 'before:bg-signal-yellow',
  'decoration-signal-blue': 'before:bg-signal-blue',
  'decoration-signal-red': 'before:bg-signal-red',
  'decoration-signal-green': 'before:bg-signal-green',
}

const NAV_GAP_PX = 16
const NAV_MOTION_MS = 280
const NAV_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function WorkBackArrow() {
  return (
    <span className="section-nav-work-back-icon" aria-hidden>
      <svg viewBox="0 0 12 12" fill="none" className="block h-full w-full">
        <path
          d="M7.25 2.25 3.5 6l3.75 3.75"
          stroke="var(--signal-yellow)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function linkClass(item: SectionNavItem, dropped: boolean, workItemBack: boolean) {
  if (dropped && workItemBack && item.slug === 'work') {
    return `${droppedTitleBase} section-nav-link--work-back ${contentLinkRowClass}`
  }
  if (dropped) {
    return `${droppedTitleMuted} before:content-[""] ${accentBullet[item.accentDecoration]}`
  }
  return `${rowLinkBase} ${item.accentDecoration}`
}

function isWorkItemPath(pathname: string | null): boolean {
  if (!pathname) return false
  const segments = pathname.split('/').filter(Boolean)
  return segments.length === 2 && segments[0] === 'work'
}

export default function SectionNav({
  items,
  active,
  ariaLabel,
}: {
  items: SectionNavItem[]
  active?: SectionSlug
  ariaLabel: string
}) {
  const pathname = usePathname()
  const workItemBack = isWorkItemPath(pathname)
  const trackRef = useRef<HTMLDivElement>(null)
  const prevRects = useRef<Map<string, DOMRect>>(new Map())

  useLayoutEffect(() => {
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
    <nav {...(ariaLabel ? { 'aria-label': ariaLabel } : {})} className="section-nav">
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
          const className = linkClass(item, dropped, workItemBack)

          if (dropped && workItemBack && item.slug === 'work') {
            return (
              <Link
                key={item.slug}
                href="/work"
                data-nav-slug={item.slug}
                data-dropped="true"
                className={className}
                style={{ marginTop: `${NAV_GAP_PX / 2}px` }}
              >
                <WorkBackArrow />
                <span
                  className={`${contentLinkMarkClass} underline decoration-ink/30 underline-offset-[3px]`}
                >
                  {item.label}
                </span>
              </Link>
            )
          }

          if (dropped) {
            return (
              <span
                key={item.slug}
                data-nav-slug={item.slug}
                data-dropped="true"
                className={className}
                style={{ marginTop: `${NAV_GAP_PX / 2}px` }}
                aria-current="page"
              >
                {item.label}
              </span>
            )
          }

          return (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              data-nav-slug={item.slug}
              className={className}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}