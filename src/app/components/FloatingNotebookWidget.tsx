'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ICON_LAYOUT } from './notebook/iconLayout'
import { canUseWebGL } from './notebook/capabilities'

const NotebookScene = dynamic(() => import('./notebook/NotebookScene'), { ssr: false })

const MOVE_MS = 820
const { widthRem: ICON_W, heightRem: ICON_H, insetRem: ICON_INSET, closedScale } = ICON_LAYOUT

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

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
    onUpdate(from + (to - from) * easeInOutCubic(t))
    if (t < 1) requestAnimationFrame(tick)
    else onDone?.()
  }
  requestAnimationFrame(tick)
}

export default function FloatingNotebookWidget() {
  const [webgl, setWebgl] = useState(false)
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [opened, setOpened] = useState(false)
  const busy = useRef(false)

  useEffect(() => {
    setWebgl(canUseWebGL())
  }, [])

  const beginOpen = useCallback(() => {
    if (busy.current || active) return
    busy.current = true
    setActive(true)
    setOpened(true)
    animateValue(0, 1, MOVE_MS, setProgress, () => {
      busy.current = false
    })
  }, [active])

  const beginClose = useCallback(() => {
    if (busy.current || !active) return
    busy.current = true
    setOpened(false)
    animateValue(progress, 0, MOVE_MS, setProgress, () => {
      setActive(false)
      busy.current = false
    })
  }, [active, progress])

  useEffect(() => {
    if (!active) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') beginClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, beginClose])

  if (!webgl) return null

  const p = progress
  const scale = closedScale + p * (1 - closedScale)
  const origin = `calc(100% - ${ICON_INSET}rem) calc(100% - ${ICON_INSET}rem)`

  return (
    <>
      {active && p > 0.08 && (
        <button
          type="button"
          className="fixed inset-0 z-[45] cursor-default bg-black/12"
          style={{ opacity: Math.min(1, p * 1.1) }}
          aria-label="Close resume notebook"
          onClick={beginClose}
        />
      )}

      <div className="fixed inset-0 z-[50] pointer-events-none" aria-live="polite">
        <div
          className="h-full w-full"
          style={{
            transformOrigin: origin,
            transform: `scale(${scale})`,
            willChange: 'transform',
            pointerEvents: active ? 'auto' : 'none',
          }}
        >
          <NotebookScene
            progress={progress}
            opened={opened}
            onCornerClick={beginOpen}
            onClosePage={beginClose}
          />
        </div>

        {!active && (
          <button
            type="button"
            className="absolute cursor-pointer bg-transparent"
            style={{
              right: `${ICON_INSET}rem`,
              bottom: `${ICON_INSET}rem`,
              width: `${ICON_W}rem`,
              height: `${ICON_H}rem`,
              pointerEvents: 'auto',
            }}
            aria-label="Open resume notebook"
            onClick={beginOpen}
          />
        )}
      </div>
    </>
  )
}
