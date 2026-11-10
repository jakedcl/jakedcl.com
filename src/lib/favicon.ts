/** The Studio favicon as a 32×32 PNG from Sanity's image CDN. */
export function faviconUrl(assetUrl: string): string {
  const url = new URL(assetUrl)
  url.searchParams.set('w', '32')
  url.searchParams.set('h', '32')
  url.searchParams.set('fit', 'crop')
  url.searchParams.set('fm', 'png')
  return url.toString()
}
