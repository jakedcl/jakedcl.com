import type {NavLabels} from '@/lib/content'
import {SECTION_SLUGS, type SectionSlug} from '@/lib/routes'

/** Menu colors and order are fixed design (code); the labels come from each page in Studio. */
const NAV_SECTION_ACCENTS: Record<SectionSlug, string> = {
  projects: 'decoration-signal-yellow',
  experience: 'decoration-signal-blue',
  skills: 'decoration-signal-red',
  about: 'decoration-signal-green',
}

export type SectionNavItem = {
  slug: SectionSlug
  label: string
  accentDecoration: string
}

/** A page is in the menu (and exists) only when its Page name is filled in. */
export function sectionNavItems(nav: NavLabels): SectionNavItem[] {
  return SECTION_SLUGS.filter((slug) => nav[slug]).map((slug) => ({
    slug,
    label: nav[slug],
    accentDecoration: NAV_SECTION_ACCENTS[slug],
  }))
}

/** Slightly smaller hero type for long one-line section titles on narrow screens. */
export function introTitleCompact(title: string): boolean {
  const words = title.split(/\s+/).filter(Boolean)
  if (words.some((word) => word.length >= 14)) return true
  return title.length > 18
}
