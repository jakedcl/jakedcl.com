// A known word, then initials. Fast pair, a hitch, the last letter.
// The gap before D is the breath between words. The yellow rule draws in
// once L is drawn (see .intro-name in globals.css). Reduced motion shows the final state.
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

export default function IntroName() {
  return (
    <h1 aria-label="JAKE DCL" className="intro-name">
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
