import type {PortableTextBlock} from 'next-sanity'

import {type SectionSlug, SECTION_SLUGS} from '@/lib/routes'
import {sanityFetch} from '@/sanity/lib/fetch'
import {
  aboutPageQuery,
  caseStudyQuery,
  experiencePageQuery,
  homeQuery,
  pathLookupQuery,
  projectsPageQuery,
  siteQuery,
  skillsPageQuery,
} from '@/sanity/lib/queries'

/*
 * Every word on the site comes from Studio through these loaders. Values are
 * trimmed; an empty field stays empty and the page leaves that element out.
 * There are no fallback strings here.
 */

type Raw<T> = {[K in keyof T]?: T[K] | null}

export type Link = {_key?: string; label: string; href: string}
export type Image = {url: string; alt: string; caption: string; width?: number; height?: number}
export type Seo = {title: string; description: string; shareTitle: string; shareDescription: string}
export type Role = {_key?: string; title: string; organization: string; organizationUrl: string; period: string; bullets: string[]}
export type Certification = {_key?: string; name: string; issuer: string; date: string; linkText: string; url: string}
export type SkillGroup = {_key?: string; label: string; items: string[]}
export type NavLabels = Record<SectionSlug, string>

export type Site = {
  loadError: boolean
  bigTitle: string
  name: string
  tagline: string
  footer: string
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
  caseStudyName: string
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

type RawImage = Raw<{url: string; alt: string; caption: string; width: number; height: number}> | null | undefined

function imageFrom(raw: RawImage): Image | null {
  const url = httpUrl(raw?.url)
  if (!url) return null
  return {
    url,
    alt: text(raw?.alt),
    caption: text(raw?.caption),
    width: raw?.width ?? undefined,
    height: raw?.height ?? undefined,
  }
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

function rolesFrom(value: Array<Raw<Role> & {bullets?: Array<string | null> | null}> | null | undefined): Role[] {
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
  footer: '',
  newTabNote: '',
  navAriaLabel: '',
  notFoundTitle: '',
  notFoundBody: '',
  notFoundLinkLabel: '',
  nav: {projects: '', experience: '', skills: '', about: ''},
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
  caseStudyName: '',
}

type RawSite = {
  globals?: Raw<Site> | null
  nav?: Raw<NavLabels> | null
  seo?: (Raw<Omit<Site, 'shareImage' | 'hiddenPaths' | 'keywords'>> & {
    shareImage?: RawImage
    hiddenPaths?: Array<string | null> | null
    keywords?: Array<string | null> | null
  }) | null
  homeSeo?: Raw<Seo> | null
  caseStudyName?: string | null
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
  for (const slug of SECTION_SLUGS) nav[slug] = text(raw?.nav?.[slug])
  return {
    loadError: false,
    bigTitle: text(g.bigTitle),
    name: text(g.name),
    tagline: text(g.tagline),
    footer: text(g.footer),
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
    caseStudyName: text(raw?.caseStudyName),
  }
}

export type Home = {
  loadError: boolean
  bio: PortableTextBlock[]
  links: Link[]
  showFeature: boolean
  featureLabel: string
  featureSentence: string
  featureImage: Image | null
  featureLinkLabel: string
}

export async function getHome(): Promise<Home> {
  try {
    const raw = await sanityFetch<
      | (Raw<Omit<Home, 'featureImage' | 'links' | 'bio'>> & {
          bio?: PortableTextBlock[] | null
          links?: Array<Raw<Link>> | null
          featureImage?: RawImage
        })
      | null
    >(homeQuery)
    return {
      loadError: false,
      bio: richTextFrom(raw?.bio),
      links: linksFrom(raw?.links),
      showFeature: raw?.showFeature === true,
      featureLabel: text(raw?.featureLabel),
      featureSentence: text(raw?.featureSentence),
      featureImage: imageFrom(raw?.featureImage),
      featureLinkLabel: text(raw?.featureLinkLabel),
    }
  } catch {
    return {
      loadError: true,
      bio: [],
      links: [],
      showFeature: false,
      featureLabel: '',
      featureSentence: '',
      featureImage: null,
      featureLinkLabel: '',
    }
  }
}

export type ProjectRow = {_id: string; name: string; description: string; link: string; photo: Image | null}

export type ProjectsPage = {loadError: boolean; pageName: string; seo: Seo; projects: ProjectRow[]}

export async function getProjectsPage(): Promise<ProjectsPage> {
  try {
    const raw = await sanityFetch<{
      page?: {pageName?: string | null; seo?: Raw<Seo> | null} | null
      projects?: Array<{_id: string; name?: string | null; description?: string | null; link?: string | null; photo?: RawImage}> | null
    }>(projectsPageQuery)
    return {
      loadError: false,
      pageName: text(raw.page?.pageName),
      seo: seoFrom(raw.page?.seo),
      projects: (raw.projects ?? [])
        .map((p) => ({
          _id: p._id,
          name: text(p.name),
          description: text(p.description),
          link: httpUrlAsTyped(p.link),
          photo: imageFrom(p.photo),
        }))
        .filter((p) => p.name),
    }
  } catch {
    return {loadError: true, pageName: '', seo: EMPTY_SEO, projects: []}
  }
}

export type ExperiencePage = {
  loadError: boolean
  pageName: string
  seo: Seo
  roles: Role[]
  certificationsHeading: string
  certifications: Certification[]
}

export async function getExperiencePage(): Promise<ExperiencePage> {
  try {
    const raw = await sanityFetch<{
      pageName?: string | null
      seo?: Raw<Seo> | null
      roles?: Parameters<typeof rolesFrom>[0]
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
      certificationsHeading: text(raw?.certificationsHeading),
      certifications,
    }
  } catch {
    return {loadError: true, pageName: '', seo: EMPTY_SEO, roles: [], certificationsHeading: '', certifications: []}
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
  educationHeading: string
  education: Role[]
}

export async function getAboutPage(): Promise<AboutPage> {
  try {
    const raw = await sanityFetch<{
      pageName?: string | null
      seo?: Raw<Seo> | null
      body?: PortableTextBlock[] | null
      educationHeading?: string | null
      education?: Parameters<typeof rolesFrom>[0]
    } | null>(aboutPageQuery)
    return {
      loadError: false,
      pageName: text(raw?.pageName),
      seo: seoFrom(raw?.seo),
      body: richTextFrom(raw?.body),
      educationHeading: text(raw?.educationHeading),
      education: rolesFrom(raw?.education),
    }
  } catch {
    return {loadError: true, pageName: '', seo: EMPTY_SEO, body: [], educationHeading: '', education: []}
  }
}

export type CaseStudyFact = {_key?: string; label: string; teaser: string; detail: string}
export type CaseStudyStep = {_key?: string; title: string; body: string}
export type LabeledLink = {label: string; url: string}

export type CaseStudy = {
  loadError: boolean
  name: string
  eyebrow: string
  intro: string
  screenshots: Image[]
  previousLabel: string
  nextLabel: string
  galleryAriaLabel: string
  factsHeading: string
  factsAriaLabel: string
  facts: CaseStudyFact[]
  stepsHeading: string
  stepsAriaLabel: string
  steps: CaseStudyStep[]
  stackHeading: string
  stackNote: string
  processHeading: string
  processNote: string
  productLink: LabeledLink | null
  repoLink: LabeledLink | null
  seo: Seo
}

function labeledLinkFrom(raw: {label?: string | null; url?: string | null} | null | undefined): LabeledLink | null {
  const label = text(raw?.label)
  const url = httpUrl(raw?.url)
  return label && url ? {label, url} : null
}

const EMPTY_CASE_STUDY: CaseStudy = {
  loadError: false,
  name: '',
  eyebrow: '',
  intro: '',
  screenshots: [],
  previousLabel: '',
  nextLabel: '',
  galleryAriaLabel: '',
  factsHeading: '',
  factsAriaLabel: '',
  facts: [],
  stepsHeading: '',
  stepsAriaLabel: '',
  steps: [],
  stackHeading: '',
  stackNote: '',
  processHeading: '',
  processNote: '',
  productLink: null,
  repoLink: null,
  seo: EMPTY_SEO,
}

export async function getCaseStudy(): Promise<CaseStudy> {
  type RawCaseStudy = Raw<Omit<CaseStudy, 'screenshots' | 'facts' | 'steps' | 'productLink' | 'repoLink' | 'seo'>> & {
    screenshots?: RawImage[] | null
    facts?: Array<Raw<CaseStudyFact>> | null
    steps?: Array<Raw<CaseStudyStep>> | null
    productLink?: {label?: string | null; url?: string | null} | null
    repoLink?: {label?: string | null; url?: string | null} | null
    seo?: Raw<Seo> | null
  }
  let raw: RawCaseStudy | null
  try {
    raw = await sanityFetch<RawCaseStudy | null>(caseStudyQuery)
  } catch {
    return {...EMPTY_CASE_STUDY, loadError: true}
  }
  if (!raw) return EMPTY_CASE_STUDY
  const facts: CaseStudyFact[] = []
  for (const fact of raw.facts ?? []) {
    const label = text(fact.label)
    const teaser = text(fact.teaser)
    if (label && teaser) facts.push({_key: fact._key ?? undefined, label, teaser, detail: text(fact.detail)})
  }
  const steps: CaseStudyStep[] = []
  for (const step of raw.steps ?? []) {
    const title = text(step.title)
    const body = text(step.body)
    if (title && body) steps.push({_key: step._key ?? undefined, title, body})
  }
  return {
    loadError: false,
    name: text(raw.name),
    eyebrow: text(raw.eyebrow),
    intro: text(raw.intro),
    screenshots: (raw.screenshots ?? []).map(imageFrom).filter((i): i is Image => i !== null),
    previousLabel: text(raw.previousLabel),
    nextLabel: text(raw.nextLabel),
    galleryAriaLabel: text(raw.galleryAriaLabel),
    factsHeading: text(raw.factsHeading),
    factsAriaLabel: text(raw.factsAriaLabel),
    facts,
    stepsHeading: text(raw.stepsHeading),
    stepsAriaLabel: text(raw.stepsAriaLabel),
    steps,
    stackHeading: text(raw.stackHeading),
    stackNote: text(raw.stackNote),
    processHeading: text(raw.processHeading),
    processNote: text(raw.processNote),
    productLink: labeledLinkFrom(raw.productLink),
    repoLink: labeledLinkFrom(raw.repoLink),
    seo: seoFrom(raw.seo),
  }
}

export type PathLookup = {
  rules: Array<{from: string; to: string; permanent: boolean}>
  projectLink: string
}

export async function getPathLookup(slug: string): Promise<PathLookup> {
  const raw = await sanityFetch<{
    rules?: Array<{from?: string | null; to?: string | null; permanent?: boolean | null}> | null
    projectLink?: string | null
  }>(pathLookupQuery, {slug})
  return {
    rules: (raw.rules ?? [])
      .map((r) => ({from: text(r.from), to: text(r.to), permanent: r.permanent === true}))
      .filter((r) => r.from && r.to),
    projectLink: httpUrl(raw.projectLink),
  }
}
