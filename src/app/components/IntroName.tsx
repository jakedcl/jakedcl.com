'use client'

import { useEffect, useRef } from 'react'

// A known word, then initials. Fast pair, a hitch, the last letter.
// The gap before D is the breath between lines. The shrink waits on the
// CSS hold so this cadence and the pause after it stay on one clock.
// Reduced motion skips to the header.
const JAKE = [
  ['J', '0.28s'],
  ['A', '0.5s'],
  ['K', '0.71s'],
  ['E', '1.21s'],
] as const

const DCL = [
  ['D', '1.47s'],
  ['C', '1.56s'],
  ['L', '1.72s'],
] as const

function Letters({
  letters,
}: {
  letters: readonly (readonly [string, string])[]
}) {
  return letters.map(([letter, delay]) => (
    <span key={letter} className="hero-letter" style={{ animationDelay: delay }}>
      {letter}
    </span>
  ))
}

function animationName(animation: Animation) {
  if ('animationName' in animation && typeof animation.animationName === 'string') {
    return animation.animationName
  }
  return ''
}

function settleMotion(name: HTMLElement) {
  const css = getComputedStyle(name)
  const duration = css.getPropertyValue('--intro-settle-duration').trim() || '0.9s'
  const ease = css.getPropertyValue('--intro-settle-ease').trim() || 'cubic-bezier(0.22, 1, 0.36, 1)'
  return `transform ${duration} ${ease}`
}

/** Measure the hero, switch to the header layout, and invert with transforms. */
function startSettle(name: HTMLElement) {
  let frame = 0
  let nested = 0
  let cancelled = false

  const words = [...name.querySelectorAll<HTMLElement>('.intro-glyphs')]
  const firstBox = name.getBoundingClientRect()
  const firstWords = words.map((word) => word.getBoundingClientRect())

  name.classList.add('is-settled')

  const lastBox = name.getBoundingClientRect()
  const shift = firstBox.bottom - lastBox.bottom
  const veil = lastBox.height > 0 ? firstBox.height / lastBox.height : 1
  name.style.setProperty('--rule-shift', `${shift}px`)
  name.style.setProperty('--veil-scale', String(veil))

  words.forEach((word, index) => {
    const first = firstWords[index]
    const last = word.getBoundingClientRect()
    const sx = last.width > 0 ? first.width / last.width : 1
    const sy = last.height > 0 ? first.height / last.height : 1
    word.style.transformOrigin = '0 0'
    word.style.transition = 'none'
    word.style.transform = `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${sx}, ${sy})`
  })

  // Commit the inverted frame before the transition starts.
  void name.offsetWidth

  const finishWord = (word: HTMLElement) => {
    word.style.transition = ''
    word.style.transform = ''
    word.style.transformOrigin = ''
    name.classList.add('is-done')
  }

  frame = requestAnimationFrame(() => {
    nested = requestAnimationFrame(() => {
      if (cancelled) return
      const motion = settleMotion(name)
      name.classList.add('is-playing')
      for (const word of words) {
        word.style.transition = motion
        word.style.transform = 'translate(0px, 0px) scale(1, 1)'
        word.addEventListener(
          'transitionend',
          (event) => {
            if (event.target !== word || event.propertyName !== 'transform') return
            finishWord(word)
          },
          { once: true },
        )
      }
    })
  })

  return () => {
    cancelled = true
    cancelAnimationFrame(frame)
    cancelAnimationFrame(nested)
  }
}

export default function IntroName() {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const name = ref.current
    if (!name) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let started = false
    let stop = () => {}

    const play = () => {
      if (cancelled || started) return
      started = true
      stop = startSettle(name)
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.target !== name || event.animationName !== 'intro-hold') return
      play()
    }

    name.addEventListener('animationend', onEnd)

    const hold = name.getAnimations().find((animation) => animationName(animation) === 'intro-hold')
    if (hold) {
      hold.finished.then(() => {
        play()
      }).catch(() => {})
    }

    return () => {
      cancelled = true
      stop()
      name.removeEventListener('animationend', onEnd)
    }
  }, [])

  return (
    <h1 ref={ref} aria-label="JAKE DCL" className="intro-name">
      <span className="intro-word">
        <span className="intro-glyphs">
          <Letters letters={JAKE} />
          <span className="hero-caret hero-caret-jake" aria-hidden />
        </span>
      </span>
      <span className="intro-word intro-dcl">
        <span className="intro-glyphs">
          <Letters letters={DCL} />
          <span className="hero-caret hero-caret-dcl" aria-hidden />
        </span>
      </span>
    </h1>
  )
}
