'use client'

import { useEffect, useState } from 'react'
import NotebookScene from './NotebookScene'
import { canUseWebGL } from './capabilities'

/** Drop your landscape at public/notebook/landscape.jpg (16:9 or wider). */
const LANDSCAPE_SRC = '/notebook/landscape.jpg'

export default function NotebookViewer() {
  const [opened, setOpened] = useState(false)
  const [webgl, setWebgl] = useState(false)

  useEffect(() => {
    setWebgl(canUseWebGL())
  }, [])

  if (!webgl) {
    return (
      <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-600">
        3D notebook needs WebGL. Use the text resume tab above.
      </p>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div
        className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 bg-cover bg-center"
        style={{ backgroundImage: `url('${LANDSCAPE_SRC}'), linear-gradient(to bottom, #93c5fd, #e0f2fe, #a7f3d0)` }}
        aria-hidden
      />
      <div className="relative aspect-[4/3] w-full min-h-[min(72vh,520px)] md:aspect-[16/10]">
        <NotebookScene
          opened={opened}
          onOpen={() => setOpened(true)}
          onClose={() => setOpened(false)}
        />
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs text-white/90 drop-shadow-md">
          {opened ? 'Click the page to close' : 'Click the notebook to open'}
        </p>
      </div>
    </div>
  )
}
