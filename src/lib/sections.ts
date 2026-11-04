import type { HomeContent } from '@/lib/siteContent'

export const SECTION_SLUGS = [
  'projects',
  'experience',
  'education',
  'skills',
  'about',
] as const

export type SectionSlug = (typeof SECTION_SLUGS)[number]

export const SECTION_ROUTE_SLUGS: ReadonlySet<string> = new Set(SECTION_SLUGS)

/** Slugs the dynamic /[slug] short-link route must not capture. */
export const RESERVED_SHORT_LINK_SLUGS: ReadonlySet<string> = new Set([
  ...SECTION_SLUGS,
  'certifications',
  'studio',
  'resume',
  'apple-icon',
  'opengraph-image',
])

export type AboutAccent = 'yellow' | 'blue' | 'red' | 'green' | 'purple'

const ACCENT_DECORATION: Record<AboutAccent, string> = {
  yellow: 'decoration-signal-yellow',
  blue: 'decoration-signal-blue',
  red: 'decoration-signal-red',
  green: 'decoration-signal-green',
  purple: 'decoration-signal-purple',
}

const FIXED_SECTION_ACCENTS: Record<
  Exclude<SectionSlug, 'about'>,
  string
> = {
  projects: ACCENT_DECORATION.yellow,
  experience: ACCENT_DECORATION.blue,
  education: ACCENT_DECORATION.red,
  skills: ACCENT_DECORATION.green,
}

export type SectionNavItem = {
  slug: SectionSlug
  label: string
  accentDecoration: string
}

export function aboutAccentDecoration(accent: AboutAccent | ''): string {
  if (accent && accent in ACCENT_DECORATION) {
    return ACCENT_DECORATION[accent as AboutAccent]
  }
  return ACCENT_DECORATION.purple
}

export function parseAboutAccent(value: string | null | undefined): AboutAccent | '' {
  const v = value?.trim()
  if (
    v === 'yellow' ||
    v === 'blue' ||
    v === 'red' ||
    v === 'green' ||
    v === 'purple'
  ) {
    return v
  }
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
    case 'about':
      return content.aboutHeading
  }
}

function sectionVisible(content: HomeContent, slug: SectionSlug): boolean {
  switch (slug) {
    case 'projects':
      return Boolean(content.projectsHeading)
    case 'experience':
      return content.experience.length > 0
    case 'education':
      return content.education.length > 0 || content.certifications.length > 0
    case 'skills':
      return content.skills.length > 0
    case 'about':
      return Boolean(content.aboutHeading) || content.aboutLong.length > 0
  }
}

export function sectionNavItems(content: HomeContent): SectionNavItem[] {
  const items: SectionNavItem[] = []
  for (const slug of SECTION_SLUGS) {
    if (!sectionVisible(content, slug)) continue
    const label = sectionHeading(content, slug)
    if (!label) continue
    const accentDecoration =
      slug === 'about'
        ? aboutAccentDecoration(content.aboutAccent)
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
