/** Shared progress — one curve for container, camera, and cover. */
export const motionT = (t: number) => Math.min(1, Math.max(0, t))
