import { notFound, permanentRedirect, redirect } from 'next/navigation'

import { getPathLookup } from '@/lib/content'
import { SHORT_LINK_PATTERN } from '@/lib/routes'

/**
 * Any path that is not a real page lands here. It checks, in order:
 * 1. Studio > Redirects (exact match, or a rule ending in /* that carries the rest over)
 * 2. A project short link (Studio > Projects > Short link), e.g. /logiparty
 * Otherwise it shows the 404 page. Looked up at request time (cached about 60s),
 * so Studio changes apply without a redeploy.
 */
export const revalidate = 60

function matchRule(path: string, from: string, to: string): string | null {
  if (from.endsWith('/*')) {
    const base = from.slice(0, -2)
    if (path === base) return to.endsWith('/*') ? to.slice(0, -2) || '/' : to
    if (path.startsWith(`${base}/`)) {
      const rest = path.slice(base.length + 1)
      return to.endsWith('/*') ? `${to.slice(0, -2)}/${rest}` : to
    }
    return null
  }
  return path === from ? to : null
}

export default async function PathLookup({ params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params
  const path = `/${segments.map((s) => decodeURIComponent(s)).join('/')}`
  const slug = segments.length === 1 && SHORT_LINK_PATTERN.test(segments[0]) ? segments[0] : ''
  const lookup = await getPathLookup(slug)

  for (const rule of lookup.rules) {
    const destination = matchRule(path, rule.from, rule.to)
    if (destination) {
      if (rule.permanent) permanentRedirect(destination)
      redirect(destination)
    }
  }

  if (slug && lookup.projectLink) redirect(lookup.projectLink)
  notFound()
}
