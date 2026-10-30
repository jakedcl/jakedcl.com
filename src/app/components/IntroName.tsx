import type { CSSProperties } from 'react'

// Types the Big title from Site Settings, one letter at a time, then draws the yellow rule.
// The rhythm was tuned on JAKE DCL: the first word goes fast-fast-hitch, a breath
// between words, then the later words go quick. Other titles reuse the same rhythm.
// Reduced motion shows the final state (see .intro-name in globals.css).
const START = 0.28
const FIRST_WORD_GAPS = [0.22, 0.21, 0.5]
const WORD_BREAK = 0.26
const LATER_WORD_GAPS = [0.09, 0.16]
/** The caret clock was tuned as 2.4s for a last letter at 1.72s. */
const CLOCK_PER_LAST_LETTER = 2.4 / 1.72

function letterDelays(words: string[]): number[][] {
  let t = START
  return words.map((word, w) =>
    Array.from(word).map((_, i) => {
      if (w === 0 && i === 0) return round(t)
      if (i === 0) t += WORD_BREAK
      else if (w === 0) t += FIRST_WORD_GAPS[(i - 1) % FIRST_WORD_GAPS.length]
      else t += LATER_WORD_GAPS[(i - 1) % LATER_WORD_GAPS.length]
      return round(t)
    }),
  )
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

export default function IntroName({ title }: { title: string }) {
  const words = title.split(/\s+/).filter(Boolean)
  if (words.length === 0) return null

  const delays = letterDelays(words)
  const last = delays.at(-1)?.at(-1) ?? START
  const clock = round(last * CLOCK_PER_LAST_LETTER)
  const style = {
    '--intro-rule-delay': `${round(last + 0.01)}s`,
    '--intro-caret-clock': `${clock}s`,
  } as CSSProperties

  return (
    <h1 aria-label={words.join(' ')} className="intro-name" style={style}>
      {words.map((word, w) => {
        const caret =
          w === 0 ? 'hero-caret-jake' : w === words.length - 1 ? 'hero-caret-dcl' : null
        return (
          <span
            key={`${word}-${w}`}
            className={w === 0 ? 'intro-word' : 'intro-word intro-dcl'}
          >
            <span className="intro-glyphs">
              {Array.from(word).map((letter, i) => (
                <span
                  key={i}
                  className="hero-letter"
                  style={{ animationDelay: `${delays[w][i]}s` }}
                >
                  {letter}
                </span>
              ))}
              {caret ? <span className={`hero-caret ${caret}`} aria-hidden /> : null}
            </span>
          </span>
        )
      })}
    </h1>
  )
}
