import type {PortableTextBlock} from 'next-sanity'

import {type SectionSlug, SECTION_SLUGS} from '@/lib/routes'
import {sanityFetch} from '@/sanity/lib/fetch'
import {
  aboutPageQuery,
  experiencePageQuery,
  homeQuery,
  pathLookupQuery,
  projectPageQuery,
  projectSlugsQuery,
  projectsPageQuery,
  siteQuery,
  skillsPageQuery,
} from '@/sanity/lib/queries'
import type {PathLookupQueryResult, ProjectSlugsQueryResult} from '@/sanity/sanity.types'

/*
 * Every word on the site comes from Studio through these loaders. Values are
 * trimmed; an empty field stays empty and the page leaves that element out.
 * There are no fallback strings here.
 */

type Raw<T> = {[K in keyof T]?: T[K] | null}

export type Link = {_key?: string; label: string; href: string}
export type Image = {url: string; alt: string; caption: string; width?: number; height?: number; hotspot?: {x: number; y: number}}
export type Seo = {title: string; description: string; shareTitle: string; shareDescription: string}
export type Role = {_key?: string; title: string; organization: string; organizationUrl: string; period: string; bullets: string[]; hideBehindSeeMore?: boolean}
export type Certification = {_key?: string; name: string; issuer: string; date: string; linkText: string; url: string}
export type SkillGroup = {_key?: string; label: string; items: string[]}
export type NavLabels = Record<SectionSlug, string>

export type Site = {
  loadError: boolean
  bigTitle: string
  name: string
  tagline: string
  footerLinks: Link[]
  newTabNote: string
  navAriaLabel: string
  notFoundTitle: string
  notFoundBody: string
  notFoundLinkLabel: string
  nav: NavLabels
  siteUrl: string
  allowIndexing: boolean
  hiddenPaths: string[]
  personSummary: string
  keywords: string[]
  author: string
  category: string
  siteName: string
  shareImage: Image | null
  shareImageAlt: string
  cardTopLine: string
  cardGreenWord: string
  cardBottomLine: string
  faviconUrl: string
  appIconLetters: string
  appName: string
  appShortName: string
  appDescription: string
  homeSeo: Seo
}

export function text(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}

function texts(value: Array<string | null> | null | undefined): string[] {
  return (value ?? []).map((item) => text(item)).filter(Boolean)
}

export function httpUrl(value: string | null | undefined): string {
  if (!value) return ''
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''
  } catch {
    return ''
  }
}

/** Same check as httpUrl, but keeps the address exactly as typed. */
function httpUrlAsTyped(value: string | null | undefined): string {
  return httpUrl(value) ? text(value) : ''
}

function safeHref(value: string | null | undefined): string {
  if (!value) return ''
  try {
    const url = new URL(value)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? url.toString() : ''
  } catch {
    return ''
  }
}

/** Site address without a trailing slash, e.g. https://jakedcl.com */
function siteUrlFrom(value: string | null | undefined): string {
  return httpUrl(value).replace(/\/+$/, '')
}

type RawImage = (Raw<{url: string; alt: string; caption: string; width: number; height: number}> & {
  hotspot?: {x?: number | null; y?: number | null} | null
}) | null | undefined

function imageFrom(raw: RawImage): Image | null {
  const url = httpUrl(raw?.url)
  if (!url) return null
  return {
    url,
    alt: text(raw?.alt),
    caption: text(raw?.caption),
    width: raw?.width ?? undefined,
    height: raw?.height ?? undefined,
    ...(typeof raw?.hotspot?.x === 'number' && typeof raw?.hotspot?.y === 'number'
      ? {hotspot: {x: raw.hotspot.x, y: raw.hotspot.y}}
      : {}),
  }
}

function imagesFrom(value: RawImage[] | null | undefined): Image[] {
  return (value ?? []).map(imageFrom).filter((image): image is Image => image !== null)
}

/** Studio page addresses are slug strings; anything odd is dropped rather than linked. */
function slugFrom(value: string | null | undefined): string {
  const slug = text(value)
  return /^[a-z0-9][a-z0-9-]*$/i.test(slug) ? slug : ''
}

function seoFrom(raw: Raw<Seo> | null | undefined): Seo {
  return {
    title: text(raw?.title),
    description: text(raw?.description),
    shareTitle: text(raw?.shareTitle),
    shareDescription: text(raw?.shareDescription),
  }
}

