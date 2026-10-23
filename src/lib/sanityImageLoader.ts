import type { ImageLoader } from 'next/image'

// Per-image next/image loader for Sanity URLs. Applied on SanityImage only.
// Sanity's CDN resizes for free; local /public assets keep the default optimizer.
const sanityImageLoader: ImageLoader = ({ src, width, quality }) => {
  if (!src.startsWith('https://cdn.sanity.io/')) return src

  const url = new URL(src)
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality || url.searchParams.get('q') || 75))
  if (!url.searchParams.has('fit')) url.searchParams.set('fit', 'max')
  if (!url.searchParams.has('auto')) url.searchParams.set('auto', 'format')
  return url.toString()
}

export default sanityImageLoader
