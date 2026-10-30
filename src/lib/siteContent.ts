import type { PortableTextBlock } from 'next-sanity'

import { apiVersion, dataset, projectId } from '@/sanity/env'
import { settingsQuery } from '@/sanity/lib/queries'
import type { HomeLink, HomeRole, HomeSkillGroup } from '@/types/home'

export type HomeContent = {
  loadError: boolean
  legalName: string
  tagline: string
  summary: string
  bio: PortableTextBlock[]
  links: HomeLink[]
  skills: HomeSkillGroup[]
  experience: HomeRole[]
  education: HomeRole[]
  certifications: HomeRole[]
  heroTitle: string
  projectsHeading: string
  experienceHeading: string
  educationHeading: string
  skillsHeading: string
  certificationsHeading: string
  footerText: string
  siteTitle: string
  metaDescription: string
  authorName: string
  metaCategory: string
  ogTitle: string
  ogDescription: string
  ogSiteName: string
  ogImageAlt: string
  ogCardKicker: string
  ogCardStatus: string
  ogCardFooter: string
  appIconText: string
  appName: string
  appShortName: string
  appDescription: string
  notFoundTitle: string
  notFoundBody: string
  notFoundLinkLabel: string
  keywords: string[]
  ogImage: { url: string; width?: number; height?: number } | null
}

type SanityRole = {
  _key?: string
  title?: string | null
  organization?: string | null
  organizationUrl?: string | null
  period?: string | null
  bullets?: Array<string | null> | null
}

type SanitySettings = {
  legalName?: string | null
  tagline?: string | null
  summary?: string | null
  bio?: PortableTextBlock[] | null
  links?: Array<{ _key?: string; label?: string | null; href?: string | null }> | null
  skills?: Array<{
    _key?: string
    label?: string | null
    items?: Array<string | null> | null
  }> | null
  experience?: SanityRole[] | null
  education?: SanityRole[] | null
  certifications?: SanityRole[] | null
  heroTitle?: string | null
  projectsHeading?: string | null
  experienceHeading?: string | null
  educationHeading?: string | null
  skillsHeading?: string | null
  certificationsHeading?: string | null
  footerText?: string | null
  siteTitle?: string | null
  metaDescription?: string | null
  authorName?: string | null
  metaCategory?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogSiteName?: string | null
  ogImageAlt?: string | null
  ogCardKicker?: string | null
  ogCardStatus?: string | null
  ogCardFooter?: string | null
  appIconText?: string | null
  appName?: string | null
  appShortName?: string | null
  appDescription?: string | null
  notFoundTitle?: string | null
  notFoundBody?: string | null
  notFoundLinkLabel?: string | null
  keywords?: Array<string | null> | null
  ogImageUrl?: string | null
  ogImageWidth?: number | null
  ogImageHeight?: number | null
}

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const settings = await sanityQuery<SanitySettings | null>(settingsQuery)
    if (!settings) return emptyContent(false)
    return {
      loadError: false,
      legalName: text(settings.legalName),
      tagline: text(settings.tagline),
      summary: text(settings.summary),
      bio: bioFrom(settings.bio),
      links: linksFrom(settings.links),
      skills: skillsFrom(settings.skills),
      experience: rolesFrom(settings.experience),
      education: rolesFrom(settings.education),
      certifications: rolesFrom(settings.certifications),
      heroTitle: text(settings.heroTitle),
      projectsHeading: text(settings.projectsHeading),
      experienceHeading: text(settings.experienceHeading),
      educationHeading: text(settings.educationHeading),
      skillsHeading: text(settings.skillsHeading),
      certificationsHeading: text(settings.certificationsHeading),
      footerText: text(settings.footerText),
      siteTitle: text(settings.siteTitle),
      metaDescription: text(settings.metaDescription),
      authorName: text(settings.authorName),
      metaCategory: text(settings.metaCategory),
      ogTitle: text(settings.ogTitle),
      ogDescription: text(settings.ogDescription),
      ogSiteName: text(settings.ogSiteName),
      ogImageAlt: text(settings.ogImageAlt),
      ogCardKicker: text(settings.ogCardKicker),
      ogCardStatus: text(settings.ogCardStatus),
      ogCardFooter: text(settings.ogCardFooter),
      appIconText: text(settings.appIconText),
      appName: text(settings.appName),
      appShortName: text(settings.appShortName),
      appDescription: text(settings.appDescription),
      notFoundTitle: text(settings.notFoundTitle),
      notFoundBody: text(settings.notFoundBody),
      notFoundLinkLabel: text(settings.notFoundLinkLabel),
      keywords: (settings.keywords ?? []).map((k) => k?.trim() ?? '').filter(Boolean),
      ogImage: ogImageFrom(settings),
    }
  } catch {
    return emptyContent(true)
  }
}