function richTextFrom(value: PortableTextBlock[] | null | undefined): PortableTextBlock[] {
  if (!Array.isArray(value)) return []
  return value.filter((block) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) return false
    return block.children.some(
      (child) =>
        !!child && typeof child === 'object' && 'text' in child &&
        typeof child.text === 'string' && child.text.trim().length > 0,
    )
  })
}

function linksFrom(value: Array<Raw<Link>> | null | undefined): Link[] {
  const items: Link[] = []
  for (const item of value ?? []) {
    const label = text(item.label)
    const href = safeHref(item.href)
    if (label && href) items.push({_key: item._key ?? undefined, label, href})
  }
  return items
}

function rolesFrom(
  value: Array<Raw<Omit<Role, 'hideBehindSeeMore'>> & {bullets?: Array<string | null> | null; hideBehindSeeMore?: boolean | null}> | null | undefined,
): Role[] {
  const roles: Role[] = []
  for (const role of value ?? []) {
    const title = text(role.title)
    const organization = text(role.organization)
    if (!title || !organization) continue
    roles.push({
      _key: role._key ?? undefined,
      title,
      organization,
      organizationUrl: httpUrl(role.organizationUrl),
      period: text(role.period),
      bullets: texts(role.bullets),
      ...(role.hideBehindSeeMore === true ? {hideBehindSeeMore: true} : {}),
    })
  }
  return roles
}

export const EMPTY_SEO: Seo = {title: '', description: '', shareTitle: '', shareDescription: ''}

const EMPTY_SITE: Site = {
  loadError: false,
  bigTitle: '',
  name: '',
  tagline: '',
  footerLinks: [],
  newTabNote: '',
  navAriaLabel: '',
  notFoundTitle: '',
  notFoundBody: '',
  notFoundLinkLabel: '',
  nav: {work: '', experience: '', skills: '', about: ''},
  siteUrl: '',
  allowIndexing: false,
  hiddenPaths: [],
  personSummary: '',
  keywords: [],
  author: '',
  category: '',
  siteName: '',
  shareImage: null,
  shareImageAlt: '',
  cardTopLine: '',
  cardGreenWord: '',
  cardBottomLine: '',
  faviconUrl: '',
  appIconLetters: '',
  appName: '',
  appShortName: '',
  appDescription: '',
  homeSeo: EMPTY_SEO,
}

type RawSite = {
  globals?: (Raw<Omit<Site, 'footerLinks'>> & {footerLinks?: Array<Raw<Link>> | null}) | null
  nav?: Raw<{projects?: string | null; experience?: string | null; skills?: string | null; about?: string | null}> | null
  seo?: (Raw<Omit<Site, 'shareImage' | 'hiddenPaths' | 'keywords'>> & {
    shareImage?: RawImage
    hiddenPaths?: Array<string | null> | null
    keywords?: Array<string | null> | null
  }) | null
  homeSeo?: Raw<Seo> | null
}

export async function getSite(): Promise<Site> {
  let raw: RawSite | null
  try {
    raw = await sanityFetch<RawSite | null>(siteQuery)
  } catch {
    return {...EMPTY_SITE, loadError: true}
  }
  const g = raw?.globals ?? {}
  const s = raw?.seo ?? {}
  const nav = {} as NavLabels
  const navRaw = raw?.nav
  for (const slug of SECTION_SLUGS) {
    const queryKey = slug === 'work' ? 'projects' : slug
    nav[slug] = text(navRaw?.[queryKey as keyof typeof navRaw])
  }
  return {
    loadError: false,
    bigTitle: text(g.bigTitle),
    name: text(g.name),
    tagline: text(g.tagline),
    footerLinks: linksFrom(g.footerLinks),
    newTabNote: text(g.newTabNote),
    navAriaLabel: text(g.navAriaLabel),
    notFoundTitle: text(g.notFoundTitle),
    notFoundBody: text(g.notFoundBody),
    notFoundLinkLabel: text(g.notFoundLinkLabel),
    nav,
    siteUrl: siteUrlFrom(s.siteUrl),
    allowIndexing: s.allowIndexing === true,
    hiddenPaths: texts(s.hiddenPaths).filter((p) => p.startsWith('/')),
    personSummary: text(s.personSummary),
    keywords: texts(s.keywords),
    author: text(s.author),
    category: text(s.category),
    siteName: text(s.siteName),
    shareImage: imageFrom(s.shareImage),
    shareImageAlt: text(s.shareImageAlt),
    cardTopLine: text(s.cardTopLine),
    cardGreenWord: text(s.cardGreenWord),
    cardBottomLine: text(s.cardBottomLine),
    faviconUrl: httpUrl(s.faviconUrl),
    appIconLetters: text(s.appIconLetters),
    appName: text(s.appName),
    appShortName: text(s.appShortName),
    appDescription: text(s.appDescription),
    homeSeo: seoFrom(raw?.homeSeo),
  }
}

