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
    <header className="relative overflow-x-clip border-b border-ink/10 pt-[env(safe-area-inset-top,0px)]">
      <div className="relative z-40 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink/10 px-4 py-2.5 md:px-6">
        <p className="font-utility text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink/55 md:text-xs">
          NYC · WEB · SYSTEMS
        </p>
      </div>

      <div className="relative px-4 pb-16 pt-5 md:px-6 md:pt-10 tall:pb-40">
        {/* Title in flow. Strip sits under the name (same idea as desktop) with
            only a slight bite into DCL — not woven through JAKE. */}
        <div className="relative">
          <h1 className="pointer-events-none relative z-20 isolate font-display leading-[0.82] tracking-[-0.04em]">
            <span className="pointer-events-auto block w-fit select-text text-[clamp(4rem,17vw,11rem)] font-extrabold text-ink">
              JAKE
            </span>
            <span className="pointer-events-auto relative -mt-[0.12em] block w-fit select-text text-[clamp(4rem,17vw,11rem)] font-extrabold text-signal-yellow">
              DCL
            </span>
          </h1>

          <div
            className="pointer-events-none absolute right-0 top-[12%] z-0 h-14 w-[40%] bg-signal-red sm:top-[18%] sm:h-24 sm:w-[38%]"
            style={{
              clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)',
              opacity: 0.9,
            }}
            aria-hidden
          />

          {/* Under the type. Container is short on phones so the centered
              ribbon sits just under DCL (not floating in mid-canvas cream). */}
          <div className="pointer-events-none absolute -left-4 -right-4 top-[4.5rem] z-0 md:-left-6 md:-right-6 tall:top-24">
            <div className="pointer-events-auto">
              {photos && photos.length > 0 ? (
                <Filmstrip photos={photos} />
              ) : (
                <div
                  className="flex items-center justify-center bg-ink/[0.04]"
                  style={{ height: 'clamp(200px, 34svh, 640px)' }}
                >
                  <p className="font-utility text-xs uppercase tracking-[0.18em] text-ink/35">
                    No photos yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Match short mobile canvas — bio only nips the lower hang. */}
          <div
            aria-hidden
            className="h-[clamp(180px,30svh,250px)] tall:h-[clamp(210px,28svh,290px)]"
          />
        </div>

        <div className="pointer-events-none relative z-40 -mt-10 flex flex-col gap-5 tall:mt-0 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="pointer-events-auto relative z-40 isolate clip-ticket-alt max-w-xl border-2 border-ink bg-cream px-5 py-4 shadow-[6px_8px_0_0_rgba(10,10,10,0.12)] md:px-6 md:py-5">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="signal-badge bg-signal-yellow text-ink">B</span>
              <p className="font-display text-lg font-extrabold tracking-tight text-ink md:text-xl">
                BIO
              </p>
            </div>
            <p className="select-text text-sm leading-relaxed text-ink/85 md:text-base">
              {resume.summary}
            </p>
          </div>
          <nav className="pointer-events-auto font-utility relative z-40 flex flex-wrap gap-x-5 gap-y-3 text-[0.8rem] uppercase tracking-[0.14em] md:text-xs">
            {email && (
              <a
                href={email.href}
                className="py-1 text-signal-blue transition-colors hover:text-signal-red"
              >
                Email
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 text-ink/55 transition-colors hover:text-signal-blue"
              >
                LinkedIn
              </a>
            )}
            <a
              href="#work"
              className="py-1 text-ink/55 transition-colors hover:text-signal-blue"
            >
              Work
            </a>
            <a
              href="#resume"
              className="py-1 text-ink/55 transition-colors hover:text-signal-blue"
            >
              Resume
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
