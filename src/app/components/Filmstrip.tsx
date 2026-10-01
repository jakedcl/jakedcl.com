'use client'

import { SanityImage } from '@/types/sanity'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { urlFor } from '@/sanity/lib/image'

const SCROLL_SPEED = 25 // px per second
const FRAME_WIDTH = 132
const FRAME_WIDTH_MOBILE = 90
const FRAME_GAP = 20 // margin 10px each side
const FRAME_GAP_MOBILE = 12
const STRIP_HEIGHT = 152
const STRIP_HEIGHT_MOBILE = 118
const FILM_EXTENSION = 10000
const REPEAT_SETS = 5

interface FilmstripProps {
  photos: SanityImage[]
  /** Kept for API compat; strip always renders its own film chrome. */
  framed?: boolean
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isMobile
}

function photoSrc(photo: SanityImage, width: number) {
  try {
    return urlFor(photo).width(width).url()
  } catch {
    return photo.asset?.url ?? ''
  }
}

export default function Filmstrip({ photos }: FilmstripProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const scrollRef = useRef({
    totalOffset: 0,
    isDragging: false,
    lastX: 0,
    momentum: 0,
    hasMoved: false,
  })
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  const validPhotos = (photos ?? []).filter((photo) => photo?.asset)
  const stripHeight = isMobile ? STRIP_HEIGHT_MOBILE : STRIP_HEIGHT

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigateLightbox = useCallback(
    (direction: 'prev' | 'next') => {
      if (selectedIndex === null || validPhotos.length === 0) return
      if (direction === 'prev') {
        setSelectedIndex(
          selectedIndex === 0 ? validPhotos.length - 1 : selectedIndex - 1,
        )
      } else {
        setSelectedIndex(
          selectedIndex === validPhotos.length - 1 ? 0 : selectedIndex + 1,
        )
      }
    },
    [selectedIndex, validPhotos.length],
  )

  useEffect(() => {
    if (selectedIndex === null) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null)
      else if (e.key === 'ArrowLeft') navigateLightbox('prev')
      else if (e.key === 'ArrowRight') navigateLightbox('next')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex, navigateLightbox])

  useEffect(() => {
    if (!validPhotos.length || !stripRef.current) return

    const strip = stripRef.current
    const scroll = scrollRef.current
    let localFrameWidth =
      window.innerWidth < 768
        ? FRAME_WIDTH_MOBILE + FRAME_GAP_MOBILE
        : FRAME_WIDTH + FRAME_GAP
    let localSetWidth = localFrameWidth * validPhotos.length

    const wrapOffset = () => {
      if (scroll.totalOffset >= localSetWidth) {
        scroll.totalOffset -= localSetWidth
      } else if (scroll.totalOffset < 0) {
        scroll.totalOffset += localSetWidth
      }
    }

    const animate = () => {
      if (!stripRef.current) return

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      if (Math.abs(scroll.momentum) > 0.1) {
        scroll.totalOffset -= scroll.momentum
        scroll.momentum *= 0.95
      } else if (!scroll.isDragging && !reduceMotion) {
        scroll.totalOffset += (SCROLL_SPEED / 1000) * 16.67
      }

      wrapOffset()
      stripRef.current.style.transform = `translateX(-${scroll.totalOffset}px)`
      animationRef.current = requestAnimationFrame(animate)
    }

    const onResize = () => {
      localFrameWidth =
        window.innerWidth < 768
          ? FRAME_WIDTH_MOBILE + FRAME_GAP_MOBILE
          : FRAME_WIDTH + FRAME_GAP
      localSetWidth = localFrameWidth * validPhotos.length
    }

    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      scroll.isDragging = true
      scroll.hasMoved = false
      scroll.lastX = clientX
      scroll.momentum = 0
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!scroll.isDragging || !stripRef.current) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const deltaX = clientX - scroll.lastX
      if (Math.abs(deltaX) > 3) scroll.hasMoved = true
      scroll.totalOffset -= deltaX
      scroll.momentum = deltaX * 0.8
      scroll.lastX = clientX
      wrapOffset()
      stripRef.current.style.transform = `translateX(-${scroll.totalOffset}px)`
    }

    const handleDragEnd = () => {
      if (!scroll.isDragging) return
      scroll.isDragging = false
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate)
      }
      window.setTimeout(() => {
        scroll.hasMoved = false
      }, 100)
    }

    animationRef.current = requestAnimationFrame(animate)

    strip.addEventListener('mousedown', handleDragStart)
    strip.addEventListener('touchstart', handleDragStart, { passive: true })
    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('touchmove', handleDragMove, { passive: true })
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('touchend', handleDragEnd)
    window.addEventListener('resize', onResize)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      strip.removeEventListener('mousedown', handleDragStart)
      strip.removeEventListener('touchstart', handleDragStart)
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchend', handleDragEnd)
      window.removeEventListener('resize', onResize)
    }
  }, [validPhotos.length])

  if (!validPhotos.length) return null

  const frameIndices = Array.from({ length: REPEAT_SETS }, (_, repeatIndex) =>
    validPhotos.map((photo, index) => ({
      photo,
      index,
      key: `${repeatIndex}-${photo.asset?._ref || photo.asset?.url || index}-${index}`,
    })),
  ).flat()

  const handleFrameClick = (validIndex: number) => {
    if (scrollRef.current.hasMoved) return
    setSelectedIndex(validIndex)
  }

  // Edge print every ~3–4 frames across the full repeated strip
  const framePitch = isMobile
    ? FRAME_WIDTH_MOBILE + FRAME_GAP_MOBILE
    : FRAME_WIDTH + FRAME_GAP
  const kodakGap = framePitch * 3.5
  const stripContentWidth = framePitch * validPhotos.length * REPEAT_SETS
  const kodakCount = Math.max(12, Math.ceil(stripContentWidth / kodakGap) + 2)
  const kodakSpans = Array.from({ length: kodakCount }, (_, i) => (
    <span
      key={i}
      className="inline-block"
      style={{ marginRight: kodakGap }}
    >
      KODAK EPP 5005
    </span>
  ))

  const selected = selectedIndex !== null ? validPhotos[selectedIndex] : null
  const selectedSrc = selected ? photoSrc(selected, 2400) : ''

  const lightbox =
    mounted &&
    selected &&
    selectedSrc &&
    createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 p-4"
        onClick={() => setSelectedIndex(null)}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedIndex(null)
          }}
          className="absolute top-4 right-4 z-10 text-white transition-colors hover:text-gray-300"
          aria-label="Close"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigateLightbox('prev')
          }}
          className="absolute left-4 z-10 text-white transition-colors hover:text-gray-300"
          aria-label="Previous"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigateLightbox('next')
          }}
          className="absolute right-4 z-10 text-white transition-colors hover:text-gray-300"
          aria-label="Next"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          className="relative z-10 flex max-h-[95vh] max-w-[95vw] flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedSrc}
            alt={selected.alt || `Gallery image ${(selectedIndex ?? 0) + 1}`}
            className="max-h-[85vh] max-w-full object-contain"
          />
          {selected.caption && (
            <p className="mt-4 max-w-2xl px-4 text-center text-sm text-white">
              {selected.caption}
            </p>
          )}
        </div>
      </div>,
      document.body,
    )

  return (
    <>
      <section
        className="filmstrip-root relative w-full overflow-hidden bg-black"
        style={{ height: stripHeight }}
        aria-label="Photo filmstrip"
      >
        <div
          ref={stripRef}
          className="absolute top-0 left-0 flex h-full w-max cursor-grab bg-black active:cursor-grabbing"
          style={{ willChange: 'transform', userSelect: 'none', touchAction: 'pan-y' }}
        >
          {/* Grit on rails only — low opacity so black between sprockets stays black */}
          <div
            className="pointer-events-none absolute top-0 z-[6] h-8 md:h-10"
            style={{
              left: `-${FILM_EXTENSION / 2}px`,
              width: `calc(100% + ${FILM_EXTENSION}px)`,
              backgroundImage: "url('/film-scratches.jpg')",
              backgroundSize: '500px 100%',
              backgroundRepeat: 'repeat-x',
              mixBlendMode: 'screen',
              opacity: 0.5,
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 z-[6] h-8 md:h-10"
            style={{
              left: `-${FILM_EXTENSION / 2}px`,
              width: `calc(100% + ${FILM_EXTENSION}px)`,
              backgroundImage: "url('/film-scratches.jpg')",
              backgroundSize: '500px 100%',
              backgroundRepeat: 'repeat-x',
              backgroundPosition: '80px 100%',
              mixBlendMode: 'screen',
              opacity: 0.5,
            }}
            aria-hidden
          />

          <div
            className="pointer-events-none absolute top-0.5 left-0 z-[7] w-max whitespace-nowrap font-['Courier_New',monospace] text-[7px] font-bold tracking-[1px] text-signal-yellow md:top-px md:text-[8px]"
            aria-hidden
          >
            {kodakSpans}
          </div>

          {/* Sprockets above grit so the white holes stay clean */}
          <div
            className="pointer-events-none absolute top-0 z-[8] flex h-full flex-col justify-between py-3"
            style={{
              left: `-${FILM_EXTENSION / 2}px`,
              width: `calc(100% + ${FILM_EXTENSION}px)`,
            }}
            aria-hidden
          >
            <div className="filmstrip-holes filmstrip-holes-top h-5 w-full md:h-6" />
            <div className="filmstrip-holes filmstrip-holes-bottom h-5 w-full md:h-6" />
          </div>

          {frameIndices.map(({ photo, index, key }) => (
            <button
              type="button"
              key={key}
              onClick={() => handleFrameClick(index)}
              className="filmstrip-frame group relative flex h-full shrink-0 cursor-grab flex-col justify-center py-7 transition-transform duration-300 hover:scale-[1.03] active:cursor-grabbing md:py-[35px]"
              style={{
                flex: `0 0 ${isMobile ? FRAME_WIDTH_MOBILE : FRAME_WIDTH}px`,
                margin: isMobile ? '0 6px' : '0 10px',
              }}
              aria-label={photo.alt || `Frame ${index + 1}`}
            >
              <div className="filmstrip-exposure pointer-events-none relative aspect-video w-full self-center overflow-hidden bg-black">
                <Image
                  src={photoSrc(photo, 360)}
                  alt={photo.alt || `Frame ${index + 1}`}
                  width={360}
                  height={202}
                  className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover object-center transition-[filter] duration-300 group-hover:contrast-[1.05] group-hover:saturate-[1.08]"
                  draggable={false}
                  unoptimized
                />
              </div>
              <span className="pointer-events-none absolute bottom-0.5 left-1/2 z-[1] flex -translate-x-1/2 items-center gap-0.5 font-['Courier_New',monospace] text-[9px] leading-none text-signal-yellow">
                <span className="mr-px scale-x-150 text-[5px] md:text-[7px]" aria-hidden>
                  ▶
                </span>
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      </section>

      {lightbox}
    </>
  )
}
