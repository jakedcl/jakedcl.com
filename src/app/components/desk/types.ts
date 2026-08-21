import type { Project, SanityImage } from '@/types/sanity'

export type ShotName =
  | 'intro'
  | 'cover'
  | 'page'
  | 'desk'
  | 'projects'
  | 'gallery'
  | 'contact'

export type DeskContent = {
  projects: Project[]
  photos: SanityImage[]
}