export type FeaturedProject = {_id: string; name: string; slug: string; pitch: string; photos: Image[]}

export type Home = {
  loadError: boolean
  bio: PortableTextBlock[]
  featureLabel: string
  featured: FeaturedProject[]
}

type RawProject = {
  _id: string
  name?: string | null
  slug?: string | null
  description?: string | null
  featuredPitch?: string | null
  link?: string | null
  githubUrl?: string | null
  photos?: RawImage[] | null
  details?: PortableTextBlock[] | null
  seo?: Raw<Seo> | null
}

export async function getHome(): Promise<Home> {
  try {
    const raw = await sanityFetch<{
      bio?: PortableTextBlock[] | null
      featureLabel?: string | null
      featured?: RawProject[] | null
    } | null>(homeQuery)
    const featured: FeaturedProject[] = []
    for (const p of raw?.featured ?? []) {
      const name = text(p.name)
      const slug = slugFrom(p.slug)
      if (!name || !slug) continue
      featured.push({
        _id: p._id,
        name,
        slug,
        pitch: text(p.featuredPitch) || text(p.description),
        photos: imagesFrom(p.photos),
      })
    }
    return {
      loadError: false,
      bio: richTextFrom(raw?.bio),
      featureLabel: text(raw?.featureLabel),
      featured,
    }
  } catch {
    return {loadError: true, bio: [], featureLabel: '', featured: []}
  }
}

export type ProjectRow = {_id: string; name: string; slug: string; description: string; photos: Image[]}

export type ProjectsPage = {loadError: boolean; pageName: string; seo: Seo; projects: ProjectRow[]}

export async function getProjectsPage(): Promise<ProjectsPage> {
  try {
    const raw = await sanityFetch<{
      page?: {pageName?: string | null; seo?: Raw<Seo> | null} | null
      projects?: RawProject[] | null
    }>(projectsPageQuery)
    return {
      loadError: false,
      pageName: text(raw.page?.pageName),
      seo: seoFrom(raw.page?.seo),
      projects: (raw.projects ?? [])
        .map((p) => ({
          _id: p._id,
          name: text(p.name),
          slug: slugFrom(p.slug),
          description: text(p.description),
          photos: imagesFrom(p.photos),
        }))
        .filter((p) => p.name),
    }
  } catch {
    return {loadError: true, pageName: '', seo: EMPTY_SEO, projects: []}
  }
}

export type ProjectPageLabels = {
  pageName: string
  visitSiteLabel: string
  sourceLabel: string
  galleryAriaLabel: string
  openPhotoLabel: string
  previousPhotoLabel: string
  nextPhotoLabel: string
  closePhotoLabel: string
}

export type ProjectDetail = {
  name: string
  slug: string
  description: string
  link: string
  githubUrl: string
  photos: Image[]
  details: PortableTextBlock[]
  seo: Seo
}

export type ProjectPage = {loadError: boolean; labels: ProjectPageLabels; project: ProjectDetail | null}

const EMPTY_PROJECT_LABELS: ProjectPageLabels = {
  pageName: '',
  visitSiteLabel: '',
  sourceLabel: '',
  galleryAriaLabel: '',
  openPhotoLabel: '',
  previousPhotoLabel: '',
  nextPhotoLabel: '',
  closePhotoLabel: '',
}

