'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './FilmStrip3D.module.css'
import type { FilmStripItem } from './FilmStrip3D'

const mod = (n: number, m: number) => ((n % m) + m) % m

/**
 * Same frames and sprockets as the 3D strip, laid out in a straight row.
 * Used on phones (iOS Safari can't keep dozens of CSS-3D slices smooth) and
 * when preserve-3d is unavailable. Native overflow scroll + a light autoplay.
 */
export default function FilmStripFlat({
  items,
  onSelect,
  stepSize = 0,
  groupCursor = 0,
  onStep,
  onEngageChange,
}: {
  items: FilmStripItem[]
  onSelect?: (item: FilmStripItem, index: number) => void
  stepSize?: number
  groupCursor?: number
  onStep?: (dir: 1 | -1) => void
  onEngageChange?: (engaged: boolean) => void
}) {
  if (stepSize > 0) {
    return (
      <FlatStep
        items={items}
        stepSize={stepSize}
        groupCursor={groupCursor}
        onStep={onStep}
        onEngageChange={onEngageChange}
      />
    )
  }
  return <FlatCrawl items={items} onSelect={onSelect} />
}

function FlatStep({
  items,
  stepSize,
  groupCursor,
  onStep,
  onEngageChange,
}: {
  items: FilmStripItem[]
  stepSize: number
  groupCursor: number
  onStep?: (dir: 1 | -1) => void
  onEngageChange?: (engaged: boolean) => void
}) {
  const groups = Math.max(1, Math.floor(items.length / stepSize) || 1)
  const stageRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const [boxW, setBoxW] = useState(0)
  const [compact, setCompact] = useState(false)
  const [visual, setVisual] = useState(groups)
  const [instant, setInstant] = useState(false)
  const prevCursor = useRef(groupCursor)
  const reducedRef = useRef(false)
  const onStepRef = useRef(onStep)
  const onEngageRef = useRef(onEngageChange)
  onStepRef.current = onStep
  onEngageRef.current = onEngageChange

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      reducedRef.current = mq.matches
    }
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const apply = () => {
      const w = el.clientWidth
      setBoxW(w)
      setCompact(w < 768)
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = rowRef.current
    if (!el) return
    const apply = () => {
      for (const frame of el.querySelectorAll<HTMLElement>('[data-film-frame]')) {
        frame.style.setProperty('--grain-shift', `${-Math.round(frame.offsetLeft)}px`)
      }
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [items, boxW, visual])

  useEffect(() => {
    const delta = groupCursor - prevCursor.current
    prevCursor.current = groupCursor
    if (delta === 0) return
    setInstant(reducedRef.current)
    setVisual((v) => v + delta)
  }, [groupCursor])

  useEffect(() => {
    if (visual >= groups && visual < groups * 2) return
    const id = window.setTimeout(() => {
      setInstant(true)
      setVisual(mod(visual, groups) + groups)
    }, reducedRef.current || instant ? 0 : 720)
    return () => window.clearTimeout(id)
  }, [visual, groups, instant])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    let drag: { id: number; x: number; y: number } | null = null
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY }
      onEngageRef.current?.(true)
    }
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      drag = null
      onEngageRef.current?.(false)
      if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.15) return
      const root = el.closest('[data-film-showcase]')
      root?.setAttribute('data-suppress-click', '1')
      window.setTimeout(() => root?.removeAttribute('data-suppress-click'), 400)
      onStepRef.current?.(dx < 0 ? 1 : -1)
    }
    const cancel = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return
      drag = null
      onEngageRef.current?.(false)
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', cancel)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', cancel)
    }
  }, [])

  const frameW = boxW > 0 ? (boxW * (compact ? 0.86 : 0.74)) / stepSize : 0
  const x = boxW / 2 - (visual * stepSize + stepSize / 2) * frameW

  return (
    <div ref={stageRef} className={styles.flatStage} data-filmstrip-flat="">
      <div
        ref={rowRef}
        className={styles.flatRow}
        data-instant={instant ? '' : undefined}
        style={frameW ? { transform: `translate3d(${x}px,0,0)` } : undefined}
        aria-hidden="true"
      >
        {[0, 1, 2].map((copy) =>
          items.map((it, i) => {
            const g = copy * groups + Math.floor(i / stepSize)
            const dim = g !== visual
            return (
              <div
                key={`${copy}-${i}-${it.alt}`}
                className={styles.flatFrame}
                data-film-frame=""
                data-dim={dim ? '' : undefined}
                style={frameW ? { width: frameW } : undefined}
              >
                <span
                  className={styles.flatWindow}
                  data-blank={!it.src ? '' : undefined}
                  style={
                    it.placeholder
                      ? { backgroundImage: `url("${it.placeholder.replace(/"/g, '')}")` }
                      : undefined
                  }
                >
                  {it.copy ? (
                    <span className={styles.flatCopy}>
                      <strong>{it.copy.title}</strong>
                      {it.copy.description ? <span>{it.copy.description}</span> : null}
                      {it.copy.stack && it.copy.stack.length > 0 ? (
                        <span className={styles.flatStack}>{it.copy.stack.join(' · ')}</span>
                      ) : null}
                    </span>
                  ) : it.src ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={it.src}
                      srcSet={it.src2x ? `${it.src} 480w, ${it.src2x} 800w` : undefined}
                      sizes="(max-width: 767px) 30vw, 220px"
                      alt=""
                      width={168}
                      height={112}
                      loading={copy === 1 && !dim ? 'eager' : 'lazy'}
                      decoding="async"
                      draggable={false}
                      onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden'
                      }}
                    />
                  ) : null}
                </span>
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}

function FlatCrawl({
  items,
  onSelect,
}: {
  items: FilmStripItem[]
  onSelect?: (item: FilmStripItem, index: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    const apply = () => {
      for (const frame of el.querySelectorAll<HTMLElement>('[data-film-frame]')) {
        frame.style.setProperty('--grain-shift', `${-Math.round(frame.offsetLeft)}px`)
      }
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [items])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let drag: { id: number; x: number; left: number; moved: boolean } | null = null
    let raf = 0
    let lastT = 0
    let paused = false
    let resumeAt = 0
    let autoScrolling = false
    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = reduceMQ.matches
    const loopWidth = () => el.scrollWidth / 2

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      paused = true
      resumeAt = performance.now() + 2200
      if (e.pointerType !== 'mouse') return
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
      if (drag && e.pointerId === drag.id) {
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
      resumeAt = performance.now() + 2200
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (reduced || document.hidden) return
      if (paused) {
        if (now < resumeAt) return
        paused = false
        lastT = now
      }
      const dt = lastT ? Math.min((now - lastT) / 1000, 0.05) : 0.016
      lastT = now
      const half = loopWidth()
      if (half < 8) return
      autoScrolling = true
      el.scrollLeft += 28 * dt
      if (el.scrollLeft >= half) el.scrollLeft -= half
      autoScrolling = false
    }

    const onScroll = () => {
      const half = loopWidth()
      if (half > 8 && el.scrollLeft >= half - 1) {
        autoScrolling = true
        el.scrollLeft -= half
        autoScrolling = false
      }
      if (autoScrolling || drag) return
      paused = true
      resumeAt = performance.now() + 2200
    }

    const onMQ = () => {
      reduced = reduceMQ.matches
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    reduceMQ.addEventListener?.('change', onMQ)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      reduceMQ.removeEventListener?.('change', onMQ)
    }
  }, [])

  return (
    <div className={styles.flatWrap}>
      <div ref={trackRef} className={styles.flatTrack}>
        {[0, 1].map((copy) =>
          items.map((it, i) => (
            <button
              key={`${copy}-${it.src}-${i}`}
              type="button"
              className={styles.flatFrame}
              data-film-frame=""
              aria-label={copy === 0 ? (it.label ?? it.alt) : undefined}
              aria-hidden={copy === 1 ? true : undefined}
              tabIndex={copy === 1 ? -1 : undefined}
              onClick={() => copy === 0 && onSelect?.(it, i)}
            >
              <span
                className={styles.flatWindow}
                style={
                  it.placeholder
                    ? { backgroundImage: `url("${it.placeholder.replace(/"/g, '')}")` }
                    : undefined
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.src}
                  srcSet={it.src2x ? `${it.src} 480w, ${it.src2x} 800w` : undefined}
                  sizes="(max-width: 767px) 42vw, 168px"
                  alt=""
                  width={168}
                  height={112}
                  loading={copy === 0 && i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden'
                  }}
                />
              </span>
            </button>
          )),
        )}
      </div>
    </div>
  )
}
