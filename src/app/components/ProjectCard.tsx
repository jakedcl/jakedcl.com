import { Project } from '@/types/sanity'
import { PortableText } from 'next-sanity'
import Image from 'next/image'

export default function ProjectCard({ project }: { project: Project }) {
  const photo = (project.photos ?? []).find((item) => item?.asset?.url)
  const width = photo?.asset.metadata?.dimensions?.width ?? 1024
  const height = photo?.asset.metadata?.dimensions?.height ?? 768

  const body = (
    <div className="grid items-start gap-4 md:grid-cols-12 md:gap-x-10">
      <div className="order-2 md:order-1 md:col-span-4">
        <PortableText
          value={project.title}
          components={{
            block: {
              normal: ({ children }) => (
                <p className="mt-2 text-sm leading-snug text-neutral-800">{children}</p>
              ),
              h1: ({ children }) => (
                <h3 className="text-lg font-medium tracking-tight text-black group-hover:underline">
                  {children}
                </h3>
              ),
              h2: ({ children }) => (
                <h3 className="text-lg font-medium tracking-tight text-black group-hover:underline">
                  {children}
                </h3>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium tracking-tight text-black group-hover:underline">
                  {children}
                </h3>
              ),
            },
          }}
        />
      </div>
      {photo?.asset.url && (
        <Image
          src={photo.asset.url}
          alt={photo.alt || ''}
          width={width}
          height={height}
          sizes="(min-width: 768px) 62vw, 100vw"
          className="order-1 h-auto w-full border border-black/10 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.45)] transition-[border-color,box-shadow] duration-300 group-hover:border-black/25 group-hover:shadow-[0_18px_36px_-22px_rgba(0,0,0,0.5)] md:order-2 md:col-span-8"
        />
      )}
    </div>
  )

  const className = 'block border-t border-neutral-300 py-8 first:border-t-0 first:pt-2'

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} group`}
      >
        {body}
      </a>
    )
  }

  return <article className={className}>{body}</article>
}
