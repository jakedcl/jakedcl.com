'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type PhotoTile = {
  key: string
  src: string
  full: string
  alt: string
  caption?: string
  width: number
  height: number
}

export default function PhotoGrid({ photos }: { photos: PhotoTile[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (dir: -1 | 1) => {
      setOpen((current) => {
        if (current === null || photos.length === 0) return current
        return (current + dir + photos.length) % photos.length
      })
    },
    [photos.length],
  )

  useEffect(() => {
    if (open === null) return
    openerRef.current = document.activeElement as HTMLElement | null
    const scrollY = window.scrollY
    const body = document.body
    const prev = body.style.position
    const prevTop = body.style.top
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    dialogRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        step(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        step(1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      body.style.position = prev
      body.style.top = prevTop
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      window.scrollTo(0, scrollY)
      openerRef.current?.focus?.()
    }
  }, [open, close, step])

  const selected = open !== null ? photos[open] : null

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.key}>
            <button
              type="button"
              className="group block w-full overflow-hidden border border-ink/10 bg-ink text-left"
              onClick={() => setOpen(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading={index < 4 ? 'eager' : 'lazy'}
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={selected.alt}
          tabIndex={-1}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 outline-none"
          style={{
            paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))',
            paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
            paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
            paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
          }}
          onClick={close}
        >
          <button
            type="button"
            className="absolute z-10 flex h-11 w-11 items-center justify-center text-white"
            style={{
              top: 'max(0.75rem, env(safe-area-inset-top, 0px))',
              right: 'max(0.75rem, env(safe-area-inset-right, 0px))',
            }}
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation()
              close()
            }}
          >
            <span aria-hidden className="text-2xl leading-none">
              ×
            </span>
          </button>
          <button
            type="button"
            className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center text-white"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center text-white"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
          >
            ›
          </button>
          <figure className="max-h-full max-w-[min(92vw,1100px)] px-12" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.full}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
              className="max-h-[78vh] w-auto max-w-full object-contain"
            />
            {selected.caption && (
              <figcaption className="mt-3 text-center text-sm text-white">{selected.caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  )
}
