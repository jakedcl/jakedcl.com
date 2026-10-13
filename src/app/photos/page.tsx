import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { galleryQuery } from '@/sanity/lib/queries'
import type { SanityImage } from '@/types/sanity'
import PhotoGrid, { type PhotoTile } from './PhotoGrid'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Photos',
  description: 'Photo gallery from Jake DCL.',
  alternates: { canonical: '/photos' },
}

function sized(photo: SanityImage, width: number) {
  try {
    return urlFor(photo).width(width).auto('format').fit('max').quality(70).url()
  } catch {
    return photo.asset?.url ?? ''
  }
}

export default async function PhotosPage() {
  let photos: SanityImage[] = []
  let error = false
  try {
    const settings = await client.fetch<{ galleryPhotos?: SanityImage[] } | null>(galleryQuery)
    photos = settings?.galleryPhotos ?? []
  } catch {
    error = true
  }

  const tiles: PhotoTile[] = photos
    .filter((photo) => photo?.asset?.url)
    .map((photo, index) => {
      const width = photo.asset?.metadata?.dimensions?.width ?? 1200
      const height = photo.asset?.metadata?.dimensions?.height ?? 900
      const n = String(index + 1).padStart(2, '0')
      return {
        key: photo._key || photo.asset?._id || `photo-${n}`,
        src: sized(photo, 800),
        full: sized(photo, 1600),
        alt: photo.alt?.trim() || `Photo ${n}`,
        caption: photo.caption?.trim() || undefined,
        width,
        height,
      }
    })

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
          <Link href="/#work" className="text-ink/55 transition-colors hover:text-signal-blue">
            Work
          </Link>
          <Link href="/resume" className="text-ink/55 transition-colors hover:text-signal-blue">
            Resume
          </Link>
        </nav>
      </header>

      <main className="px-4 py-10 md:px-6 md:py-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 md:mb-8">
          <div className="flex items-center gap-3">
            <span className="signal-badge bg-signal-yellow text-ink">P</span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              PHOTOS
            </h1>
          </div>
          {!error && tiles.length > 0 && (
            <span className="stamp-chip">{String(tiles.length).padStart(2, '0')} frames</span>
          )}
        </div>

        {error ? (
          <p className="font-utility text-sm uppercase tracking-[0.16em] text-ink/45">
            Photos didn&apos;t load. Refresh to try again.
          </p>
        ) : tiles.length === 0 ? (
          <p className="font-utility text-sm uppercase tracking-[0.16em] text-ink/40">
            No photos yet.
          </p>
        ) : (
          <PhotoGrid photos={tiles} />
        )}
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