function ogImageFrom(settings: SanitySettings): HomeContent['ogImage'] {
  const url = httpUrl(settings.ogImageUrl)
  if (!url) return null
  return {
    url,
    width: settings.ogImageWidth ?? undefined,
    height: settings.ogImageHeight ?? undefined,
  }
}

function emptyContent(loadError: boolean): HomeContent {
  return {
    loadError,
    legalName: '',
    tagline: '',
    summary: '',
    bio: [],
    links: [],
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    heroTitle: '',
    projectsHeading: '',
    experienceHeading: '',
    educationHeading: '',
    skillsHeading: '',
    certificationsHeading: '',
    footerText: '',
    siteTitle: '',
    metaDescription: '',
    authorName: '',
    metaCategory: '',
    ogTitle: '',
    ogDescription: '',
    ogSiteName: '',
    ogImageAlt: '',
    ogCardKicker: '',
    ogCardStatus: '',
    ogCardFooter: '',
    appIconText: '',
    appName: '',
    appShortName: '',
    appDescription: '',
    notFoundTitle: '',
    notFoundBody: '',
    notFoundLinkLabel: '',
    keywords: [],
    ogImage: null,
  }
}

async function sanityQuery<T>(query: string): Promise<T> {
  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  )
  url.searchParams.set('query', query)
  const response = await fetch(url, { next: { revalidate: 60 } })
  if (!response.ok) throw new Error(`Sanity query failed (${response.status})`)
  const body = (await response.json()) as { result: T }
  return body.result
}

function text(value: string | null | undefined): string {
  return value?.trim() ?? ''
}

function bioFrom(value: PortableTextBlock[] | null | undefined): PortableTextBlock[] {
  if (!Array.isArray(value)) return []
  return value.filter((block) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) return false
    return block.children.some((child) => {
      if (!child || typeof child !== 'object' || !('text' in child)) return false
      return typeof child.text === 'string' && child.text.trim().length > 0
    })
  })
}

function linksFrom(
  value: Array<{ _key?: string; label?: string | null; href?: string | null }> | null | undefined,
): HomeLink[] {
  const items: HomeLink[] = []
  for (const item of value ?? []) {
    const label = item.label?.trim()
    const href = safeHref(item.href)
    if (!label || !href) continue
    items.push({ _key: item._key, label, href })
  }
  return items
}

function skillsFrom(value: SanitySettings['skills']): HomeSkillGroup[] {
  const groups: HomeSkillGroup[] = []
  for (const group of value ?? []) {
    const label = group.label?.trim()
    const items = (group.items ?? []).map((item) => item?.trim() ?? '').filter(Boolean)
    if (!label || items.length === 0) continue
    groups.push({ _key: group._key, label, items })
  }
  return groups
}

function rolesFrom(value: SanityRole[] | null | undefined): HomeRole[] {
  const roles: HomeRole[] = []
  for (const role of value ?? []) {
    const title = role.title?.trim()
    const organization = role.organization?.trim()
    if (!title || !organization) continue
    roles.push({
      _key: role._key,
      title,
      organization,
      organizationUrl: httpUrl(role.organizationUrl) ?? undefined,
      period: role.period?.trim() ?? '',
      bullets: (role.bullets ?? []).map((bullet) => bullet?.trim() ?? '').filter(Boolean),
    })
  }
  return roles
}

function safeHref(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    if (!['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) return null
    return url.toString()
  } catch {
    return null
  }
}

function httpUrl(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    return url.toString()
  } catch {
    return null
  }
}
