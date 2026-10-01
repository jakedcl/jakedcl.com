import { groq } from 'next-sanity'

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

// Settings query - only fetch what's actually used
export const settingsQuery = groq`
  *[_type == "settings"][0] {
    galleryPhotos[] {
      asset-> {
        url,
        metadata { dimensions }
      },
      alt,
      caption
    }
  }
`

