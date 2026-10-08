'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  className?: string
  children: ReactNode
}

function supportsViewTimeline() {
  return typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')
}

/**
 * Fallback for browsers without `animation-timeline: view()`.
 * Writes `--lift` (0 at the viewport edges, 1 at the center) so the CSS
 * transform tracks scroll. Modern Safari/Chrome use the view timeline instead
 * and this effect returns before attaching listeners.
 */
export default function ProjectScrollLift({ className, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || supportsViewTimeline()) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const nodes = () =>
      Array.from(root.querySelectorAll<HTMLElement>('.project-book'))
    const last = new WeakMap<HTMLElement, string>()
    let frame = 0
    let visible = false
    let reduced = motion.matches

    const write = (el: HTMLElement, next: string) => {
      if (last.get(el) === next) return
      last.set(el, next)
      el.style.setProperty('--lift', next)
    }

    const apply = () => {
      frame = 0
      if (!visible || reduced) return
      const vh = window.visualViewport?.height ?? window.innerHeight
      const mid = vh * 0.5
      const books = nodes()
      const rects = books.map((el) => el.getBoundingClientRect())
      for (let i = 0; i < books.length; i++) {
        const rect = rects[i]
        const range = (vh + rect.height) * 0.5
        const dist = Math.abs(rect.top + rect.height * 0.5 - mid)
        const lift = range > 0 ? Math.max(0, 1 - dist / range) : 0
        write(books[i], lift < 0.004 ? '0' : lift.toFixed(3))
      }
    }

    const requestApply = () => {
      if (!visible || reduced || frame) return
      frame = requestAnimationFrame(apply)
    }

    const settle = () => {
      cancelAnimationFrame(frame)
      frame = 0
      for (const el of nodes()) write(el, '0')
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (!visible || reduced) {
          settle()
          return
        }
        requestApply()
      },
      { rootMargin: '20% 0px' },
    )

    const onMotion = () => {
      reduced = motion.matches
      if (reduced) {
        settle()
        for (const el of nodes()) el.style.removeProperty('--lift')
        return
      }
      requestApply()
    }

    observer.observe(root)
    motion.addEventListener('change', onMotion)
    window.addEventListener('scroll', requestApply, { passive: true })
    window.addEventListener('resize', requestApply, { passive: true })
    window.visualViewport?.addEventListener('resize', requestApply)
    window.visualViewport?.addEventListener('scroll', requestApply)

    return () => {
      visible = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      motion.removeEventListener('change', onMotion)
      window.removeEventListener('scroll', requestApply)
      window.removeEventListener('resize', requestApply)
      window.visualViewport?.removeEventListener('resize', requestApply)
      window.visualViewport?.removeEventListener('scroll', requestApply)
    }
  }, [])

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  )
}
