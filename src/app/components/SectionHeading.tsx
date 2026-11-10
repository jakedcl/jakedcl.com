/** Sub-heading with a small colored square (design, in code). */
export default function SectionHeading({ text, square }: { text: string; square: string }) {
  if (!text) return null
  return (
    <h2 className="font-shape mb-4 flex items-center gap-2.5 text-lg font-bold tracking-tight text-ink">
      <span className={`h-2.5 w-2.5 shrink-0 ${square}`} aria-hidden />
      {text}
    </h2>
  )
}
