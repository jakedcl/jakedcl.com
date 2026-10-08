import { Project, SanityImage } from '@/types/sanity'
import { PortableText } from 'next-sanity'
import Image from 'next/image'

const SPINE = [
  'bg-signal-yellow',
  'bg-signal-blue',
  'bg-signal-red',
  'bg-signal-green',
] as const

function PagePhotos({ photos }: { photos: SanityImage[] }) {
  const shots = photos.filter((p) => p?.asset?.url).slice(0, 2)

  if (shots.length === 0) {
    return (
      <div className="flex h-full min-h-[11rem] items-center justify-center bg-ink/[0.04] md:min-h-[14rem]">
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
      <div className="relative h-full min-h-[11rem] overflow-hidden md:min-h-[14rem]">
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
    <div className="grid h-full min-h-[11rem] grid-cols-2 gap-1.5 p-1.5 md:min-h-[14rem]">
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
}: {
  project: Project
  index?: number
}) {
  const photos = project.photos ?? []
  const spine = SPINE[index % SPINE.length]
  const num = String(index + 1).padStart(2, '0')

  const book = (
    <div className="project-book-scene px-4 py-5 md:px-8 md:py-7">
      <div className="project-book">
        {/* Open pages */}
        <div className="project-book-pages relative grid grid-cols-1 overflow-hidden border border-ink/12 bg-cream sm:grid-cols-2">
          {/* Center crease */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-10 hidden w-px -translate-x-1/2 sm:block"
            aria-hidden
          >
            <div className="absolute inset-y-0 -left-3 w-3 bg-gradient-to-l from-ink/10 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-px bg-ink/15" />
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-ink/10 to-transparent" />
          </div>

          {/* Left page — description */}
          <div className="relative flex flex-col justify-between gap-5 px-5 py-6 sm:px-7 sm:py-8">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`signal-badge h-7 w-7 text-[0.6rem] ${spine} text-ink`}
                  aria-hidden
                >
                  {num}
                </span>
                <span className="font-utility text-[0.6rem] uppercase tracking-[0.16em] text-ink/35">
                  Vol. {num}
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

          {/* Right page — picture(s) */}
          <div className="relative border-t border-ink/10 sm:border-t-0 sm:border-l sm:border-ink/8">
            <PagePhotos photos={photos} />
          </div>
        </div>

        {/* Spine — bottom edge, reads as thickness when tilted */}
        <div className="project-book-spine" aria-hidden>
          <div className={`h-full w-full ${spine}`} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-ink/20" />
          <div className="pointer-events-none absolute inset-x-[8%] top-1/2 h-px -translate-y-1/2 bg-ink/10" />
        </div>
      </div>
    </div>
  )

  const className = 'band-enter group block'

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {book}
      </a>
    )
  }

  return <article className={className}>{book}</article>
}
