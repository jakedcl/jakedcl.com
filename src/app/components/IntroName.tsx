// A known word, then initials. Fast pair, a hitch, the last letter.
// The gap before D is the breath between lines. After the caret rests,
// CSS shrinks this into the page header. Reduced motion skips to that header.
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
        <Letters letters={JAKE} />
        <span className="hero-caret hero-caret-jake" aria-hidden />
      </span>
      <span className="intro-word intro-dcl">
        <Letters letters={DCL} />
        <span className="hero-caret hero-caret-dcl" aria-hidden />
      </span>
    </h1>
  )
}
