import { portfolioMbHeading, portfolioTextPrimary, portfolioTypeUi } from '@/lib/portfolioUi'

/** Sub-heading with a small colored square (design, in code). */
export default function SectionHeading({ text, square }: { text: string; square: string }) {
  if (!text) return null
  return (
    <h2
      className={`flex items-center gap-2.5 ${portfolioTypeUi} ${portfolioTextPrimary} ${portfolioMbHeading}`}
    >
      <span className={`h-2.5 w-2.5 shrink-0 ${square}`} aria-hidden />
      {text}
    </h2>
  )
}
