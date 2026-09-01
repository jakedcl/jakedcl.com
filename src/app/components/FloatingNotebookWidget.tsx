'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { canUseWebGL } from './notebook/capabilities'

const NotebookScene = dynamic(() => import('./notebook/NotebookScene'), { ssr: false })

/** Corner slot — canvas must be big enough for the framed notebook (WebGL clips at edges). */
export const NOTEBOOK_ICON = {
  widthRem: 5.5,
  heightRem: 7.25,
  insetRem: 0.75,
} as const

/** Static corner preview of the 3D notebook. No animation yet. */
export default function FloatingNotebookWidget() {
  const [webgl, setWebgl] = useState(false)

  useEffect(() => {
    setWebgl(canUseWebGL())
  }, [])

  if (!webgl) return null

  const { widthRem, heightRem, insetRem } = NOTEBOOK_ICON

  return (
    <div
      className="overflow-visible"
      style={{
        position: 'absolute',
        right: `${insetRem}rem`,
        bottom: `${insetRem}rem`,
        width: `${widthRem}rem`,
        height: `${heightRem}rem`,
      }}
      aria-label="Resume notebook"
    >
      <NotebookScene />
    </div>
  )
}
