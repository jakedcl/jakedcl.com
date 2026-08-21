import type { ReactNode } from 'react'
import TwoDPortfolio from './TwoDPortfolio'
import { getSiteContent } from '@/sanity/lib/site'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jake DCL',
  url: 'https://jakedcl.com',
  jobTitle: 'Web Developer',
  description: 'Portfolio website for Jacob Decore Lurker (Jake DCL).',
  sameAs: ['https://github.com/jakedcl', 'https://www.linkedin.com/in/jakedcl'],
}

export default async function TwoDSite({ banner }: { banner?: ReactNode }) {
  const { projects, settings } = await getSiteContent()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <TwoDPortfolio projects={projects} photos={settings?.galleryPhotos ?? []} banner={banner} />
    </>
  )
}
