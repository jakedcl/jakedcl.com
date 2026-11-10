import type {Metadata} from 'next'

import type {Seo, Site} from '@/lib/content'

/** The share picture for every page: the uploaded image, or the generated card. */
export function shareImages(site: Site) {
  const alt = site.shareImageAlt ? {alt: site.shareImageAlt} : {}
  if (site.shareImage) {
    return [
      {
        url: site.shareImage.url,
        ...(site.shareImage.width ? {width: site.shareImage.width} : {}),
        ...(site.shareImage.height ? {height: site.shareImage.height} : {}),
        ...alt,
      },
    ]
  }
  return [{url: '/opengraph-image', width: 1200, height: 630, ...alt}]
}

/** Title, description, canonical, and link preview for one page, straight from its Studio fields. */
export function pageMetadata(
  site: Site,
  seo: Seo,
  path: string,
  type: 'website' | 'article' = 'website',
): Metadata {
  return {
    title: seo.title || null,
    description: seo.description || null,
    alternates: {canonical: path},
    openGraph: {
      type,
      locale: 'en_US',
      ...(site.siteUrl ? {url: path === '/' ? site.siteUrl : `${site.siteUrl}${path}`} : {}),
      ...(seo.shareTitle ? {title: seo.shareTitle} : {}),
      ...(seo.shareDescription ? {description: seo.shareDescription} : {}),
      ...(site.siteName ? {siteName: site.siteName} : {}),
      images: shareImages(site),
    },
  }
}
