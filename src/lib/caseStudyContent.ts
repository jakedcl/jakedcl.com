import type { PortableTextBlock } from 'next-sanity'

import { projectCopy } from '@/lib/projectText'
import { SHOWCASE_PATH } from '@/lib/showcase'

import { apiVersion, dataset, projectId } from '@/sanity/env'
import { settingsQuery } from '@/sanity/lib/queries'

export type CaseStudyImage = {
  url: string
  alt: string
  caption: string
  width?: number
  height?: number
}

export type CaseStudyFact = {
  _key?: string
  label: string
  teaser: string
  detail: string
}

export type CaseStudyStep = {
  _key?: string
  title: string
  body: string
}

export type HomeFeatureSlice = {
  label: string
  name: string
  summary: string
  image: CaseStudyImage | null
  caseStudyHref: string
}

export type CaseStudyContent = {
  loadError: boolean
  visible: boolean
  name: string
  eyebrow: string
  intro: string
  gallery: CaseStudyImage[]
  facts: CaseStudyFact[]
  steps: CaseStudyStep[]
  stackNote: string
  processNote: string
  productUrl: string
  repoUrl: string
  productLinkLabel: string
  repoLinkLabel: string
}

type SanityImage = {
  alt?: string | null
  caption?: string | null
  asset?: {
    url?: string | null
    metadata?: { dimensions?: { width?: number; height?: number } | null } | null
  } | null
} | null

type SanitySettingsCaseStudy = {
  featuredProject?: {
    title?: PortableTextBlock[] | null
  } | null
  featureLabel?: string | null
  featureSummary?: string | null
  featureImage?: SanityImage
  caseStudyEyebrow?: string | null
  caseStudyIntro?: string | null
  caseStudyGallery?: SanityImage[] | null
  caseStudyFacts?: Array<{
    _key?: string
    label?: string | null
    teaser?: string | null
    detail?: string | null
  }> | null
  caseStudySteps?: Array<{
    _key?: string
    title?: string | null
    body?: string | null
  }> | null
  caseStudyStack?: string | null
  caseStudyProcess?: string | null
  caseStudyProductUrl?: string | null
  caseStudyRepoUrl?: string | null
  caseStudyProductLinkLabel?: string | null
  caseStudyRepoLinkLabel?: string | null
  siteTitle?: string | null
  metaDescription?: string | null
}

function text(value: string | null | undefined): string {
  return value?.trim() ?? ''
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

function imageFrom(raw: SanityImage): CaseStudyImage | null {
  const url = raw?.asset?.url
  if (!url) return null
  return {
    url,
    alt: text(raw?.alt),
    caption: text(raw?.caption),
    width: raw?.asset?.metadata?.dimensions?.width ?? undefined,
    height: raw?.asset?.metadata?.dimensions?.height ?? undefined,
  }
}

function imagesFrom(value: SanityImage[] | null | undefined): CaseStudyImage[] {
  const items: CaseStudyImage[] = []
  for (const raw of value ?? []) {
    const image = imageFrom(raw)
    if (image) items.push(image)
  }
  return items
}

function factsFrom(
  value: SanitySettingsCaseStudy['caseStudyFacts'],
): CaseStudyFact[] {
  const items: CaseStudyFact[] = []
  for (const fact of value ?? []) {
    const label = text(fact.label)
    const teaser = text(fact.teaser)
    const detail = text(fact.detail)
    if (!label || !teaser) continue
    items.push({ _key: fact._key, label, teaser, detail })
  }
  return items
}

function stepsFrom(
  value: SanitySettingsCaseStudy['caseStudySteps'],
): CaseStudyStep[] {
  const items: CaseStudyStep[] = []
  for (const step of value ?? []) {
    const title = text(step.title)
    const body = text(step.body)
    if (!title || !body) continue
    items.push({ _key: step._key, title, body })
  }
  return items
}

function projectNameFrom(
  project: SanitySettingsCaseStudy['featuredProject'],
): string {
  if (!project?.title) return ''
  return projectCopy(project.title).name
}

function mapCaseStudy(settings: SanitySettingsCaseStudy): CaseStudyContent {
  const name = projectNameFrom(settings.featuredProject)
  const hasProject = Boolean(settings.featuredProject && name)
  return {
    loadError: false,
    visible: hasProject,
    name,
    eyebrow: text(settings.caseStudyEyebrow),
    intro: text(settings.caseStudyIntro),
    gallery: imagesFrom(settings.caseStudyGallery),
    facts: factsFrom(settings.caseStudyFacts),
    steps: stepsFrom(settings.caseStudySteps),
    stackNote: text(settings.caseStudyStack),
    processNote: text(settings.caseStudyProcess),
    productUrl: httpUrl(settings.caseStudyProductUrl) ?? '',
    repoUrl: httpUrl(settings.caseStudyRepoUrl) ?? '',
    productLinkLabel: text(settings.caseStudyProductLinkLabel),
    repoLinkLabel: text(settings.caseStudyRepoLinkLabel),
  }
}

export function homeFeatureFrom(settings: SanitySettingsCaseStudy): HomeFeatureSlice | null {
  const name = projectNameFrom(settings.featuredProject)
  if (!settings.featuredProject || !name) return null
  const summary = text(settings.featureSummary)
  if (!summary) return null
  return {
    label: text(settings.featureLabel) || 'Featured',
    name,
    summary,
    image: imageFrom(settings.featureImage ?? null),
    caseStudyHref: SHOWCASE_PATH,
  }
}

export async function getCaseStudyContent(): Promise<CaseStudyContent> {
  try {
    const settings = await sanityQuery<SanitySettingsCaseStudy | null>(settingsQuery)
    if (!settings) return emptyCaseStudy(false)
    return mapCaseStudy(settings)
  } catch {
    return emptyCaseStudy(true)
  }
}

export async function getCaseStudyPageBundle(): Promise<{
  caseStudy: CaseStudyContent
  feature: HomeFeatureSlice | null
  siteTitle: string
  metaDescription: string
}> {
  try {
    const settings = await sanityQuery<SanitySettingsCaseStudy | null>(settingsQuery)
    if (!settings) {
      return {
        caseStudy: emptyCaseStudy(false),
        feature: null,
        siteTitle: '',
        metaDescription: '',
      }
    }
    return {
      caseStudy: mapCaseStudy(settings),
      feature: homeFeatureFrom(settings),
      siteTitle: text(settings.siteTitle),
      metaDescription: text(settings.metaDescription),
    }
  } catch {
    return {
      caseStudy: emptyCaseStudy(true),
      feature: null,
      siteTitle: '',
      metaDescription: '',
    }
  }
}

export async function getHomeFeatureSlice(): Promise<HomeFeatureSlice | null> {
  try {
    const settings = await sanityQuery<SanitySettingsCaseStudy | null>(settingsQuery)
    if (!settings) return null
    return homeFeatureFrom(settings)
  } catch {
    return null
  }
}

function emptyCaseStudy(loadError: boolean): CaseStudyContent {
  return {
    loadError,
    visible: false,
    name: '',
    eyebrow: '',
    intro: '',
    gallery: [],
    facts: [],
    steps: [],
    stackNote: '',
    processNote: '',
    productUrl: '',
    repoUrl: '',
    productLinkLabel: '',
    repoLinkLabel: '',
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
