import { PortableTextBlock } from 'next-sanity'

export interface SanityImage {
  _type: 'image'
  asset: {
    _id?: string
    _ref?: string
    _type?: 'reference'
    url: string
    metadata?: {
      dimensions?: {
        width: number
        height: number
        aspectRatio?: number
      }
    }
  }
  alt?: string
  caption?: string
}

export interface Project {
  _id: string
  title: PortableTextBlock[]
  photos?: SanityImage[]
  link?: string
}

export interface Settings {
  galleryPhotos?: SanityImage[]
}

