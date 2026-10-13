import { PortableTextBlock } from 'next-sanity'

export interface SanityImage {
  _type?: 'image'
  _key?: string
  asset?: {
    _id?: string
    _ref?: string
    _type?: 'reference'
    url: string
    metadata?: {
      lqip?: string
      dimensions?: {
        width: number
        height: number
        aspectRatio?: number
      }
    }
  }
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface Project {
  _id: string
  title: PortableTextBlock[]
  /** Tools shown on the filmstrip text frame. Empty until filled in Studio. */
  stack?: string[]
  screenshots?: SanityImage[]
  link?: string
}

export interface Settings {
  galleryPhotos?: SanityImage[]
}

