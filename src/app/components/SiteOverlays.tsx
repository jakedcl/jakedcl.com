'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import FloatingNotebookWidget from './FloatingNotebookWidget'

/**
 * 3D overlays portaled to <body> so they are never clipped or repositioned
 * by page layout (main grid, overflow-x-hidden, etc.).
 */
export default function SiteOverlays() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(<FloatingNotebookWidget />, document.body)
}
