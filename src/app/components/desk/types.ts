import type { Project, SanityImage } from '@/types/sanity'

export type ShotName =
  | 'intro'
  | 'cover'
  | 'aerial'
  | 'page'
  | 'desk'
  | 'projects'
  | 'gallery'
  | 'contact'

export type DeskContent = {
  projects: Project[]
  photos: SanityImage[]
}
