'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import NotebookScene from './notebook/NotebookScene'
import { NotebookErrorBoundary } from './notebook/NotebookErrorBoundary'
import { canUseWebGL } from './notebook/capabilities'
import { NOTEBOOK_STAGE } from './notebook/stage'

const MOVE_MS = 860
const { canvasWidthRem, canvasHeightRem, insetRem } = NOTEBOOK_STAGE

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
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [opened, setOpened] = useState(false)
  const busy = useRef(false)

  useLayoutEffect(() => {
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

  if (webgl === null || !webgl) return null

  const p = progress

  return (
    <NotebookErrorBoundary>
      {active && p > 0.06 && (
        <button
          type="button"
          className="fixed inset-0 z-[45] cursor-default bg-black/12"
          style={{ opacity: Math.min(1, p * 1.1) }}
          aria-label="Close resume notebook"
          onClick={beginClose}
        />
      )}

      <div
        className="fixed z-[50] overflow-visible"
        style={{
          bottom: `calc(${insetRem}rem * ${1 - p})`,
          right: `calc(${insetRem}rem * ${1 - p})`,
          width: `calc(${canvasWidthRem}rem + ${p} * (100vw - ${canvasWidthRem}rem))`,
          height: `calc(${canvasHeightRem}rem + ${p} * (100dvh - ${canvasHeightRem}rem))`,
        }}
        aria-live="polite"
      >
        <NotebookScene
          progress={progress}
          opened={opened}
          onOpen={beginOpen}
          onClose={beginClose}
        />
      </div>
    </NotebookErrorBoundary>
  )
}
