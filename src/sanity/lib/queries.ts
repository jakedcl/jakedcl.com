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
    legalName,
    tagline,
    summary,
    bio[]{ _key, text },
    links[]{ _key, label, href },
    "resumeUrl": resumeFile.asset->url,
    skills[]{ _key, label, items },
    experience[]{ _key, title, organization, organizationUrl, period, bullets },
    education[]{ _key, title, organization, organizationUrl, period, bullets },
    certifications[]{ _key, title, organization, organizationUrl, period, bullets }
  }
`

export const resumeFileQuery = groq`
  ${settingsFilter}{
    "resumeUrl": resumeFile.asset->url
  }
`


