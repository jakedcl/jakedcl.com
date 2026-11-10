import {groq} from 'next-sanity'

const image = `{
  alt,
  caption,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`

const richText = `[]{
  _key,
  _type,
  style,
  children[]{ _key, _type, marks, text },
  markDefs[]{ _key, _type, href }
}`

const seo = `seo{ title, description, shareTitle, shareDescription }`

/** Everything every page needs: site-wide text, menu, and search & sharing settings. */
export const siteQuery = groq`{
  "globals": *[_id == "siteGlobals"][0]{
    bigTitle, name, tagline, footer, newTabNote, navAriaLabel,
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
    "faviconUrl": favicon.asset->url, appIconLetters, appName, appShortName, appDescription
  },
  "homeSeo": *[_id == "homePage"][0].${seo},
  "caseStudyName": *[_id == "caseStudyPage"][0].project->name
}`

export const homeQuery = groq`*[_id == "homePage"][0]{
  bio${richText},
  links[]{ _key, label, href },
  showFeature,
  featureLabel,
  featureSentence,
  "featureImage": featureImage${image},
  featureLinkLabel
}`

export const projectsPageQuery = groq`{
  "page": *[_id == "projectsPage"][0]{ pageName, ${seo} },
  "projects": *[_type == "project"] | order(orderRank asc){
    _id,
    name,
    description,
    link,
    "photo": photos[defined(asset)][0]${image}
  }
}`

export const experiencePageQuery = groq`*[_id == "experiencePage"][0]{
  pageName,
  roles[]{ _key, title, organization, organizationUrl, period, bullets },
  certificationsHeading,
  certifications[]{ _key, name, issuer, date, credentialLinkText, credentialUrl },
  ${seo}
}`

export const skillsPageQuery = groq`*[_id == "skillsPage"][0]{
  pageName,
  groups[]{ _key, label, items },
  ${seo}
}`

export const aboutPageQuery = groq`*[_id == "aboutPage"][0]{
  pageName,
  body${richText},
  educationHeading,
  education[]{ _key, title, organization, organizationUrl, period, bullets },
  ${seo}
}`

export const caseStudyQuery = groq`*[_id == "caseStudyPage"][0]{
  "name": project->name,
  eyebrow,
  intro,
  "screenshots": screenshots[]${image},
  previousLabel,
  nextLabel,
  galleryAriaLabel,
  factsHeading,
  factsAriaLabel,
  facts[]{ _key, label, teaser, detail },
  stepsHeading,
  stepsAriaLabel,
  steps[]{ _key, title, body },
  stackHeading,
  stackNote,
  processHeading,
  processNote,
  productLink{ label, url },
  repoLink{ label, url },
  ${seo}
}`

/** Redirects from Studio, plus the project whose short link matches the first path segment. */
export const pathLookupQuery = groq`{
  "rules": *[_id == "redirects"][0].rules[]{ from, to, permanent },
  "projectLink": *[_type == "project" && slug.current == $slug][0].link
}`
