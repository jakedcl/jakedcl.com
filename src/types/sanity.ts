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
      }
    }
  }
  alt?: string
}

export interface Project {
  _id: string
  title: PortableTextBlock[]
  photos?: SanityImage[]
  link?: string
  slug?: { current?: string }
}

