import type {Image} from '@/lib/content'

/** Studio hotspot as a CSS object-position, so cropped thumbnails keep the chosen focus. */
export function photoPosition(image: Image): string | undefined {
  if (!image.hotspot) return undefined
  const pct = (value: number) => `${Math.round(Math.min(1, Math.max(0, value)) * 1000) / 10}%`
  return `${pct(image.hotspot.x)} ${pct(image.hotspot.y)}`
}
