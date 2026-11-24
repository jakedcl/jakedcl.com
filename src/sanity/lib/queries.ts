import {defineQuery} from 'next-sanity'

const image = `{
  alt,
  caption,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "hotspot": hotspot{ x, y }
}`

const richText = `[]{
  _key,
  _type,
  style,
  children[]{ _key, _type, marks, text },
  markDefs[]{ _key, _type, href }
}`

const richTextWithLists = `[]{
  _key,
  _type,
  style,
  listItem,
  level,
  children[]{ _key, _type, marks, text },
  markDefs[]{ _key, _type, href }
}`

const photos = `"photos": photos[defined(asset)]${image}`

const seo = `seo{ title, description, shareTitle, shareDescription }`

/** Everything every page needs: site-wide text, menu, and search & sharing settings. */
export const siteQuery = defineQuery(`{
  "globals": *[_id == "siteGlobals"][0]{
    bigTitle, name, tagline, footerLinks[]{ _key, label, href }, newTabNote, navAriaLabel,
    notFoundTitle, notFoundBody, notFoundLinkLabel
  },
  "nav": {
    "projects": *[_id == "projectsPage"][0].pageName,
    "experience": *[_id == "experiencePage"][0].pageName,
    "skills": *[_id == "skillsPage"][0].pageName,
    "about": *[_id == "aboutPage"][0].pageName
  },
  "seo": *[_id == "seoSettings"][0]{
    siteUrl, allowIndexing, hiddenPaths, personSummary, keywords, author, category,
    siteName, "shareImage": shareImage${image}, shareImageAlt,
    cardTopLine, cardGreenWord, cardBottomLine,
    "faviconUrl": favicon.asset->url, appName, appShortName, appDescription
  },
  "homeSeo": *[_id == "homePage"][0].${seo}
}`)

export const homeQuery = defineQuery(`*[_id == "homePage"][0]{
  bio${richText},
  featureLabel,
  "featured": *[_type == "project" && featured == true && defined(slug.current)] | order(orderRank asc){
    _id,
    name,
    "slug": slug.current,
    description,
    featuredPitch,
    ${photos}
  }
}`)

export const projectsPageQuery = defineQuery(`{
  "page": *[_id == "projectsPage"][0]{ pageName, ${seo} },
  "projects": *[_type == "project"] | order(orderRank asc){
    _id,
    name,
    "slug": slug.current,
    description,
    ${photos}
  }
}`)

/** One work item's own page, plus the shared labels from the Work page. */
export const projectPageQuery = defineQuery(`{
  "page": *[_id == "projectsPage"][0]{
    pageName,
    visitSiteLabel,
    sourceLabel,
    galleryAriaLabel,
    openPhotoLabel,
    previousPhotoLabel,
    nextPhotoLabel,
    closePhotoLabel
  },
  "project": *[_type == "project" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    description,
    link,
    githubUrl,
    ${photos},
    details${richTextWithLists},
    ${seo}
  }
}`)

/** Page addresses of every project, in list order (static generation and the sitemap). */
export const projectSlugsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(orderRank asc).slug.current`)

export const experiencePageQuery = defineQuery(`*[_id == "experiencePage"][0]{
  pageName,
  roles[]{ _key, title, organization, organizationUrl, period, bullets, hideBehindSeeMore },
  seeMoreLabel,
  seeLessLabel,
  educationHeading,
  education[]{ _key, title, organization, organizationUrl, period, bullets },
  certificationsHeading,
  certifications[]{ _key, name, issuer, date, credentialLinkText, credentialUrl },
  ${seo}
}`)

export const skillsPageQuery = defineQuery(`*[_id == "skillsPage"][0]{
  pageName,
  groups[]{ _key, label, items },
  ${seo}
}`)

export const aboutPageQuery = defineQuery(`*[_id == "aboutPage"][0]{
  pageName,
  body${richText},
  ${seo}
}`)

/** Redirects from Studio > Redirects. */
export const pathLookupQuery = defineQuery(`{
  "rules": *[_id == "redirects"][0].rules[]{ from, to, permanent }
}`)
