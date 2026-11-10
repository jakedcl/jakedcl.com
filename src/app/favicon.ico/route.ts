import { getSite } from '@/lib/content'
import { faviconUrl } from '@/lib/favicon'

export const revalidate = 60

// Browsers ask for /favicon.ico on their own; send them to the favicon uploaded in Studio.
export async function GET() {
  const site = await getSite()
  if (!site.faviconUrl) return new Response(null, { status: 404 })
  return Response.redirect(faviconUrl(site.faviconUrl), 307)
}
