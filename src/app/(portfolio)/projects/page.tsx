import { metadataForSection } from '@/lib/sectionMetadata'
import { SectionPage } from '@/lib/sectionPage'

export const revalidate = 60

export const generateMetadata = () => metadataForSection('projects')

export default async function ProjectsPage() {
  return SectionPage({ section: 'projects' })
}
