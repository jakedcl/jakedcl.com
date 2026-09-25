'use client'

import { useEffect, useState } from 'react'

const FULL_NAME = 'Jake DeCore-Lurker'
const FINAL_NAME = 'Jake DCL'
const KEEP_PREFIX = 'Jake '
const DELETE_TARGET = 'DeCore-Lurker'
const REPLACE_WITH = 'DCL'

function randBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

/** Human-ish keystroke delay — irregular, with longer beats on spaces / capitals. */
function typeDelay(char: string): number {
  let ms = randBetween(38, 95)
  if (char === ' ' || char === '-') ms += randBetween(40, 120)
  if (/[A-Z]/.test(char)) ms += randBetween(15, 55)
  // Occasional hesitation mid-word
  if (Math.random() < 0.08) ms += randBetween(120, 280)
  return ms
}

function backspaceDelay(): number {
  let ms = randBetween(28, 58)
  if (Math.random() < 0.12) ms += randBetween(60, 140)
  return ms
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function NameTypewriter() {
  const [text, setText] = useState('')
  const [showCaret, setShowCaret] = useState(true)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setText(FINAL_NAME)
      setShowCaret(false)
      return
    }

    let cancelled = false
    let timeoutId = 0

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutId = window.setTimeout(resolve, ms)
      })

    const run = async () => {
      // Brief beat before first keystroke
      await wait(randBetween(280, 520))
      if (cancelled) return

      // Type full legal name
      for (let i = 0; i < FULL_NAME.length; i++) {
        if (cancelled) return
        const char = FULL_NAME[i]
        setText(FULL_NAME.slice(0, i + 1))
        await wait(typeDelay(char))
      }

      // Pause — "wait, that's not the brand"
      await wait(randBetween(450, 850))
      if (cancelled) return

      // Backspace last name only
      for (let i = DELETE_TARGET.length; i > 0; i--) {
        if (cancelled) return
        setText(KEEP_PREFIX + DELETE_TARGET.slice(0, i - 1))
        await wait(backspaceDelay())
      }

      // Short pause before the initials
      await wait(randBetween(180, 380))
      if (cancelled) return

      for (let i = 0; i < REPLACE_WITH.length; i++) {
        if (cancelled) return
        const char = REPLACE_WITH[i]
        setText(KEEP_PREFIX + REPLACE_WITH.slice(0, i + 1))
        await wait(typeDelay(char) + randBetween(20, 60))
      }

      if (cancelled) return
      // Soft-hide caret after a moment
      await wait(randBetween(900, 1400))
      if (!cancelled) setShowCaret(false)
    }

    void run()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <p
      className="min-h-[1.25em] text-2xl font-medium leading-tight text-neutral-900 sm:text-3xl md:text-4xl"
      aria-label={FINAL_NAME}
    >
      <span aria-hidden>
        {text}
        {showCaret && (
          <span className="ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.1em] bg-neutral-900 align-baseline animate-pulse" />
        )}
      </span>
    </p>
  )
}
