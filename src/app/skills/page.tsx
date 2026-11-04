import { metadataForSection } from '@/lib/sectionMetadata'
import { SectionPage } from '@/lib/sectionPage'

export const revalidate = 60

export const generateMetadata = () => metadataForSection('skills')

export default async function SkillsPage() {
  return SectionPage({ section: 'skills' })
}
