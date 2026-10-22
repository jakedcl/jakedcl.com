import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

import { getResumePdfUrl } from '@/lib/siteContent'

// A build-time 404 would stick until the next deploy. Look the file up on each request.
export const dynamic = 'force-dynamic'

export async function GET() {
  const remote = await getResumePdfUrl()
  if (!remote) {
    return new NextResponse(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Resume PDF is not uploaded</title></head><body style="font-family:Helvetica,sans-serif;background:#f6f3ec;color:#0a0a0a;max-width:40rem;margin:4rem auto;padding:0 1.25rem"><h1>Resume PDF is not uploaded</h1><p>Upload the file on Site Settings in Studio. <a href="/">Back to the portfolio</a></p></body></html>`,
      { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } },
    )
  }
  redirect(remote)
}
