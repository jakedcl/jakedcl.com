'use client'

import Image, { type ImageProps } from 'next/image'

import sanityImageLoader from '@/lib/sanityImageLoader'

type SanityImageProps = Omit<ImageProps, 'loader' | 'src'> & {
  src: string
}

export default function SanityImage({ src, alt, ...props }: SanityImageProps) {
  return <Image {...props} src={src} alt={alt} loader={sanityImageLoader} />
}
