'use client'

import { useEffect } from 'react'

/** Clears a project hover card after click, bfcache restore, or window blur. */
export default function ProjectPreviewReset() {
  useEffect(() => {
    const root = document.documentElement
    let pointerFocus = false

    const blurRowFocus = () => {
      const active = document.activeElement
      if (active instanceof HTMLElement && active.closest('.project-row')) {
        active.blur()
      }
    }

    const quiet = () => {
      pointerFocus = false
      root.classList.add('project-preview-off')
      blurRowFocus()
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      pointerFocus = target instanceof Element && !!target.closest('.project-row a')
    }

    const onKeyDown = () => {
      pointerFocus = false
      root.classList.remove('project-preview-off')
    }

    const onMouseOver = (event: MouseEvent) => {
      if (!root.classList.contains('project-preview-off')) return
      const target = event.target
      if (!(target instanceof Element)) return
      const row = target.closest('.project-row')
      if (!row) return
      const from = event.relatedTarget
      if (!(from instanceof Node) || row.contains(from)) return
      root.classList.remove('project-preview-off')
    }

    const onMouseOut = (event: MouseEvent) => {
      if (!pointerFocus) return
      const target = event.target
      if (!(target instanceof Element)) return
      const row = target.closest('.project-row')
      if (!row) return
      const next = event.relatedTarget
      if (next instanceof Node && row.contains(next)) return
      const link = row.querySelector('a')
      if (link instanceof HTMLElement && document.activeElement === link) {
        link.blur()
      }
      pointerFocus = false
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    window.addEventListener('blur', quiet)
    window.addEventListener('pageshow', quiet)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      window.removeEventListener('blur', quiet)
      window.removeEventListener('pageshow', quiet)
      root.classList.remove('project-preview-off')
    }
  }, [])

  return null
}
