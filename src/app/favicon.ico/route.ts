import { getSite } from '@/lib/content'
import { faviconUrl } from '@/lib/favicon'

// Must run per request: a cached redirect response is served as an empty file on Vercel.
export const dynamic = 'force-dynamic'

// Browsers ask for /favicon.ico on their own; send them to the favicon uploaded in Studio.
export async function GET() {
  const site = await getSite()
  if (!site.faviconUrl) return new Response(null, { status: 404 })
  return Response.redirect(faviconUrl(site.faviconUrl), 307)
}
