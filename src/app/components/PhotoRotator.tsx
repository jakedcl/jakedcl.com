'use client'

import { useEffect, useRef, useState } from 'react'

import type { Image } from '@/lib/content'
import { photoPosition } from '@/lib/photo'
import SanityImage from './SanityImage'
import useReducedMotion from './useReducedMotion'

const DEFAULT_ROTATE_MS = 3000
const FADE_MS = 700

/**
 * A 4:3 frame that crossfades through a project's screenshots.
 * Decorative (the surrounding link names the project), so the images have empty alt.
 * One photo stays still. Rotation stops for reduced motion, while paused, and offscreen.
 * The interval defaults to 3 seconds (used on the Work list); the homepage
 * feature passes half of its project-turn interval so two photos show per turn.
 * fit="contain" shows each photo at its original ratio inside a fixed frame
 * (no crop, no layout shift as photos rotate). The Work list keeps cover.
 * When the photo set changes (a new featured project), the previous image stays
 * visible until the next one has loaded, then they crossfade — the frame is not remounted.
 */
export default function PhotoRotator({
  photos,
  preloadPhotos = [],
  sizes,
  intervalMs = DEFAULT_ROTATE_MS,
  fit = 'cover',
  paused = false,
  priority = false,
  className = '',
}: {
  photos: Image[]
  preloadPhotos?: Image[]
  sizes: string
  intervalMs?: number
  fit?: 'cover' | 'contain'
  paused?: boolean
  priority?: boolean
  className?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(false)
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set())
  const [shownUrl, setShownUrl] = useState(photos[0]?.url ?? '')
  const [mounted, setMounted] = useState<Image[]>(() => uniquePhotos([...photos, ...preloadPhotos]))
  const reduced = useReducedMotion()
  const count = photos.length
  const rotates = count > 1 && !reduced

  const incoming = uniquePhotos([...mounted, ...photos, ...preloadPhotos])
  if (incoming.length !== mounted.length || incoming.some((photo, i) => photo.url !== mounted[i]?.url)) {
    setMounted(incoming)
  }

  const slotKey = photos.map((photo) => photo.url).join('|')
  const firstUrl = photos[0]?.url ?? ''
  const shownIsInSlot = photos.some((photo) => photo.url === shownUrl)
  if (!shownIsInSlot && firstUrl && (reduced || loaded.has(firstUrl) || !shownUrl)) {
    setShownUrl(firstUrl)
  }

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
    const timer = window.setInterval(() => {
      setShownUrl((url) => {
        const i = photos.findIndex((photo) => photo.url === url)
        const next = photos[(i + 1 + count) % count]?.url
        return next ?? url
      })
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [rotates, onScreen, paused, count, intervalMs, photos, slotKey])

  useEffect(() => {
    const keep = new Set([...photos, ...preloadPhotos].map((photo) => photo.url))
    keep.add(shownUrl)
    const timer = window.setTimeout(() => {
      setMounted((prev) => {
        const next = prev.filter((photo) => keep.has(photo.url))
        return next.length === prev.length ? prev : next
      })
    }, FADE_MS)
    return () => window.clearTimeout(timer)
  }, [photos, preloadPhotos, shownUrl, slotKey])

  if (mounted.length === 0 && count === 0) return null

  function markLoaded(url: string) {
    setLoaded((prev) => {
      if (prev.has(url)) return prev
      const next = new Set(prev)
      next.add(url)
      return next
    })
  }

  return (
    <div
      ref={frameRef}
      className={`relative aspect-[4/3] w-full overflow-hidden ${
        fit === 'contain' ? 'bg-background' : 'border border-ink/12 bg-cream'
      } ${className}`}
      aria-hidden="true"
    >
      {mounted.map((photo) => (
        <SanityImage
          key={photo.url}
          src={photo.url}
          alt=""
          fill
          sizes={sizes}
          priority={priority && photo.url === photos[0]?.url}
          className={`${
            fit === 'contain' ? 'object-contain object-center' : 'object-cover object-top'
          } transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            photo.url === shownUrl ? 'opacity-100' : 'opacity-0'
          }`}
          style={fit === 'contain' ? undefined : { objectPosition: photoPosition(photo) }}
          onLoad={() => markLoaded(photo.url)}
          onError={() => markLoaded(photo.url)}
        />
      ))}
    </div>
  )
}

function uniquePhotos(list: Image[]): Image[] {
  const seen = new Set<string>()
  const out: Image[] = []
  for (const photo of list) {
    if (seen.has(photo.url)) continue
    seen.add(photo.url)
    out.push(photo)
  }
  return out
}
