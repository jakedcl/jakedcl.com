/** Corner canvas size — oversized on purpose so WebGL doesn't clip the mesh. */
export const NOTEBOOK_STAGE = {
  canvasWidthRem: 9,
  canvasHeightRem: 10,
  insetRem: 0.5,
} as const

/** Box grows first; camera + cover follow after ~35% so mid-animation isn't chaotic. */
export function motionProgress(progress: number) {
  const p = Math.min(1, Math.max(0, progress))
  const growEnd = 0.35
  if (p <= growEnd) return 0
  return (p - growEnd) / (1 - growEnd)
}
