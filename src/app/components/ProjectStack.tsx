'use client'

import { Project } from '@/types/sanity'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard'

function sheetStyle(index: number, progress: number): CSSProperties {
  const delta = index - progress

  // Already flipped away.
  if (delta <= -1) {
    return {
      transform: 'translate3d(0, -100%, 0)',
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none',
      visibility: 'hidden',
    }
  }

  // The card you are scrolling off. Stays solid and slides up.
  if (delta < 0) {
    return {
      transform: `translate3d(0, ${-100 * -delta}%, 0)`,
      opacity: 1,
      zIndex: 3,
      pointerEvents: 'none',
      visibility: 'visible',
    }
  }

  // The card underneath, fully readable once the one above slides off.
  if (delta < 1) {
    return {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1,
      zIndex: 2,
      pointerEvents: 'auto',
      visibility: 'visible',
    }
  }

  return {
    transform: 'translate3d(0, 0, 0)',
    opacity: 0,
    zIndex: 0,
    pointerEvents: 'none',
    visibility: 'hidden',
  }
}

function StaticList({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-4 border-b border-ink/10 px-4 py-6 md:gap-5 md:px-8 md:py-10">
      {projects.map((project, index) => (
        <ProjectCard key={project._id} project={project} index={index} />
      ))}
    </div>
  )
}

export default function ProjectStack({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced || projects.length < 2) return

    const track = trackRef.current
    if (!track) return

    let frame = 0
    const measure = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 0))
      const t = scrollable <= 0 ? 0 : scrolled / scrollable
      setProgress(t * (projects.length - 1))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [reduced, projects.length])

  if (projects.length === 0) {
    return (
      <div className="border-b border-ink/10 px-5 py-16 md:px-8">
        <p className="font-utility text-sm uppercase tracking-[0.16em] text-ink/40">
          No projects on the board — check back soon.
        </p>
      </div>
    )
  }

  if (reduced || projects.length === 1) {
    return <StaticList projects={projects} />
  }

  const steps = projects.length - 1

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `calc(min(32rem, 100dvh - 7rem) + ${steps * 9}vh + 2.5rem)` }}
    >
      <div className="sticky top-0 border-b-2 border-ink bg-background px-4 pt-4 pb-4 md:px-8">
        <div className="relative mx-auto h-[min(32rem,calc(100dvh-7rem))] w-full max-w-5xl overflow-hidden">
          {projects.map((project, index) => (
            <ProjectCard
              key={project._id}
              project={project}
              index={index}
              className="absolute inset-0 will-change-transform"
              style={sheetStyle(index, progress)}
              fit
            />
          ))}
        </div>
      </div>
    </div>
  )
}
