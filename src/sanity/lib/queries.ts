import { groq } from 'next-sanity'

// Project queries
export const projectsQuery = groq`
  *[_type == "project"] | order(displayOrder asc, _createdAt desc) {
    _id,
    title,
    photos[] {
      asset-> {
        url
      },
      alt,
      caption
    },
    link,
    displayOrder
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && _id == $id][0] {
    _id,
    title,
    photos
  }
`

// Post/Essay queries
export const postsQuery = groq`
  *[_type == "post" && published == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    tags,
    publishedAt
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && published == true][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    tags,
    publishedAt
  }
`

// Settings query
export const settingsQuery = groq`
  *[_type == "settings"][0] {
    title,
    tagline,
    bio,
    profileImage,
    email,
    social,
    seo,
    featuredProjects[]-> {
      _id,
      title,
      slug,
      category,
      description,
      featuredImage,
      technologies,
      liveUrl,
      publishedAt
    },
    resume,
    galleryPhotos[] {
      asset-> {
        url
      },
      alt,
      caption
    }
  }
`

// Navigation/menu queries
export const projectCategoriesQuery = groq`
  *[_type == "project"] | order(category asc) {
    "category": category
  } | {
    "categories": array::unique(category)
  }
`

