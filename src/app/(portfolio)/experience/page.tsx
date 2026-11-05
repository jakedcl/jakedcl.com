import { metadataForSection } from '@/lib/sectionMetadata'
import { SectionPage } from '@/lib/sectionPage'

export const revalidate = 60

export const generateMetadata = () => metadataForSection('experience')

export default async function ExperiencePage() {
  return SectionPage({ section: 'experience' })
}
