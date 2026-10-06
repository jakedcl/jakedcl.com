'use client'

import { useEffect, useRef, type KeyboardEvent } from 'react'
import styles from './FilmStrip3D.module.css'
import type { FilmStripItem } from './FilmStrip3D'

/**
 * Same frames and sprockets as the 3D strip, laid out in a straight row.
 * Used when CSS 3D is unavailable. Mouse drag, trackpad, touch, and arrows
 * all scroll the same overflow track.
 */
export default function FilmStripFlat({
  items,
  onSelect,
}: {
  items: FilmStripItem[]
  onSelect?: (item: FilmStripItem, index: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let drag: { id: number; x: number; left: number; moved: boolean } | null = null

    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      drag = { id: e.pointerId, x: e.clientX, left: el.scrollLeft, moved: false }
    }
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.x
      if (!drag.moved && Math.abs(dx) < 4) return
      drag.moved = true
      el.setAttribute('data-dragging', 'true')
      el.scrollLeft = drag.left - dx
    }
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      if (drag.moved) {
        const block = (ev: Event) => {
          ev.preventDefault()
          ev.stopPropagation()
          el.removeEventListener('click', block, true)
        }
        el.addEventListener('click', block, true)
      }
      drag = null
      el.removeAttribute('data-dragging')
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const buttons = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('button')]
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (index < 0) return
    const next = buttons[index + (e.key === 'ArrowRight' ? 1 : -1)]
    if (!next) return
    e.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    next.focus()
    next.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <div className={styles.flatWrap}>
      <div
        ref={trackRef}
        className={styles.flatTrack}
        onKeyDown={onKeyDown}
      >
        {items.map((it, i) => (
          <button
            key={`${it.src}-${i}`}
            type="button"
            className={styles.flatFrame}
            aria-label={it.label ?? it.alt}
            onClick={() => onSelect?.(it, i)}
          >
            <span
              className={styles.flatWindow}
              style={
                it.placeholder
                  ? { backgroundImage: `url("${it.placeholder.replace(/"/g, '')}")` }
                  : undefined
              }
            >
              {/* Decorative: the button name is the accessible label. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                srcSet={it.src2x ? `${it.src} 480w, ${it.src2x} 800w` : undefined}
                sizes="(max-width: 767px) 42vw, 168px"
                alt=""
                width={168}
                height={112}
                loading={i < 3 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden'
                }}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
