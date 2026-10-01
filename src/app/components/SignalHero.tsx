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
    <header className="relative overflow-hidden border-b border-ink/10">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink/10 px-4 py-2.5 md:px-6">
        <p className="font-utility text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ink/55 md:text-xs">
          NYC · WEB · SYSTEMS ·{' '}
          <span className="text-signal-green">AVAILABLE</span>
        </p>
      </div>

      <div className="relative px-4 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12">
        <div className="hero-scrub relative">
          <h1 className="font-display relative z-10 select-none leading-[0.82] tracking-[-0.04em]">
            <span className="block text-[clamp(4.5rem,18vw,11rem)] font-extrabold text-ink">
              JAKE
            </span>
            <span className="relative -mt-[0.12em] block text-[clamp(4.5rem,18vw,11rem)] font-extrabold text-signal-yellow">
              DCL
            </span>
          </h1>

          <div
            className="pointer-events-none absolute right-0 top-[12%] h-16 w-[42%] bg-signal-red sm:top-[18%] sm:h-24 sm:w-[38%]"
            style={{
              clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)',
              opacity: 0.9,
            }}
            aria-hidden
          />
        </div>

        <div className="relative z-20 -mx-4 mt-2 md:-mx-6 md:-mt-2">
          {photos && photos.length > 0 ? (
            <Filmstrip photos={photos} />
          ) : (
            <div className="flex h-[118px] items-center justify-center bg-black md:h-[152px]">
              <p className="font-utility text-xs uppercase tracking-[0.18em] text-signal-yellow/50">
                No photos yet
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-ink/80 md:text-base">
            {resume.summary}
          </p>
          <nav className="font-utility flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.14em]">
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
