'use client'

import { useEffect, useRef } from 'react'

type LoadedLogo = {
  img: HTMLImageElement
  /** Mostly white / near-white mark — needs a drop shadow on cream */
  needsShadow: boolean
}

type Piece = {
  x: number
  y: number
  vx: number
  vy: number
  /** Half of draw height — used for floor / vertical physics */
  r: number
  /** Half of draw width — used for horizontal packing / bounds */
  halfW: number
  img: HTMLImageElement
  needsShadow: boolean
  targetX: number
  settled: boolean
}

/** Sample a tiny downscale; true if opaque pixels are mostly near-white. */
function isMostlyWhite(img: HTMLImageElement) {
  try {
    const s = 24
    const c = document.createElement('canvas')
    c.width = s
    c.height = s
    const cctx = c.getContext('2d', { willReadFrequently: true })
    if (!cctx) return false
    cctx.drawImage(img, 0, 0, s, s)
    const { data } = cctx.getImageData(0, 0, s, s)
    let opaque = 0
    let white = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 40) continue
      opaque++
      const l = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
      if (l > 230) white++
    }
    return opaque > 6 && white / opaque > 0.6
  } catch {
    return false
  }
}

const G = 0.35
const BOUNCE = 0.38
const FRICTION = 0.98
const SPAWN_MS = 110
const GAP = 8

type Props = {
  logos: string[]
  active: boolean
}

/** Logos drop into this category row and settle in a line. Canvas-only, no lib. */
export default function SkillLogoLane({ logos, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!active || startedRef.current) return
    const canvas = canvasRef.current
    if (!canvas || logos.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    startedRef.current = true
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let running = true
    const pieces: Piece[] = []
    // Only successfully loaded images — failed loads never get a slot
    const loaded: LoadedLogo[] = []
    let spawnIndex = 0
    let lastSpawn = 0
    let ready = false

    /** Shared draw height for every logo in the lane. */
    const logoH = () => Math.min(20, Math.max(14, height - 12))

    const sizeFor = (img: HTMLImageElement) => {
      const h = logoH()
      const nw = img.naturalWidth || 1
      const nh = img.naturalHeight || 1
      return { w: (nw / nh) * h, h }
    }

    const packTargets = () => {
      let cursor = 8
      const h = logoH()
      for (const p of pieces) {
        const { w } = sizeFor(p.img)
        p.r = h / 2
        p.halfW = w / 2
        p.targetX = cursor + w / 2
        cursor += w + GAP
        p.settled = false
      }
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      width = Math.max(1, parent.clientWidth)
      height = Math.max(40, parent.clientHeight)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      packTargets()
    }

    const load = () =>
      Promise.all(
        logos.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image()
              img.decoding = 'async'
              img.onload = () => {
                loaded.push({ img, needsShadow: isMostlyWhite(img) })
                resolve()
              }
              img.onerror = () => resolve() // skip — no slot
              img.src = src
            }),
        ),
      )

    const spawn = (now: number) => {
      if (spawnIndex >= loaded.length) return
      if (now - lastSpawn < SPAWN_MS) return
      const { img, needsShadow } = loaded[spawnIndex]
      spawnIndex++
      lastSpawn = now
      const { w, h } = sizeFor(img)
      const r = h / 2
      const halfW = w / 2
      pieces.push({
        x: Math.min(width - halfW - 4, Math.max(halfW + 4, 40 + Math.random() * 40)),
        y: -r - Math.random() * 16,
        vx: (Math.random() - 0.5) * 1.8,
        vy: 0.2 + Math.random() * 0.4,
        r,
        halfW,
        img,
        needsShadow,
        targetX: 0,
        settled: false,
      })
      packTargets()
    }

    const drawLogo = (
      img: HTMLImageElement,
      x: number,
      y: number,
      needsShadow: boolean,
    ) => {
      const { w, h } = sizeFor(img)
      ctx.save()
      if (needsShadow) {
        ctx.shadowColor = 'rgba(10, 10, 10, 0.35)'
        ctx.shadowBlur = 4
        ctx.shadowOffsetY = 1
      }
      ctx.drawImage(img, x - w / 2, y - h / 2, w, h)
      ctx.restore()
    }

    const drawStatic = () => {
      resize()
      const floor = height - 5
      const h = logoH()
      let cursor = 8
      loaded.forEach(({ img, needsShadow }) => {
        const { w } = sizeFor(img)
        const x = cursor + w / 2
        const y = floor - h / 2
        drawLogo(img, x, y, needsShadow)
        cursor += w + GAP
      })
    }

    const step = (now: number) => {
      if (!running || !ready) return
      spawn(now)
      const floor = height - 5

      for (const p of pieces) {
        if (p.settled) {
          p.x += (p.targetX - p.x) * 0.12
          p.y = floor - p.r
          continue
        }

        p.vy += G
        p.vx *= FRICTION
        p.x += p.vx
        p.y += p.vy

        if (p.x - p.halfW < 2) {
          p.x = 2 + p.halfW
          p.vx = Math.abs(p.vx) * BOUNCE
        } else if (p.x + p.halfW > width - 2) {
          p.x = width - 2 - p.halfW
          p.vx = -Math.abs(p.vx) * BOUNCE
        }

        if (p.y + p.r >= floor) {
          p.y = floor - p.r
          p.vy = -Math.abs(p.vy) * BOUNCE
          p.vx *= 0.9
          p.vx += (p.targetX - p.x) * 0.04
          if (
            Math.abs(p.vy) < 0.45 &&
            Math.abs(p.vx) < 0.55 &&
            Math.abs(p.targetX - p.x) < 14
          ) {
            p.settled = true
            p.vy = 0
            p.vx = 0
          }
        }
      }

      for (let i = 0; i < pieces.length; i++) {
        for (let j = i + 1; j < pieces.length; j++) {
          const a = pieces[i]
          const b = pieces[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const minX = a.halfW + b.halfW
          const minY = a.r + b.r
          if (Math.abs(dx) >= minX || Math.abs(dy) >= minY) continue
          const ox = (minX - Math.abs(dx)) * 0.5
          const oy = (minY - Math.abs(dy)) * 0.5
          const sx = dx < 0 ? -1 : 1
          const sy = dy < 0 ? -1 : 1
          if (ox < oy) {
            if (!a.settled) a.x -= sx * ox
            if (!b.settled) b.x += sx * ox
          } else {
            if (!a.settled) a.y -= sy * oy
            if (!b.settled) b.y += sy * oy
          }
        }
      }

      ctx.clearRect(0, 0, width, height)
      for (const p of pieces) {
        drawLogo(p.img, p.x, p.y, p.needsShadow)
      }

      const done =
        spawnIndex >= loaded.length &&
        pieces.length > 0 &&
        pieces.every((p) => p.settled && Math.abs(p.x - p.targetX) < 0.8)

      if (done || (ready && loaded.length === 0)) {
        running = false
        return
      }

      raf = requestAnimationFrame(step)
    }

    resize()
    const ro = new ResizeObserver(() => resize())
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    void load().then(() => {
      ready = true
      if (loaded.length === 0) {
        running = false
        return
      }
      if (reduced) {
        drawStatic()
        running = false
        return
      }
      lastSpawn = performance.now()
      raf = requestAnimationFrame(step)
    })

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [active, logos])

  if (logos.length === 0) return null

  return (
    <div className="relative min-h-10 min-w-0 flex-1">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />
    </div>
  )
}
