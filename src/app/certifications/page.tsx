import { metadataForSection } from '@/lib/sectionMetadata'
import { SectionPage } from '@/lib/sectionPage'

export const revalidate = 60

export const generateMetadata = () => metadataForSection('certifications')

export default async function CertificationsPage() {
  return SectionPage({ section: 'certifications' })
}
