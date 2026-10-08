'use client'

import { SanityImage } from '@/types/sanity'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { urlFor } from '@/sanity/lib/image'
import FilmStrip3D, { type FilmStripItem, prefersSmallImages } from './FilmStrip3D'

// Photo window is ~150×112 CSS px and can scale up to ~2.2× on the near side
// of the loop. 480 covers that at 1×; 800 covers 2× and most 3× phones.
// The strip only uses the first 16 frames — a full camera roll stalls phones.
const THUMB_WIDTH = 480
const THUMB_2X = 800
const MAX_STRIP_PHOTOS = 16
const LIGHTBOX_WIDTHS = [640, 960, 1280, 1600, 2000] as const

interface FilmstripProps {
  photos: SanityImage[]
  /** Kept for API compat; the strip always renders its own film chrome. */
  framed?: boolean
}

function sizedSrc(photo: SanityImage, width: number, quality: number) {
  try {
    return urlFor(photo).width(width).quality(quality).auto('format').fit('max').url()
  } catch {
    return photo.asset?.url ?? ''
  }
}

export default function Filmstrip({ photos }: FilmstripProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [imgState, setImgState] = useState<'loading' | 'ready' | 'error'>('loading')
  const dialogRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const swipeRef = useRef<{ x: number; y: number; id: number } | null>(null)
  const swipedRef = useRef(false)

  const validPhotos = useMemo(
    () => (photos ?? []).filter((photo) => photo?.asset).slice(0, MAX_STRIP_PHOTOS),
    [photos],
  )

  // FilmStrip3D loops the list forever, so no manual repeating is needed.
  // Force 4:3 landscape so every frame is the same pitch (cover-crops in the window).
  const items = useMemo<FilmStripItem[]>(
    () =>
      validPhotos.map((photo, i) => {
        const alt = photo.alt || `Frame ${i + 1}`
        return {
          src: sizedSrc(photo, THUMB_WIDTH, 68),
          src2x: sizedSrc(photo, THUMB_2X, 70),
          placeholder: photo.asset?.metadata?.lqip,
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
    setImgState('loading')
  }, [selectedIndex])

  useEffect(() => {
    if (selectedIndex === null) return

    openerRef.current = document.activeElement as HTMLElement | null
    const scrollY = window.scrollY
    const body = document.body
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    }
    // position:fixed stops iOS from scrolling the page behind the dialog.
    // overflow:hidden alone does not.
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    const dialog = dialogRef.current
    dialog?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setSelectedIndex(null)
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigateLightbox('prev')
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigateLightbox('next')
        return
      }
      if (e.key !== 'Tab' || !dialog) return
      const nodes = [...dialog.querySelectorAll<HTMLElement>('button, [href], img')].filter(
        (el) => !el.hasAttribute('disabled'),
      )
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      window.scrollTo(0, scrollY)
      openerRef.current?.focus?.()
    }
  }, [selectedIndex, navigateLightbox])

  if (!validPhotos.length) return null

  const selected = selectedIndex !== null ? validPhotos[selectedIndex] : null
  const smallNet = mounted && selected ? prefersSmallImages() : false
  const selectedSrc = selected
    ? sizedSrc(selected, smallNet ? 960 : 1280, smallNet ? 65 : 75)
    : ''
  const selectedSet =
    selected && !smallNet
      ? LIGHTBOX_WIDTHS.map((w) => `${sizedSrc(selected, w, w >= 1600 ? 72 : 75)} ${w}w`).join(', ')
      : undefined
  const countLabel =
    selectedIndex !== null
      ? `${String(selectedIndex + 1).padStart(2, '0')} / ${String(validPhotos.length).padStart(2, '0')}`
      : ''
  const photoW = selected?.asset?.metadata?.dimensions?.width
  const photoH = selected?.asset?.metadata?.dimensions?.height
  const photoRatio = photoW && photoH ? photoW / photoH : undefined
  // Cap the frame by viewport, then let width follow the photo so the box
  // matches the file. A full-width frame was painting the LQIP as side bars.
  const frameMaxH =
    typeof CSS !== 'undefined' && CSS.supports('height', '1dvh')
      ? 'min(78dvh, 78vh)'
      : '78vh'

  const close = () => setSelectedIndex(null)

  const onLightboxPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    swipeRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
    swipedRef.current = false
  }

  const onLightboxPointerUp = (e: React.PointerEvent) => {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start || start.id !== e.pointerId) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
    swipedRef.current = true
    navigateLightbox(dx < 0 ? 'next' : 'prev')
  }

  const onBackdropClick = () => {
    if (swipedRef.current) {
      swipedRef.current = false
      return
    }
    close()
  }

  const lightbox =
    mounted &&
    selected &&
    selectedSrc &&
    createPortal(
      <div
        ref={dialogRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 outline-none"
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))',
          paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
        }}
        onClick={onBackdropClick}
        onPointerDown={onLightboxPointerDown}
        onPointerUp={onLightboxPointerUp}
        onPointerCancel={() => {
          swipeRef.current = null
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        tabIndex={-1}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            close()
          }}
          className="absolute z-10 flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-gray-300"
          style={{
            top: 'max(0.75rem, env(safe-area-inset-top, 0px))',
            right: 'max(0.75rem, env(safe-area-inset-right, 0px))',
          }}
          aria-label="Close"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigateLightbox('prev')
          }}
          className="absolute z-10 flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-gray-300"
          style={{ left: 'max(0.25rem, env(safe-area-inset-left, 0px))' }}
          aria-label="Previous"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigateLightbox('next')
          }}
          className="absolute z-10 flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-gray-300"
          style={{ right: 'max(0.25rem, env(safe-area-inset-right, 0px))' }}
          aria-label="Next"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          className="relative z-10 flex max-h-full w-full max-w-[min(92vw,1200px)] flex-col items-center justify-center px-12"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative bg-[#1a1a1a]"
            style={
              imgState === 'error' || !photoRatio
                ? { minHeight: '12rem', width: '100%' }
                : {
                    aspectRatio: `${photoW} / ${photoH}`,
                    width: `min(100%, calc(${frameMaxH} * ${photoRatio}))`,
                    maxHeight: frameMaxH,
                  }
            }
          >
            {imgState === 'error' ? (
              <p className="font-utility px-6 py-16 text-center text-xs uppercase tracking-[0.16em] text-white/70">
                This frame didn&apos;t load.
              </p>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={selectedSrc}
                src={selectedSrc}
                srcSet={selectedSet}
                sizes="(max-width: 768px) 92vw, min(80vw, 1200px)"
                alt={selected.alt || `Gallery image ${(selectedIndex ?? 0) + 1}`}
                width={photoW || 1200}
                height={photoH || 900}
                decoding="async"
                fetchPriority="high"
                ref={(node) => {
                  // Cached images can be complete before onLoad is attached.
                  if (node?.complete && node.naturalWidth > 0) setImgState('ready')
                }}
                onLoad={() => setImgState('ready')}
                onError={() => setImgState('error')}
                className="block h-full w-full object-contain"
                style={{ opacity: imgState === 'ready' ? 1 : 0 }}
                aria-busy={imgState === 'loading'}
              />
            )}
          </div>
          <p className="font-utility mt-3 text-center text-[0.7rem] uppercase tracking-[0.16em] text-signal-yellow">
            {countLabel}
          </p>
          {selected.caption && (
            <p className="mt-2 max-w-2xl px-4 text-center text-sm text-white">
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
          // Mobile / short landscape: short canvas so the ribbon sits under the name.
          // Tall desktop: taller loop (overridden in CSS).
          ['--fs3d-height' as string]: 'clamp(200px, 34svh, 280px)',
          ['--fs3d-height-md' as string]: 'clamp(400px, 56svh, 640px)',
          ['--fs3d-ink' as string]: 'var(--signal-yellow)',
        }}
        aria-label="Photo filmstrip"
      >
        <FilmStrip3D
          items={items}
          speed={selectedIndex === null ? 0.8 : 0}
          // 'loop' = arches towards the viewer, hairpin U-turn, doubles back and recedes
          variant="loop"
          turnSharpness={1}
          depth={1}
          ariaLabel="Photo film strip"
          // Drags never fire onSelect, so a plain click/tap/Enter always opens the lightbox.
          onSelect={(_item, index) => {
            swipedRef.current = false
            setSelectedIndex(index)
          }}
        />
      </section>

      {lightbox}
    </>
  )
}
