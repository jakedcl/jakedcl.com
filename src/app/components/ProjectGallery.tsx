'use client'

import { useRef, useState, type KeyboardEvent } from 'react'

import type { Image } from '@/lib/content'
import { photoPosition } from '@/lib/photo'
import SanityImage from './SanityImage'

export type GalleryLabels = {
  ariaLabel: string
  openPhotoLabel: string
  previousLabel: string
  nextLabel: string
  closeLabel: string
}

function OpenButton({
  photo,
  openLabel,
  onOpen,
  className,
  children,
}: {
  photo: Image
  openLabel: string
  onOpen: () => void
  className: string
  children: React.ReactNode
}) {
  const name = [openLabel, photo.alt].filter(Boolean).join(': ')
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group block w-full cursor-zoom-in overflow-hidden border border-ink/12 bg-cream text-left ${className}`}
      {...(name ? { 'aria-label': name } : {})}
    >
      {children}
    </button>
  )
}

/**
 * All of a project's screenshots: the first one large, the rest in a grid.
 * Clicking one opens a full-screen viewer (native dialog: Escape closes, arrows step through).
 */
export default function ProjectGallery({ photos, labels }: { photos: Image[]; labels: GalleryLabels }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  if (photos.length === 0) return null

  const [lead, ...rest] = photos
  const count = photos.length
  const step = (by: number) => setOpen((i) => (i === null ? i : (i + by + count) % count))

  const openAt = (i: number) => {
    setOpen(i)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (count < 2) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    }
  }

  const current = open === null ? null : photos[open]

  return (
    <section {...(labels.ariaLabel ? { 'aria-label': labels.ariaLabel } : {})}>
      <figure>
        <OpenButton photo={lead} openLabel={labels.openPhotoLabel} onOpen={() => openAt(0)} className="">
          <SanityImage
            src={lead.url}
            alt={labels.openPhotoLabel ? '' : lead.alt}
            width={lead.width ?? 1600}
            height={lead.height ?? 1200}
            sizes="(min-width: 42rem) 40rem, 100vw"
            priority
            className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
            style={{ objectPosition: photoPosition(lead) }}
          />
        </OpenButton>
        {lead.caption ? (
          <figcaption className="font-utility mt-2 text-[0.65rem] uppercase tracking-[0.14em] text-ink/50">
            {lead.caption}
          </figcaption>
        ) : null}
      </figure>

      {rest.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rest.map((photo, i) => (
            <li key={`${photo.url}-${i}`}>
              <OpenButton photo={photo} openLabel={labels.openPhotoLabel} onOpen={() => openAt(i + 1)} className="">
                <SanityImage
                  src={photo.url}
                  alt={labels.openPhotoLabel ? '' : photo.alt}
                  width={photo.width ?? 1200}
                  height={photo.height ?? 900}
                  sizes="(min-width: 42rem) 13rem, 50vw"
                  className="aspect-[4/3] w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                  style={{ objectPosition: photoPosition(photo) }}
                />
              </OpenButton>
            </li>
          ))}
        </ul>
      ) : null}

      <dialog
        ref={dialogRef}
        className="photo-lightbox m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0"
        onClose={() => setOpen(null)}
        onKeyDown={onKeyDown}
        {...(current?.alt ? { 'aria-label': current.alt } : {})}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          {current ? (
            <figure className="flex max-h-full min-h-0 flex-col items-center">
              <SanityImage
                key={current.url}
                src={current.url}
                alt={current.alt}
                width={current.width ?? 1600}
                height={current.height ?? 1200}
                sizes="100vw"
                loading="eager"
                className="h-auto max-h-[78dvh] w-auto max-w-full border border-cream/20 object-contain"
                style={{ aspectRatio: `${current.width ?? 4} / ${current.height ?? 3}` }}
              />
              {current.caption ? (
                <figcaption className="font-utility mt-2 text-[0.65rem] uppercase tracking-[0.14em] text-cream/70">
                  {current.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {count > 1 && labels.previousLabel ? (
              <button type="button" className="gallery-control" onClick={() => step(-1)}>
                {labels.previousLabel}
              </button>
            ) : null}
            {count > 1 && open !== null ? (
              <span className="font-utility text-[0.65rem] tracking-[0.12em] text-cream/70">
                {open + 1} / {count}
              </span>
            ) : null}
            {count > 1 && labels.nextLabel ? (
              <button type="button" className="gallery-control" onClick={() => step(1)}>
                {labels.nextLabel}
              </button>
            ) : null}
            {labels.closeLabel ? (
              <button type="button" className="gallery-control" onClick={close} autoFocus>
                {labels.closeLabel}
              </button>
            ) : null}
          </div>
        </div>
      </dialog>
    </section>
  )
}
