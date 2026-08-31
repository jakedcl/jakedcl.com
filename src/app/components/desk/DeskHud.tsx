'use client'

import Link from 'next/link'
import { resume } from '@/data/resume'
import { urlFor } from '@/sanity/lib/image'
import type { Project, SanityImage } from '@/types/sanity'
import Filmstrip from '../Filmstrip'
import ProjectCard from '../ProjectCard'
import type { ShotName } from './types'

const NAV: { shot: ShotName; label: string }[] = [
  { shot: 'desk', label: 'Desk' },
  { shot: 'page', label: 'Resume' },
]

export default function DeskHud({
  shot,
  introDone,
  projects,
  photos,
  onSkip,
  onSelectShot,
}: {
  shot: ShotName
  introDone: boolean
  projects: Project[]
  photos: SanityImage[]
  onSkip: () => void
  onSelectShot: (shot: ShotName) => void
}) {
  // Clean top-of-viewport bar (OG layout) — not a fake in-page paper overlay.
  const showFilmstrip = photos.length > 0 && introDone && shot === 'page'

  return (
    <>
      {showFilmstrip ? (
        <div className="pointer-events-auto absolute inset-x-0 top-0 z-10">
          <Filmstrip photos={photos} variant="overlay" />
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4 md:p-5">
        <p className="pointer-events-none text-xs tracking-wide text-black/70 md:text-sm">
          Jake DCL
        </p>
        <div className="pointer-events-auto flex items-center gap-3 text-xs md:text-sm">
          {!introDone ? (
            <button
              type="button"
              onClick={onSkip}
              className="cursor-pointer rounded-full bg-white/85 px-3 py-1.5 text-black shadow-sm backdrop-blur hover:bg-white"
            >
              Skip intro
            </button>
          ) : null}
          <Link
            href="/resume"
            className="cursor-pointer rounded-full bg-white/85 px-3 py-1.5 text-black shadow-sm backdrop-blur hover:bg-white"
          >
            Text resume
          </Link>
        </div>
      </div>

      {introDone ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4 md:p-6">
          <nav className="pointer-events-auto flex flex-wrap items-center justify-center gap-1 rounded-full bg-white/85 p-1.5 text-xs shadow-sm backdrop-blur md:text-sm">
            {NAV.map((item) => (
              <button
                key={item.shot}
                type="button"
                onClick={() => onSelectShot(item.shot)}
                className={`cursor-pointer rounded-full px-3 py-1.5 transition-colors ${
                  shot === item.shot ? 'bg-black text-white' : 'text-black hover:bg-black/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      ) : null}

      {shot === 'projects' ? (
        <aside className="desk-panel">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">Projects</h2>
          <div className="space-y-4">
            {projects.length ? (
              projects.map((project) => (
                <ProjectCard key={project._id} project={project} compact />
              ))
            ) : (
              <p className="text-sm text-neutral-600">Projects will show up here from Sanity.</p>
            )}
          </div>
        </aside>
      ) : null}

      {shot === 'gallery' ? (
        <aside className="desk-panel">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">Photos</h2>
          {photos.length ? (
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo, index) => {
                const src = photo.asset?.url
                  ? `${photo.asset.url}?w=480&h=480&fit=crop`
                  : urlFor(photo).width(480).height(480).url()
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src + index}
                    src={src}
                    alt={photo.alt || photo.caption || `Photo ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-neutral-600">Add gallery photos in Sanity to fill the polaroids.</p>
          )}
        </aside>
      ) : null}

      {shot === 'contact' ? (
        <aside className="desk-panel">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide">Contact</h2>
          <p className="mb-4 text-lg font-medium">{resume.legalName}</p>
          <ul className="space-y-2 text-sm">
            {resume.contact.map((link) => (
              <li key={link.label}>
                <a className="underline underline-offset-2" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <a className="underline underline-offset-2" href="/resume.pdf" download="Jake_DeCore_Lurker_Resume.pdf">
              Download Resume PDF
            </a>
          </p>
        </aside>
      ) : null}

      {shot === 'desk' && introDone ? (
        <p className="pointer-events-none absolute left-1/2 top-14 z-20 -translate-x-1/2 text-center text-xs text-black/60 md:text-sm">
          Drag to look around · click the notebook to open the resume
        </p>
      ) : null}
    </>
  )
}
