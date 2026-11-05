import { metadataForSection } from '@/lib/sectionMetadata'
import { SectionPage } from '@/lib/sectionPage'

export const revalidate = 60

export const generateMetadata = () => metadataForSection('education')

export default async function EducationPage() {
  return SectionPage({ section: 'education' })
}
