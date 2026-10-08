'use client'

import { Project } from '@/types/sanity'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard'

function sheetStyle(index: number, progress: number): CSSProperties {
  const delta = index - progress
  const dist = Math.abs(delta)
  // Incoming sheet wins ties so the card underneath never ghosts through.
  const zIndex = 80 - Math.round(dist * 20) + (delta >= 0 ? 2 : 0)

  if (delta < 0) {
    const t = Math.min(1, -delta)
    return {
      transform: `translate3d(0, ${-18 * t}%, 0) scale(${1 - t * 0.03})`,
      opacity: Math.max(0, 1 - t * 1.35),
      zIndex,
      pointerEvents: 'none',
    }
  }

  const behind = Math.min(delta, 5)
  return {
    transform: `translate3d(0, ${behind * 12}px, 0) scale(${1 - behind * 0.035})`,
    opacity: Math.max(0.15, 1 - behind * 0.22),
    zIndex,
    pointerEvents: behind < 0.4 ? 'auto' : 'none',
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
      className="relative border-b border-ink/10"
      style={{ height: `calc(100dvh + ${steps * 78}dvh)` }}
    >
      <div className="sticky top-0 flex h-dvh items-center px-4 py-6 md:px-8 md:py-10">
        <div className="relative mx-auto h-[min(36rem,calc(100dvh-4.5rem))] w-full max-w-5xl">
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
