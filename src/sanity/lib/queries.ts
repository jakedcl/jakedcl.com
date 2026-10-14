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


