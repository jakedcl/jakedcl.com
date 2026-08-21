import { groq } from 'next-sanity'

// Project queries
export const projectsQuery = groq`
  *[_type == "project"] | order(displayOrder asc, _createdAt desc) {
    _id,
    title,
    photos[] {
      asset-> {
        _id,
        url,
        _ref
      },
      alt,
      caption
    },
    link,
    displayOrder
  }
`

// Settings query - only fetch what's actually used
export const settingsQuery = groq`
  *[_type == "settings"][0] {
    galleryPhotos[] {
      asset-> {
        url
      },
      alt,
      caption
    },
    notebookCover {
      name,
      subject,
      email
    },
    notebookInside {
      name,
      address,
      email,
      phone,
      school,
      class
    }
  }
`
