'use client'

import dynamic from 'next/dynamic'
import type { NotebookCopy } from '@/data/notebook'
import type { Project, SanityImage } from '@/types/sanity'

const DeskExperience = dynamic(() => import('./DeskExperience'), {
  ssr: false,
  loading: () => <div className="h-svh bg-[#b7a48d]" aria-hidden />,
})

export default function DeskLander({
  projects,
  photos,
  notebook,
}: {
  projects: Project[]
  photos: SanityImage[]
  notebook: NotebookCopy
}) {
  return <DeskExperience projects={projects} photos={photos} notebook={notebook} />
}
