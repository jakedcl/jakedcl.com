'use client'

import { useId, useState } from 'react'

import type {
  CaseStudyFact,
  CaseStudyStep,
  Image,
  LabeledLink,
} from '@/lib/content'
import NewTabNote from './NewTabNote'
import SanityImage from './SanityImage'

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

export function CaseStudyGallery({
  images,
  ariaLabel,
  previousLabel,
  nextLabel,
}: {
  images: Image[]
  ariaLabel: string
  previousLabel: string
  nextLabel: string
}) {
  const [index, setIndex] = useState(0)
  if (images.length === 0) return null

  const current = images[index] ?? images[0]
  const width = current.width ?? 1200
  const height = current.height ?? 900

  return (
    <section className="case-gallery" {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}>
      <div className="case-gallery-frame overflow-hidden border border-ink/12 bg-cream">
        <SanityImage
          key={current.url}
          src={current.url}
          alt={current.alt}
          width={width}
          height={height}
          sizes="(max-width: 42rem) 100vw, 42rem"
          className="case-gallery-image aspect-[4/3] w-full object-cover object-top"
        />
      </div>
      {current.caption ? (
        <p className="font-utility mt-2 text-[0.65rem] uppercase tracking-[0.14em] text-ink/50">
          {current.caption}
        </p>
      ) : null}
      {images.length > 1 ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="case-gallery-control"
            onClick={() => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
          >
            {previousLabel}
          </button>
          <span className="font-utility text-[0.65rem] tracking-[0.12em] text-ink/45">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            className="case-gallery-control"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
          >
            {nextLabel}
          </button>
        </div>
      ) : null}
    </section>
  )
}

export function CaseStudyFacts({
  facts,
  heading,
  ariaLabel,
}: {
  facts: CaseStudyFact[]
  heading: string
  ariaLabel: string
}) {
  const baseId = useId()
  const [openKey, setOpenKey] = useState<string | null>(null)
  if (facts.length === 0) return null

  return (
    <section className="mt-14" {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}>
      {heading ? (
        <h2 className="font-shape mb-4 text-lg font-bold tracking-tight text-ink">{heading}</h2>
      ) : null}
      <ul className="space-y-2">
        {facts.map((fact, i) => {
          const key = fact._key ?? `${baseId}-${i}`
          const open = openKey === key
          return (
            <li key={key} className="case-fact border border-ink/10 bg-cream/40">
              <button
                type="button"
                className="case-fact-trigger flex w-full items-baseline justify-between gap-3 px-3 py-3 text-left"
                aria-expanded={open}
                onClick={() => setOpenKey(open ? null : key)}
              >
                <span>
                  <span className="font-utility text-[0.65rem] uppercase tracking-[0.14em] text-signal-blue">
                    {fact.label}
                  </span>
                  <span className="mt-1 block text-[0.95rem] leading-snug text-ink/90">
                    {fact.teaser}
                  </span>
                </span>
                <span className="font-utility shrink-0 text-xs text-ink/40" aria-hidden>
                  {open ? '−' : '+'}
                </span>
              </button>
              {open && fact.detail ? (
                <p className="border-t border-ink/8 px-3 pb-3 pt-2 text-sm leading-relaxed text-ink/80">
                  {fact.detail}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function CaseStudySteps({
  steps,
  heading,
  ariaLabel,
}: {
  steps: CaseStudyStep[]
  heading: string
  ariaLabel: string
}) {
  const [active, setActive] = useState(0)
  if (steps.length === 0) return null

  const step = steps[active] ?? steps[0]

  return (
    <section className="mt-14" {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}>
      {heading ? (
        <h2 className="font-shape mb-4 text-lg font-bold tracking-tight text-ink">{heading}</h2>
      ) : null}
      <div className="case-steps flex flex-wrap gap-2" role="tablist">
        {steps.map((item, i) => (
          <button
            key={item._key ?? item.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={
              i === active
                ? 'case-step-tab case-step-tab--active'
                : 'case-step-tab'
            }
            onClick={() => setActive(i)}
          >
            <span className="font-utility text-[0.6rem] tracking-[0.12em] text-ink/45">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="mt-0.5 block font-shape text-sm font-bold">{item.title}</span>
          </button>
        ))}
      </div>
      <div
        className="case-step-panel mt-4 border border-ink/12 bg-cream/50 px-4 py-4"
        role="tabpanel"
      >
        <p className="text-[0.95rem] leading-relaxed text-ink/90">{step.body}</p>
      </div>
    </section>
  )
}

export function CaseStudyLinks({
  links,
  newTabNote,
}: {
  links: Array<LabeledLink | null>
  newTabNote: string
}) {
  const shown = links.filter((link): link is LabeledLink => link !== null)
  if (shown.length === 0) return null

  return (
    <p className="mt-14 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {shown.map((link) => (
        <a
          key={link.url}
          href={link.url}
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
          <NewTabNote note={newTabNote} />
        </a>
      ))}
    </p>
  )
}
