'use client'

import { SanityImage } from '@/types/sanity'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { urlFor } from '@/sanity/lib/image'
import FilmStrip3D, { type FilmStripItem } from './FilmStrip3D'

// Strip thumbnails: small + auto-format. The lightbox still loads the 2400px original.
const THUMB_WIDTH = 640

interface FilmstripProps {
  photos: SanityImage[]
  /** Kept for API compat; the strip always renders its own film chrome. */
  framed?: boolean
}

function photoSrc(photo: SanityImage, width: number) {
  try {
    return urlFor(photo).width(width).url()
  } catch {
    return photo.asset?.url ?? ''
  }
}

function thumbSrc(photo: SanityImage) {
  try {
    return urlFor(photo).width(THUMB_WIDTH).auto('format').url()
  } catch {
    return photo.asset?.url ?? ''
  }
}

export default function Filmstrip({ photos }: FilmstripProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  const validPhotos = useMemo(
    () => (photos ?? []).filter((photo) => photo?.asset),
    [photos],
  )

  // FilmStrip3D loops the list forever, so no manual repeating is needed.
  // Force 4:3 landscape so every frame is the same pitch (cover-crops in the window).
  const items = useMemo<FilmStripItem[]>(
    () =>
      validPhotos.map((photo, i) => {
        const alt = photo.alt || `Frame ${i + 1}`
        return {
          src: thumbSrc(photo),
          alt,
          label: `Open ${alt}`,
          aspect: 4 / 3,
        }
      }),
    [validPhotos],
  )

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

  if (!validPhotos.length) return null

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
        className="relative w-full overflow-x-clip overflow-y-visible"
        style={{
          // svh keeps the whole switchback in view on short mobile viewports (the loop needs more height than the old S-wave)
          ['--fs3d-height' as string]: 'clamp(400px, 66svh, 640px)',
          ['--fs3d-ink' as string]: 'var(--signal-yellow)',
        }}
        aria-label="Photo filmstrip"
      >
        <FilmStrip3D
          items={items}
          speed={0.8}
          // 'loop' = arches towards the viewer, hairpin U-turn, doubles back and recedes (tunables: turnSharpness, depth, perspective)
          variant="loop"
          turnSharpness={1}
          depth={1}
          ariaLabel="Photo film strip"
          // Drags never fire onSelect, so a plain click/tap/Enter always opens the lightbox.
          onSelect={(_item, index) => setSelectedIndex(index)}
        />
      </section>

      {lightbox}
    </>
  )
}
