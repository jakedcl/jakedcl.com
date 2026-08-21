'use client'

import dynamic from 'next/dynamic'
import type { Project, SanityImage } from '@/types/sanity'

const DeskExperience = dynamic(() => import('./DeskExperience'), {
  ssr: false,
  loading: () => <div className="h-svh bg-[#b7a48d]" aria-hidden />,
})

export default function DeskLander({
  projects,
  photos,
}: {
  projects: Project[]
  photos: SanityImage[]
}) {
  return <DeskExperience projects={projects} photos={photos} />
}
