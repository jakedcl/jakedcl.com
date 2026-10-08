import { Project, SanityImage } from '@/types/sanity'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import { CSSProperties } from 'react'

const ACCENT = [
  'bg-signal-yellow',
  'bg-signal-blue',
  'bg-signal-red',
  'bg-signal-green',
] as const

function PagePhotos({
  photos,
  fit,
}: {
  photos: SanityImage[]
  fit: boolean
}) {
  const shots = photos.filter((p) => p?.asset?.url).slice(0, 2)

  if (shots.length === 0) {
    return (
      <div
        className={`flex h-full items-center justify-center bg-ink/[0.04] ${fit ? 'min-h-0' : 'min-h-[11rem] md:min-h-[14rem]'}`}
      >
        <span className="font-utility text-[0.65rem] uppercase tracking-[0.18em] text-ink/35">
          No still
        </span>
      </div>
    )
  }

  if (shots.length === 1) {
    const photo = shots[0]
    const width = photo.asset.metadata?.dimensions?.width ?? 1024
    const height = photo.asset.metadata?.dimensions?.height ?? 768
    return (
      <div
        className={`relative h-full overflow-hidden ${fit ? 'min-h-0' : 'min-h-[11rem] md:min-h-[14rem]'}`}
      >
        <Image
          src={photo.asset.url}
          alt={photo.alt || ''}
          width={width}
          height={height}
          sizes="(min-width: 768px) 40vw, 90vw"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
    )
  }

  return (
    <div
      className={`grid h-full grid-cols-2 gap-1.5 p-1.5 ${fit ? 'min-h-0' : 'min-h-[11rem] md:min-h-[14rem]'}`}
    >
      {shots.map((photo) => {
        const width = photo.asset.metadata?.dimensions?.width ?? 800
        const height = photo.asset.metadata?.dimensions?.height ?? 600
        return (
          <div key={photo.asset.url} className="relative overflow-hidden">
            <Image
              src={photo.asset.url}
              alt={photo.alt || ''}
              width={width}
              height={height}
              sizes="(min-width: 768px) 20vw, 45vw"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
        )
      })}
    </div>
  )
}

export default function ProjectCard({
  project,
  index = 0,
  className = '',
  style,
  fit = false,
}: {
  project: Project
  index?: number
  className?: string
  style?: CSSProperties
  fit?: boolean
}) {
  const photos = project.photos ?? []
  const accent = ACCENT[index % ACCENT.length]
  const num = String(index + 1).padStart(2, '0')

  const sheet = (
    <div
      className={`relative grid grid-cols-1 overflow-hidden border border-ink/12 bg-cream shadow-[0_18px_40px_-28px_rgba(10,10,10,0.45)] sm:grid-cols-2 ${fit ? 'h-full' : ''}`}
    >
      <div className="relative flex min-h-0 flex-col justify-between gap-5 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`signal-badge h-7 w-7 text-[0.6rem] ${accent} text-ink`}
              aria-hidden
            >
              {num}
            </span>
            <span className="font-utility text-[0.6rem] uppercase tracking-[0.16em] text-ink/35">
              {num}
            </span>
          </div>
          <PortableText
            value={project.title}
            components={{
              block: {
                normal: ({ children }) => (
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    {children}
                  </p>
                ),
                h1: ({ children }) => (
                  <h3 className="font-display text-2xl font-extrabold leading-[0.95] tracking-tight text-ink transition-colors group-hover:text-signal-blue md:text-3xl lg:text-4xl">
                    {children}
                  </h3>
                ),
                h2: ({ children }) => (
                  <h3 className="font-display text-2xl font-extrabold leading-[0.95] tracking-tight text-ink transition-colors group-hover:text-signal-blue md:text-3xl lg:text-4xl">
                    {children}
                  </h3>
                ),
                h3: ({ children }) => (
                  <h3 className="font-display text-2xl font-extrabold leading-[0.95] tracking-tight text-ink transition-colors group-hover:text-signal-blue md:text-3xl lg:text-4xl">
                    {children}
                  </h3>
                ),
              },
            }}
          />
        </div>
        {project.link && (
          <p className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-signal-blue transition-colors group-hover:text-signal-red">
            Open project →
          </p>
        )}
      </div>

      <div className="relative min-h-0 border-t border-ink/10 sm:border-t-0 sm:border-l sm:border-ink/8">
        <PagePhotos photos={photos} fit={fit} />
      </div>
    </div>
  )

  const rootClass = `group block ${fit ? 'h-full' : ''} ${className}`.trim()

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={rootClass}
        style={style}
      >
        {sheet}
      </a>
    )
  }

  return (
    <article className={rootClass} style={style}>
      {sheet}
    </article>
  )
}
