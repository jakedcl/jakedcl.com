import type { Metadata } from 'next'
import TwoDPortfolio from '../components/TwoDPortfolio'
import { getSiteContent } from '@/sanity/lib/site'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Text resume for Jake DCL — web developer.',
  alternates: { canonical: '/resume' },
}

export default async function ResumePage() {
  const { projects, settings } = await getSiteContent()

  return <TwoDPortfolio projects={projects} photos={settings?.galleryPhotos ?? []} />
}
