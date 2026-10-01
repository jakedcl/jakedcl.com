'use client'

import { useEffect, useState } from 'react'

const SHORT_NAME = 'Jake DCL'
const FULL_NAME = 'Jake DeCore-Lurker'
const KEEP_PREFIX = 'Jake '
const DELETE_TARGET = 'DCL'
const REPLACE_WITH = 'DeCore-Lurker'

function randBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function typeDelay(char: string): number {
  let ms = randBetween(70, 155)
  if (char === ' ' || char === '-') ms += randBetween(60, 160)
  if (/[A-Z]/.test(char)) ms += randBetween(25, 70)
  if (Math.random() < 0.1) ms += randBetween(160, 360)
  return ms
}

function backspaceDelay(): number {
  let ms = randBetween(45, 85)
  if (Math.random() < 0.14) ms += randBetween(80, 180)
  return ms
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function NameTypewriter({ active = true }: { active?: boolean }) {
  const [text, setText] = useState('')
  const [showCaret, setShowCaret] = useState(true)

  useEffect(() => {
    if (!active) {
      setText('')
      setShowCaret(true)
      return
    }

    if (prefersReducedMotion()) {
      setText(FULL_NAME)
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
      await wait(randBetween(400, 700))
      if (cancelled) return

      for (let i = 0; i < SHORT_NAME.length; i++) {
        if (cancelled) return
        const char = SHORT_NAME[i]
        setText(SHORT_NAME.slice(0, i + 1))
        await wait(typeDelay(char))
      }

      await wait(randBetween(650, 1100))
      if (cancelled) return

      for (let i = DELETE_TARGET.length; i > 0; i--) {
        if (cancelled) return
        setText(KEEP_PREFIX + DELETE_TARGET.slice(0, i - 1))
        await wait(backspaceDelay())
      }

      await wait(randBetween(280, 520))
      if (cancelled) return

      for (let i = 0; i < REPLACE_WITH.length; i++) {
        if (cancelled) return
        const char = REPLACE_WITH[i]
        setText(KEEP_PREFIX + REPLACE_WITH.slice(0, i + 1))
        await wait(typeDelay(char) + randBetween(20, 70))
      }

      if (cancelled) return
      await wait(randBetween(1000, 1500))
      if (!cancelled) setShowCaret(false)
    }

    void run()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [active])

  return (
    <p
      className="font-display min-h-[1.15em] text-2xl font-extrabold leading-none tracking-tight text-ink sm:text-3xl"
      aria-label={FULL_NAME}
    >
      <span aria-hidden>
        {text}
        {showCaret && active && (
          <span className="ml-0.5 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-signal-red align-baseline animate-pulse" />
        )}
      </span>
    </p>
  )
}
