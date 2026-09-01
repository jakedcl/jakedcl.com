'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { NotebookView } from './notebook/NotebookCamera'
import { canUseWebGL } from './notebook/capabilities'

const NotebookScene = dynamic(() => import('./notebook/NotebookScene'), { ssr: false })

type Stage = 'corner' | 'growing' | 'open' | 'shrinking'

const GROW_MS = 620
const COVER_CLOSE_MS = 1100

export default function FloatingNotebookWidget() {
  const [webgl, setWebgl] = useState(false)
  const [stage, setStage] = useState<Stage>('corner')
  const [opened, setOpened] = useState(false)
  const closeTimer = useRef<number | null>(null)

  const expanded = stage === 'growing' || stage === 'open' || stage === 'shrinking'

  const view: NotebookView =
    stage === 'corner' || stage === 'shrinking'
      ? 'corner'
      : stage === 'growing'
        ? 'center'
        : opened
          ? 'page'
          : 'center'

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
    if (stage !== 'corner') return
    clearCloseTimer()
    setOpened(false)
    setStage('growing')
    window.setTimeout(() => {
      setStage('open')
      setOpened(true)
    }, GROW_MS)
  }, [stage])

  const beginClose = useCallback(() => {
    if (stage === 'corner' || stage === 'shrinking') return
    clearCloseTimer()
    setOpened(false)
  }, [stage])

  useEffect(() => {
    if (!opened && stage === 'open') {
      closeTimer.current = window.setTimeout(() => {
        setStage('shrinking')
        closeTimer.current = window.setTimeout(() => {
          setStage('corner')
        }, GROW_MS)
      }, COVER_CLOSE_MS)
    }
    return clearCloseTimer
  }, [opened, stage])

  useEffect(() => {
    if (!expanded) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') beginClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [beginClose, expanded])

  if (!webgl) return null

  return (
    <>
      {expanded && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-black/10"
          aria-label="Close resume notebook"
          onClick={beginClose}
        />
      )}

      <div
        className={`fixed z-50 overflow-hidden transition-[width,height,top,right,bottom,left,box-shadow] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          expanded
            ? 'inset-0 h-auto w-auto shadow-none'
            : 'bottom-6 right-6 h-36 w-28 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] md:bottom-8 md:right-8 md:h-40 md:w-32'
        }`}
        aria-live="polite"
      >
        <NotebookScene
          view={view}
          opened={opened}
          onCornerClick={beginOpen}
          onClosePage={beginClose}
        />
      </div>
    </>
  )
}
