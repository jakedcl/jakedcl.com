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

export interface Project {
  _id: string
  title: PortableTextBlock[]
  photos?: SanityImage[]
  link?: string
  displayOrder?: number
}

export interface Settings {
  bioText?: PortableTextBlock[]
  galleryPhotos?: SanityImage[]
}

