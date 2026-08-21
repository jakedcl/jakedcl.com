import dynamic from 'next/dynamic'
import { getSiteContent } from '@/sanity/lib/site'

export const revalidate = 0

const DeskExperience = dynamic(() => import('./components/desk/DeskExperience'), {
  ssr: false,
  loading: () => <div className="h-svh bg-[#b7a48d]" aria-hidden />,
})

export default async function Home() {
  const { projects, settings } = await getSiteContent()
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jake DCL',
    url: 'https://jakedcl.com',
    jobTitle: 'Web Developer',
    description: 'Portfolio website for Jacob Decore Lurker (Jake DCL).',
    sameAs: ['https://github.com/jakedcl', 'https://www.linkedin.com/in/jakedcl'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DeskExperience projects={projects} photos={settings?.galleryPhotos ?? []} />
    </>
  )
}
