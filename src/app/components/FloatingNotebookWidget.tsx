'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { canUseWebGL } from './notebook/capabilities'

const NotebookScene = dynamic(() => import('./notebook/NotebookScene'), { ssr: false })

const GROW_MS = 680
const COVER_CLOSE_MS = 1050
const ICON_W = 5.25 // rem
const ICON_H = 6.75 // rem
const ICON_INSET = 1.25 // rem

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

function animateValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onDone?: () => void,
) {
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    onUpdate(from + (to - from) * easeOutCubic(t))
    if (t < 1) requestAnimationFrame(tick)
    else onDone?.()
  }
  requestAnimationFrame(tick)
}

export default function FloatingNotebookWidget() {
  const [webgl, setWebgl] = useState(false)
  const [active, setActive] = useState(false)
  const [prominence, setProminence] = useState(0)
  const [opened, setOpened] = useState(false)
  const busy = useRef(false)
  const closeTimer = useRef<number | null>(null)

  useEffect(() => {
    setWebgl(canUseWebGL())
  }, [])

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const beginOpen = useCallback(() => {
    if (busy.current || active) return
    busy.current = true
    clearCloseTimer()
    setOpened(false)
    setActive(true)
    animateValue(0, 1, GROW_MS, setProminence, () => {
      setOpened(true)
      busy.current = false
    })
  }, [active])

  const beginClose = useCallback(() => {
    if (busy.current || !active) return
    busy.current = true
    clearCloseTimer()
    setOpened(false)
    closeTimer.current = window.setTimeout(() => {
      animateValue(prominence, 0, GROW_MS, setProminence, () => {
        setActive(false)
        busy.current = false
      })
    }, COVER_CLOSE_MS)
  }, [active, prominence])

  useEffect(() => {
    if (!active) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') beginClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, beginClose])

  useEffect(() => clearCloseTimer, [])

  if (!webgl) return null

  const p = prominence

  return (
    <>
      {active && p > 0.12 && (
        <button
          type="button"
          className="fixed inset-0 z-[45] cursor-default bg-black/12"
          style={{ opacity: Math.min(1, (p - 0.12) * 1.4) }}
          aria-label="Close resume notebook"
          onClick={beginClose}
        />
      )}

      <div
        className="fixed z-[50] overflow-hidden"
        style={{
          bottom: `calc(${ICON_INSET}rem * ${1 - p})`,
          right: `calc(${ICON_INSET}rem * ${1 - p})`,
          width: `calc(${ICON_W}rem + ${p} * (100vw - ${ICON_W}rem))`,
          height: `calc(${ICON_H}rem + ${p} * (100dvh - ${ICON_H}rem))`,
        }}
        aria-live="polite"
      >
        <NotebookScene
          prominence={prominence}
          opened={opened}
          onCornerClick={beginOpen}
          onClosePage={beginClose}
        />
      </div>
    </>
  )
}
