'use client'

import { useEffect, useRef, useState } from 'react'

import type { Image } from '@/lib/content'
import { photoPosition } from '@/lib/photo'
import SanityImage from './SanityImage'
import useReducedMotion from './useReducedMotion'

const DEFAULT_ROTATE_MS = 3000

/**
 * A 4:3 frame that crossfades through a project's screenshots.
 * Decorative (the surrounding link names the project), so the images have empty alt.
 * One photo stays still. Rotation stops for reduced motion, while paused, and offscreen.
 * The interval defaults to 3 seconds (used on the Projects list); the homepage
 * feature passes half of its project-turn interval so two photos show per turn.
 * fit="contain" shows each photo at its original ratio inside a fixed frame
 * (no crop, no layout shift as photos rotate). The Projects list keeps cover.
 */
export default function PhotoRotator({
  photos,
  sizes,
  intervalMs = DEFAULT_ROTATE_MS,
  fit = 'cover',
  paused = false,
  priority = false,
  className = '',
}: {
  photos: Image[]
  sizes: string
  intervalMs?: number
  fit?: 'cover' | 'contain'
  paused?: boolean
  priority?: boolean
  className?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [onScreen, setOnScreen] = useState(false)
  const reduced = useReducedMotion()
  const count = photos.length
  const rotates = count > 1 && !reduced

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || !rotates) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: '80px',
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [rotates])

  useEffect(() => {
    if (!rotates || !onScreen || paused) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), intervalMs)
    return () => window.clearInterval(timer)
  }, [rotates, onScreen, paused, count, intervalMs])

  if (count === 0) return null
  const shown = rotates ? index % count : 0

  return (
    <div
      ref={frameRef}
      className={`relative aspect-[4/3] w-full overflow-hidden border border-ink/12 ${
        fit === 'contain' ? 'bg-background' : 'bg-cream'
      } ${className}`}
      aria-hidden="true"
    >
      {photos.map((photo, i) => (
        <SanityImage
          key={`${photo.url}-${i}`}
          src={photo.url}
          alt=""
          fill
          sizes={sizes}
          priority={priority && i === 0}
          className={`${
            fit === 'contain' ? 'object-contain object-center' : 'object-cover object-top'
          } transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            i === shown ? 'opacity-100' : 'opacity-0'
          }`}
          style={fit === 'contain' ? undefined : { objectPosition: photoPosition(photo) }}
        />
      ))}
    </div>
  )
}
