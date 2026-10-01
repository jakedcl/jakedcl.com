import { resume } from '@/data/resume'
import Filmstrip from './Filmstrip'
import type { SanityImage } from '@/types/sanity'

export default function SignalHero({
  photos,
}: {
  photos: SanityImage[] | undefined
}) {
  const email = resume.contact.find((c) => c.href.startsWith('mailto:'))
  const linkedin = resume.contact.find((c) => c.href.includes('linkedin'))

  return (
    <header className="relative overflow-x-clip border-b border-ink/10">
      <div className="relative z-40 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink/10 px-4 py-2.5 md:px-6">
        <p className="font-utility text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ink/55 md:text-xs">
          NYC · WEB · SYSTEMS ·{' '}
          <span className="text-signal-green">AVAILABLE</span>
        </p>
      </div>

      <div className="relative px-4 pb-24 pt-6 md:px-6 md:pb-28 md:pt-10">
        {/* Title stays in flow. The strip is pulled out of flow and slid up
            behind it, so the rising back-leg fills the empty right side and
            the page no longer reserves a full strip row. */}
        <div className="relative">
          <h1 className="pointer-events-none relative z-20 font-display leading-[0.82] tracking-[-0.04em]">
            <span className="pointer-events-auto block w-fit select-text text-[clamp(4.5rem,18vw,11rem)] font-extrabold text-ink">
              JAKE
            </span>
            <span className="pointer-events-auto relative -mt-[0.12em] block w-fit select-text text-[clamp(4.5rem,18vw,11rem)] font-extrabold text-signal-yellow">
              DCL
            </span>
          </h1>

          <div
            className="pointer-events-none absolute right-0 top-[12%] z-10 h-16 w-[42%] bg-signal-red sm:top-[18%] sm:h-24 sm:w-[38%]"
            style={{
              clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)',
              opacity: 0.9,
            }}
            aria-hidden
          />

          {/* z-0, under the type. Negative left/right cancel the page
              padding so the loop stays edge-to-edge; the header clips x.
              Desktop top aligns the rising back-leg with the open right
              of the title. Mobile is pulled up into that gap too, but
              less, so the full-width name stays on the cream. */}
          <div className="pointer-events-none absolute -left-4 -right-4 z-0 -top-28 md:-left-6 md:-right-6 md:top-0">
            <div className="pointer-events-auto">
              {photos && photos.length > 0 ? (
                <Filmstrip photos={photos} />
              ) : (
                <div
                  className="flex items-center justify-center bg-ink/[0.04]"
                  style={{ height: 'clamp(400px, 66svh, 640px)' }}
                >
                  <p className="font-utility text-xs uppercase tracking-[0.18em] text-ink/35">
                    No photos yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shorter than the strip canvas. The canvas hangs up into the
              title and down toward the bio; this is only the gap between them. */}
          <div
            aria-hidden
            className="h-[clamp(150px,20svh,210px)] md:h-[clamp(210px,26svh,300px)]"
          />
        </div>

        <div className="pointer-events-none relative z-30 -mt-6 flex flex-col gap-6 md:-mt-12 md:flex-row md:items-end md:justify-between">
          <p className="pointer-events-auto max-w-xl select-text text-sm leading-relaxed text-ink/80 md:text-base">
            {resume.summary}
          </p>
          <nav className="pointer-events-auto font-utility relative z-30 flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.14em]">
            {email && (
              <a
                href={email.href}
                className="text-signal-blue transition-colors hover:text-signal-red"
              >
                Email
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink/55 transition-colors hover:text-signal-blue"
              >
                LinkedIn
              </a>
            )}
            <a
              href="#work"
              className="text-ink/55 transition-colors hover:text-signal-blue"
            >
              Work
            </a>
            <a
              href="#resume"
              className="text-ink/55 transition-colors hover:text-signal-blue"
            >
              Resume
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
