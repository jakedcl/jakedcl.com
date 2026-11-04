import type { HomeContent } from '@/lib/siteContent'

export const SECTION_SLUGS = [
  'projects',
  'experience',
  'education',
  'skills',
  'certifications',
  'bio',
] as const

export type SectionSlug = (typeof SECTION_SLUGS)[number]

export const SECTION_ROUTE_SLUGS: ReadonlySet<string> = new Set(SECTION_SLUGS)

/** Slugs the dynamic /[slug] short-link route must not capture. */
export const RESERVED_SHORT_LINK_SLUGS: ReadonlySet<string> = new Set([
  ...SECTION_SLUGS,
  'studio',
  'resume',
  'apple-icon',
  'opengraph-image',
])

export type BioAccent = 'yellow' | 'blue' | 'red' | 'green'

const ACCENT_DECORATION: Record<BioAccent, string> = {
  yellow: 'decoration-signal-yellow',
  blue: 'decoration-signal-blue',
  red: 'decoration-signal-red',
  green: 'decoration-signal-green',
}

const FIXED_SECTION_ACCENTS: Record<
  Exclude<SectionSlug, 'bio'>,
  string
> = {
  projects: ACCENT_DECORATION.yellow,
  experience: ACCENT_DECORATION.blue,
  education: ACCENT_DECORATION.red,
  skills: ACCENT_DECORATION.green,
  certifications: ACCENT_DECORATION.yellow,
}

export type SectionNavItem = {
  slug: SectionSlug
  label: string
  accentDecoration: string
}

export function bioAccentDecoration(accent: BioAccent | ''): string {
  if (accent && accent in ACCENT_DECORATION) {
    return ACCENT_DECORATION[accent as BioAccent]
  }
  return ACCENT_DECORATION.blue
}

export function parseBioAccent(value: string | null | undefined): BioAccent | '' {
  const v = value?.trim()
  if (v === 'yellow' || v === 'blue' || v === 'red' || v === 'green') return v
  return ''
}

export function sectionHeading(content: HomeContent, slug: SectionSlug): string {
  switch (slug) {
    case 'projects':
      return content.projectsHeading
    case 'experience':
      return content.experienceHeading
    case 'education':
      return content.educationHeading
    case 'skills':
      return content.skillsHeading
    case 'certifications':
      return content.certificationsHeading
    case 'bio':
      return content.bioHeading
  }
}

function sectionVisible(content: HomeContent, slug: SectionSlug): boolean {
  switch (slug) {
    case 'projects':
      return Boolean(content.projectsHeading)
    case 'experience':
      return content.experience.length > 0
    case 'education':
      return content.education.length > 0
    case 'skills':
      return content.skills.length > 0
    case 'certifications':
      return content.certifications.length > 0
    case 'bio':
      return Boolean(content.bioHeading)
  }
}

export function sectionNavItems(content: HomeContent): SectionNavItem[] {
  const items: SectionNavItem[] = []
  for (const slug of SECTION_SLUGS) {
    if (!sectionVisible(content, slug)) continue
    const label = sectionHeading(content, slug)
    if (!label) continue
    const accentDecoration =
      slug === 'bio'
        ? bioAccentDecoration(content.bioAccent)
        : FIXED_SECTION_ACCENTS[slug]
    items.push({ slug, label, accentDecoration })
  }
  return items
}

export function isSectionSlug(value: string): value is SectionSlug {
  return SECTION_ROUTE_SLUGS.has(value)
}

/** Slightly smaller hero type for long one-line section titles on narrow screens. */
export function introTitleCompact(title: string): boolean {
  const words = title.split(/\s+/).filter(Boolean)
  if (words.some((word) => word.length >= 14)) return true
  return title.length > 18
}
