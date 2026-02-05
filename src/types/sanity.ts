import { PortableTextBlock } from 'next-sanity'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    url: string
  }
  alt?: string
  caption?: string
}

export interface SanityFile {
  _type: 'file'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export interface Project {
  _id: string
  title: PortableTextBlock[]
  photos?: SanityImage[]
  link?: string
  displayOrder?: number
}

export interface Post {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  content: PortableTextBlock[]
  featuredImage?: SanityImage
  tags?: string[]
  published: boolean
  publishedAt: string
}

export interface Settings {
  title: string
  tagline?: string
  bio?: PortableTextBlock[]
  profileImage?: SanityImage
  email?: string
  social?: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    youtube?: string
    website?: string
  }
  seo?: {
    metaDescription?: string
    ogImage?: SanityImage
    keywords?: string[]
  }
  featuredProjects?: Project[]
  resume?: SanityFile
  galleryPhotos?: SanityImage[]
}

export interface CodeBlock {
  _type: 'codeBlock'
  language?: string
  code: string
}

// Extended PortableText types
export type CustomPortableTextBlock = PortableTextBlock | SanityImage | CodeBlock

