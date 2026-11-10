import Link from 'next/link'

import type { Image } from '@/lib/content'
import SanityImage from './SanityImage'

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

export default function FeaturedCaseStudy({
  label,
  name,
  sentence,
  image,
  linkLabel,
  href,
}: {
  label: string
  name: string
  sentence: string
  image: Image | null
  linkLabel: string
  href: string
}) {
  return (
    <article className="featured-case mt-8 border-t border-ink/10 pt-8">
      <div className="grid gap-5 sm:grid-cols-[min(42%,11.5rem)_1fr] sm:items-start">
        {image ? (
          <Link
            href={href}
            className="featured-case-image block overflow-hidden border border-ink/12 bg-cream"
          >
            <SanityImage
              src={image.url}
              alt={image.alt}
              width={image.width ?? 640}
              height={image.height ?? 480}
              sizes="(max-width: 640px) 100vw, 11.5rem"
              className="aspect-[4/3] h-auto w-full object-cover"
            />
          </Link>
        ) : null}
        <div>
          {label ? (
            <p className="font-utility text-[0.65rem] uppercase tracking-[0.18em] text-ink/50">
              {label}
            </p>
          ) : null}
          <h2 className="font-display mt-1 text-xl font-extrabold tracking-tight text-ink">
            <Link href={href} className={linkClass}>
              {name}
            </Link>
          </h2>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/85">{sentence}</p>
          {linkLabel ? (
            <p className="mt-3 text-sm">
              <Link
                href={href}
                className={`font-shape font-bold text-ink ${linkClass} decoration-signal-yellow`}
              >
                {linkLabel}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
