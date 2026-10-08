'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  className?: string
  children: ReactNode
}

function supportsViewTimeline() {
  return typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')
}

/** CSS ease-in-out, cubic-bezier(0.42, 0, 0.58, 1). */
function easeInOut(x: number) {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const sample = (t: number, a: number, b: number) => {
    const u = 1 - t
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t
  }
  let t = x
  for (let i = 0; i < 5; i++) {
    const u = 1 - t
    const slope = 3 * u * u * 0.42 + 6 * u * t * 0.16 + 3 * t * t * 0.42
    if (Math.abs(slope) < 1e-6) break
    t = Math.min(1, Math.max(0, t - (sample(t, 0.42, 0.58) - x) / slope))
  }
  return sample(t, 0, 1)
}

/**
 * Fallback for browsers without `animation-timeline: view()`.
 * `--lift` follows the 0% / 25% / 75% / 100% plateau: eased ramps at the
 * viewport edges, full lift through the middle. Modern Safari and Chrome
 * use the view timeline and this effect returns before attaching listeners.
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
        const dist = Math.abs(rect.top + rect.height * 0.5 - mid)
        // u is 0 at center and 1 at either viewport edge (cover 0% / 100%).
        // Full lift from cover 25% to 75% (u <= 0.5); ease-in-out on the ramps.
        const radius = (vh + rect.height) * 0.5
        const u = radius > 0 ? dist / radius : 1
        const lift = u <= 0.5 ? 1 : u >= 1 ? 0 : easeInOut((1 - u) / 0.5)
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
