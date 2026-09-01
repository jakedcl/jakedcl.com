export const ICON_LAYOUT = {
  widthRem: 4.25,
  heightRem: 5.5,
  insetRem: 1.25,
} as const

/** Match the transparent corner hit target in screen space → world units. */
export function cornerCenterWorld(
  viewport: { width: number; height: number },
  size: { width: number; height: number },
) {
  const rootPx =
    typeof window !== 'undefined'
      ? parseFloat(getComputedStyle(document.documentElement).fontSize)
      : 16

  const { widthRem, heightRem, insetRem } = ICON_LAYOUT
  const centerFromRightPx = (insetRem + widthRem / 2) * rootPx
  const centerFromBottomPx = (insetRem + heightRem / 2) * rootPx

  const centerFromLeftPx = size.width - centerFromRightPx
  const centerFromTopPx = size.height - centerFromBottomPx

  return {
    x: (centerFromLeftPx / size.width - 0.5) * viewport.width,
    y: (0.5 - centerFromTopPx / size.height) * viewport.height,
  }
}
