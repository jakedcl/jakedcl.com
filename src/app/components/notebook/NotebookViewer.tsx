'use client'

import { useEffect, useState } from 'react'
import NotebookScene from './NotebookScene'
import { canUseWebGL } from './capabilities'

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
    <div className="relative w-full overflow-hidden rounded-lg border border-neutral-100 bg-white">
      <div className="relative aspect-[4/3] w-full min-h-[min(72vh,520px)] md:aspect-[16/10]">
        <NotebookScene
          opened={opened}
          onOpen={() => setOpened(true)}
          onClose={() => setOpened(false)}
        />
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs text-neutral-500">
          {opened ? 'Click the page to close' : 'Click the notebook to open'}
        </p>
      </div>
    </div>
  )
}
