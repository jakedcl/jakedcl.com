import { metadataForSection } from '@/lib/sectionMetadata'
import { SectionPage } from '@/lib/sectionPage'

export const revalidate = 60

export const generateMetadata = () => metadataForSection('bio')

export default async function BioPage() {
  return SectionPage({ section: 'bio' })
}
