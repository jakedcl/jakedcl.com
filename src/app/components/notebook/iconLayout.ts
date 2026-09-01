export const ICON_LAYOUT = {
  widthRem: 4.75,
  heightRem: 6,
  insetRem: 1,
  /** Corner icon size relative to the fullscreen stage (tuned for readability). */
  closedScale: 0.34,
} as const

function remPx() {
  if (typeof window === 'undefined') return 16
  return parseFloat(getComputedStyle(document.documentElement).fontSize)
}

/**
 * One motion path: corner → center, small → full.
 * Canvas stays fullscreen; CSS moves/scales the whole stage.
 */
export function notebookStageTransform(
  progress: number,
  viewport: { width: number; height: number },
) {
  const root = remPx()
  const { widthRem, heightRem, insetRem, closedScale } = ICON_LAYOUT
  const iconW = widthRem * root
  const iconH = heightRem * root
  const inset = insetRem * root
  const p = Math.min(1, Math.max(0, progress))

  const iconCenterX = viewport.width - inset - iconW / 2
  const iconCenterY = viewport.height - inset - iconH / 2
  const offsetX = iconCenterX - viewport.width / 2
  const offsetY = iconCenterY - viewport.height / 2
  const scale = closedScale + p * (1 - closedScale)

  return {
    transform: `translate(${offsetX * (1 - p)}px, ${offsetY * (1 - p)}px) scale(${scale})`,
    scale,
  }
}
