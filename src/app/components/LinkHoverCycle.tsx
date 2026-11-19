'use client'

import { useEffect } from 'react'

const HOVER_COLORS = [
  'var(--signal-yellow)',
  'var(--signal-blue)',
  'var(--signal-red)',
  'var(--signal-green)',
] as const

function cyclingLink(el: Element | null): HTMLElement | null {
  if (!(el instanceof HTMLElement)) return null
  if (el.classList.contains('section-nav-link')) return null
  if (el.classList.contains('intro-name-link')) return null
  if (!el.classList.contains('content-link')) return null
  return el
}

/**
 * One listener for the portfolio: each hover or keyboard focus on a content link
 * sets the next nav accent on --content-link-hover. Studio has no .portfolio-shell.
 */
export default function LinkHoverCycle() {
  useEffect(() => {
    let index = 0

    function advance(shell: HTMLElement) {
      shell.style.setProperty('--content-link-hover', HOVER_COLORS[index])
      index = (index + 1) % HOVER_COLORS.length
    }

    function onEnter(event: PointerEvent | FocusEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const shell = target.closest('.portfolio-shell')
      if (!(shell instanceof HTMLElement)) return

      const link = cyclingLink(target.closest('.content-link'))
      if (!link) return

      const related = event.relatedTarget
      const from =
        related instanceof Element
          ? cyclingLink(related.closest('.content-link'))
          : null
      if (from === link) return

      advance(shell)
    }

    document.addEventListener('pointerover', onEnter)
    document.addEventListener('focusin', onEnter)
    return () => {
      document.removeEventListener('pointerover', onEnter)
      document.removeEventListener('focusin', onEnter)
    }
  }, [])

  return null
}