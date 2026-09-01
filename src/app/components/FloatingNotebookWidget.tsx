'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { canUseWebGL } from './notebook/capabilities'

const NotebookViewer = dynamic(() => import('./notebook/NotebookViewer'), { ssr: false })

export default function FloatingNotebookWidget() {
  const [expanded, setExpanded] = useState(false)
  const [opened, setOpened] = useState(false)
  const [webgl, setWebgl] = useState(false)

  useEffect(() => {
    setWebgl(canUseWebGL())
  }, [])

  const open = useCallback(() => {
    setExpanded(true)
    setOpened(true)
  }, [])

  const close = useCallback(() => {
    setExpanded(false)
    setOpened(false)
  }, [])

  useEffect(() => {
    if (!expanded) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, expanded])

  if (!webgl) return null

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="fixed bottom-6 right-6 z-40 overflow-hidden rounded-sm border border-neutral-200/80 bg-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 md:bottom-8 md:right-8"
        aria-label="Open resume notebook"
        aria-expanded={expanded}
      >
        <Image
          src="/notebook/notebook-cover.jpg"
          alt=""
          width={72}
          height={96}
          className="block h-[5.5rem] w-[4.25rem] object-cover md:h-24 md:w-[4.75rem]"
        />
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2px] md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Resume notebook"
          onClick={close}
        >
          <div
            className="relative w-full max-w-4xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute -top-10 right-0 rounded-full bg-white/90 px-3 py-1 text-sm text-neutral-700 shadow-sm hover:text-black md:-right-2 md:top-2"
              aria-label="Close resume notebook"
            >
              Close
            </button>
            <NotebookViewer
              opened={opened}
              onOpenChange={setOpened}
              onPageClose={close}
              className="shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}