export async function getProjectPage(slug: string): Promise<ProjectPage> {
  try {
    const raw = await sanityFetch<{
      page?: Raw<ProjectPageLabels> | null
      project?: RawProject | null
    }>(projectPageQuery, {slug})
    const l = raw.page ?? {}
    const labels: ProjectPageLabels = {
      pageName: text(l.pageName),
      visitSiteLabel: text(l.visitSiteLabel),
      sourceLabel: text(l.sourceLabel),
      galleryAriaLabel: text(l.galleryAriaLabel),
      openPhotoLabel: text(l.openPhotoLabel),
      previousPhotoLabel: text(l.previousPhotoLabel),
      nextPhotoLabel: text(l.nextPhotoLabel),
      closePhotoLabel: text(l.closePhotoLabel),
    }
    const p = raw.project
    const name = text(p?.name)
    const projectSlug = slugFrom(p?.slug)
    if (!p || !name || !projectSlug) return {loadError: false, labels, project: null}
    return {
      loadError: false,
      labels,
      project: {
        name,
        slug: projectSlug,
        description: text(p.description),
        link: httpUrlAsTyped(p.link),
        githubUrl: httpUrlAsTyped(p.githubUrl),
        photos: imagesFrom(p.photos),
        details: richTextFrom(p.details),
        seo: seoFrom(p.seo),
      },
    }
  } catch {
    return {loadError: true, labels: EMPTY_PROJECT_LABELS, project: null}
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  try {
    const raw = await sanityFetch<ProjectSlugsQueryResult>(projectSlugsQuery)
    return (raw ?? []).map((slug) => slugFrom(slug)).filter(Boolean)
  } catch {
    return []
  }
}

export type ExperiencePage = {
  loadError: boolean
  pageName: string
  seo: Seo
  roles: Role[]
  seeMoreLabel: string
  seeLessLabel: string
  educationHeading: string
  education: Role[]
  certificationsHeading: string
  certifications: Certification[]
}

export async function getExperiencePage(): Promise<ExperiencePage> {
  try {
    const raw = await sanityFetch<{
      pageName?: string | null
      seo?: Raw<Seo> | null
      roles?: Parameters<typeof rolesFrom>[0]
      seeMoreLabel?: string | null
      seeLessLabel?: string | null
      educationHeading?: string | null
      education?: Parameters<typeof rolesFrom>[0]
      certificationsHeading?: string | null
      certifications?: Array<Raw<{_key: string; name: string; issuer: string; date: string; credentialLinkText: string; credentialUrl: string}>> | null
    } | null>(experiencePageQuery)
    const certifications: Certification[] = []
    for (const c of raw?.certifications ?? []) {
      const name = text(c.name)
      if (!name) continue
      certifications.push({
        _key: c._key ?? undefined,
        name,
        issuer: text(c.issuer),
        date: text(c.date),
        linkText: text(c.credentialLinkText),
        url: httpUrl(c.credentialUrl),
      })
    }
    return {
      loadError: false,
      pageName: text(raw?.pageName),
      seo: seoFrom(raw?.seo),
      roles: rolesFrom(raw?.roles),
      seeMoreLabel: text(raw?.seeMoreLabel),
      seeLessLabel: text(raw?.seeLessLabel),
      educationHeading: text(raw?.educationHeading),
      education: rolesFrom(raw?.education),
      certificationsHeading: text(raw?.certificationsHeading),
      certifications,
    }
  } catch {
    return {loadError: true, pageName: '', seo: EMPTY_SEO, roles: [], seeMoreLabel: '', seeLessLabel: '', educationHeading: '', education: [], certificationsHeading: '', certifications: []}
  }
}

export type SkillsPage = {loadError: boolean; pageName: string; seo: Seo; groups: SkillGroup[]}

export async function getSkillsPage(): Promise<SkillsPage> {
  try {
    const raw = await sanityFetch<{
      pageName?: string | null
      seo?: Raw<Seo> | null
      groups?: Array<{_key?: string; label?: string | null; items?: Array<string | null> | null}> | null
    } | null>(skillsPageQuery)
    const groups: SkillGroup[] = []
    for (const group of raw?.groups ?? []) {
      const label = text(group.label)
      const items = texts(group.items)
      if (label && items.length > 0) groups.push({_key: group._key, label, items})
    }
    return {loadError: false, pageName: text(raw?.pageName), seo: seoFrom(raw?.seo), groups}
  } catch {
    return {loadError: true, pageName: '', seo: EMPTY_SEO, groups: []}
  }
}

export type AboutPage = {
  loadError: boolean
  pageName: string
  seo: Seo
  body: PortableTextBlock[]
}

export async function getAboutPage(): Promise<AboutPage> {
  try {
    const raw = await sanityFetch<{
      pageName?: string | null
      seo?: Raw<Seo> | null
      body?: PortableTextBlock[] | null
    } | null>(aboutPageQuery)
    return {
      loadError: false,
      pageName: text(raw?.pageName),
      seo: seoFrom(raw?.seo),
      body: richTextFrom(raw?.body),
    }
  } catch {
    return {loadError: true, pageName: '', seo: EMPTY_SEO, body: []}
  }
}

export type PathLookup = {
  rules: Array<{from: string; to: string; permanent: boolean}>
}

export async function getPathLookup(): Promise<PathLookup> {
  const raw = await sanityFetch<PathLookupQueryResult>(pathLookupQuery)
  return {
    rules: (raw.rules ?? [])
      .map((r) => ({from: text(r.from), to: text(r.to), permanent: r.permanent === true}))
      .filter((r) => r.from && r.to),
  }
}
