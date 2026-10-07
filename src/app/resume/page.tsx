import type { Metadata } from 'next'
import Link from 'next/link'
import Resume from '../components/Resume'
import { resume } from '@/data/resume'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume for Jake DeCore-Lurker — web developer, systems, and creative technology.',
  alternates: {
    canonical: '/resume',
  },
}

export default function ResumePage() {
  const email = resume.contact.find((c) => c.href.startsWith('mailto:'))

  return (
    <div className="min-h-screen bg-background text-ink">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink px-4 py-3 md:px-6">
        <Link
          href="/"
          className="font-display text-lg font-extrabold tracking-tight text-ink transition-colors hover:text-signal-blue"
        >
          JAKE DCL
        </Link>
        <nav className="font-utility flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.14em]">
          <Link
            href="/#work"
            className="text-ink/55 transition-colors hover:text-signal-blue"
          >
            Work
          </Link>
          {email && (
            <a
              href={email.href}
              className="text-signal-blue transition-colors hover:text-signal-red"
            >
              Email
            </a>
          )}
        </nav>
      </header>

      <main className="px-4 py-12 md:px-6 md:py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 md:mb-8">
          <div className="flex items-center gap-3">
            <span className="signal-badge bg-signal-blue text-cream">R</span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              RESUME
            </h1>
          </div>
          <span className="stamp-chip">on file</span>
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="clip-ticket-alt border-2 border-ink bg-cream px-5 py-8 text-ink shadow-[8px_12px_0_0_rgba(10,10,10,0.08)] md:px-10 md:py-12">
            <Resume part="body" />
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-ink px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
            JAKEDCL.COM · NYC
          </p>
          <Link href="/" className="stamp-btn text-[0.7rem]">
            Back home
          </Link>
        </div>
      </footer>
    </div>
  )
}
