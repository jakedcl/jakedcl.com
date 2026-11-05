import { metadataForSection } from '@/lib/sectionMetadata'
import { SectionPage } from '@/lib/sectionPage'

export const revalidate = 60

export const generateMetadata = () => metadataForSection('about')

export default async function AboutPage() {
  return SectionPage({ section: 'about' })
}
