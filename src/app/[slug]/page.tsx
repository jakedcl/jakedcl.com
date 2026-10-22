import { notFound, redirect } from 'next/navigation'

import { apiVersion, dataset, projectId } from '@/sanity/env'
import { projectLinkBySlugQuery } from '@/sanity/lib/queries'

export const revalidate = 60

/** Single path segment. Dots would catch files such as resume.pdf. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Real routes this segment must not replace. Static files and more specific
 * app routes already win; this is a second check if a document uses one.
 */
const RESERVED = new Set(['studio', 'resume', 'apple-icon', 'opengraph-image'])

export default async function ProjectShortLink({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!SLUG.test(slug) || RESERVED.has(slug)) notFound()

  const destination = await projectLink(slug)
  if (!destination) notFound()
  redirect(destination)
}

async function projectLink(slug: string): Promise<string | null> {
  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  )
  url.searchParams.set('query', projectLinkBySlugQuery)
  url.searchParams.set('$slug', JSON.stringify(slug))

  const response = await fetch(url, { next: { revalidate: 60 } })
  if (!response.ok) {
    throw new Error('Could not look up that short link.')
  }

  const body = (await response.json()) as {
    result?: { link?: string | null } | null
  }
  return httpUrl(body.result?.link)
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
