import type { Metadata } from 'next'
import Link from 'next/link'
import TwoDSite from '../components/TwoDSite'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Old site',
  description: 'The original 2D homepage — filmstrip, resume, and projects.',
  alternates: { canonical: '/old' },
}

export default function OldSitePage() {
  return (
    <TwoDSite
      banner={
        <p className="px-6 py-3 text-sm text-neutral-600 md:px-10">
          This is the old 2D site.{' '}
          <Link href="/" className="underline underline-offset-2">
            Back to the 3D desk
          </Link>
        </p>
      }
    />
  )
}
