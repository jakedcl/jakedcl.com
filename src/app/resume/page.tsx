import type { Metadata } from 'next'
import TwoDSite from '../components/TwoDSite'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Text resume for Jake DCL — web developer.',
  alternates: { canonical: '/resume' },
}

export default function ResumePage() {
  return <TwoDSite />
}
