import { resume } from '@/data/resume'

export default function HomeIntro() {
  return (
    <header className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-black md:text-4xl">{resume.legalName}</h1>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-700 md:text-base">
        {resume.contact.map((link, index) => (
          <span key={link.label} className="inline-flex items-center gap-2">
            {index > 0 && (
              <span className="text-neutral-400" aria-hidden>
                |
              </span>
            )}
            <a
              href={link.href}
              className="underline underline-offset-2 transition-colors hover:text-black"
              {...(link.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {link.label}
            </a>
          </span>
        ))}
      </p>
      <p className="text-base leading-relaxed text-neutral-800 md:text-lg">{resume.summary}</p>
      <p className="text-sm text-neutral-500">
        Click the marble notebook in the corner to open the full resume.
      </p>
    </header>
  )
}
