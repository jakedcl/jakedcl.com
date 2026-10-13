import { groq } from 'next-sanity'

// Project queries
export const projectsQuery = groq`
  *[_type == "project"] | order(displayOrder asc, _createdAt desc) {
    _id,
    title,
    stack,
    link,
    screenshots[] {
      _key,
      alt,
      hotspot,
      crop,
      asset-> {
        _id,
        url,
        metadata { lqip, dimensions }
      }
    }
  }
`

export const galleryQuery = groq`
  *[_type == "settings"][0] {
    galleryPhotos[] {
      _key,
      alt,
      caption,
      hotspot,
      crop,
      asset-> {
        _id,
        url,
        metadata { lqip, dimensions }
      }
    }
  }
`


