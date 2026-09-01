/** Hit target + closed visual scale for the corner icon. */
export const NOTEBOOK_STAGE = {
  hitWidthRem: 4.5,
  hitHeightRem: 5.5,
  insetRem: 0.75,
  closedScale: 0.36,
} as const

function remPx() {
  if (typeof window === 'undefined') return 16
  return parseFloat(getComputedStyle(document.documentElement).fontSize)
}

/** Corner → center, small → full. One transform for the fullscreen stage. */
export function stageTransform(progress: number, viewport: { width: number; height: number }) {
  const root = remPx()
  const { hitWidthRem, hitHeightRem, insetRem, closedScale } = NOTEBOOK_STAGE
  const p = Math.min(1, Math.max(0, progress))

  const iconW = hitWidthRem * root
  const iconH = hitHeightRem * root
  const inset = insetRem * root
  const iconCenterX = viewport.width - inset - iconW / 2
  const iconCenterY = viewport.height - inset - iconH / 2
  const offsetX = iconCenterX - viewport.width / 2
  const offsetY = iconCenterY - viewport.height / 2
  const scale = closedScale + p * (1 - closedScale)

  return `translate(${offsetX * (1 - p)}px, ${offsetY * (1 - p)}px) scale(${scale})`
}
