/** Bias camera/cover toward page view early so opening reads during the move, not after. */
export const motionT = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return 1 - (1 - x) ** 1.65
}
