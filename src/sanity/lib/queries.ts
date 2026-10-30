import { groq } from 'next-sanity'

import { SETTINGS_ID } from './settingsId'

// Project queries
export const projectsQuery = groq`
  *[_type == "project"] | order(displayOrder asc, _createdAt desc) {
    _id,
    title,
    photos[] {
      alt,
      asset-> {
        _id,
        url,
        metadata { dimensions }
      }
    },
    link
  }
`

export const projectLinkBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    link
  }
`

const settingsFilter = `*[_id == "${SETTINGS_ID}"][0]`

export const settingsQuery = groq`
  ${settingsFilter}{
    heroTitle,
    legalName,
    tagline,
    summary,
    bio[]{
      _key,
      _type,
      style,
      children[]{
        _key,
        _type,
        marks,
        text
      },
      markDefs[]{
        _key,
        _type,
        href
      }
    },
    links[]{ _key, label, href },
    skills[]{ _key, label, items },
    experience[]{ _key, title, organization, organizationUrl, period, bullets },
    education[]{ _key, title, organization, organizationUrl, period, bullets },
    certifications[]{ _key, title, organization, organizationUrl, period, bullets },
    projectsHeading,
    experienceHeading,
    educationHeading,
    skillsHeading,
    certificationsHeading,
    footerText,
    siteTitle,
    metaDescription,
    keywords,
    authorName,
    metaCategory,
    ogTitle,
    ogDescription,
    ogSiteName,
    "ogImageUrl": ogImage.asset->url,
    "ogImageWidth": ogImage.asset->metadata.dimensions.width,
    "ogImageHeight": ogImage.asset->metadata.dimensions.height,
    ogImageAlt,
    ogCardKicker,
    ogCardStatus,
    ogCardFooter,
    appIconText,
    appName,
    appShortName,
    appDescription,
    notFoundTitle,
    notFoundBody,
    notFoundLinkLabel
  }
`


