import type { ShotName } from './types'

export type Shot = {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
  duration?: number
}

// Closed notebook cover center after the leftward shift (hinge at x = -0.5, width 1.52).
const NOTEBOOK_FOCUS: [number, number, number] = [0.26, 0.07, 0]
// Open page center (local PAGE_CENTER_X ≈ 0.805, then group x = -0.5).
const PAGE_FOCUS: [number, number, number] = [0.305, 0.05, 0]

/** Page overhead knobs — open notebook nearly fills frame; thin desk rim only. */
export const PAGE_CAM = {
  y: 3.22,
  z: 0.5,
  fov: 27,
} as const

/**
 * Slight aspect framing so the open book keeps similar coverage on wide vs tall viewports.
 * Wider than 16:9 → nudge closer; taller → pull back a little.
 */
export function pageCameraForAspect(aspect: number): {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
} {
  const ref = 16 / 9
  const pull = Math.min(1.16, Math.max(0.92, Math.sqrt(ref / Math.max(aspect, 0.5))))
  return {
    position: [PAGE_FOCUS[0], PAGE_CAM.y * pull, PAGE_CAM.z * pull],
    target: [PAGE_FOCUS[0], 0.02, 0.02],
    fov: PAGE_CAM.fov * (0.98 + (pull - 1) * 0.4),
  }
}

export const shots: Record<ShotName, Shot> = {
  intro: {
    // Low, slightly oblique approach — start of the swoop, not a held pose.
    position: [2.05, 1.18, 3.95],
    target: [NOTEBOOK_FOCUS[0], 0.18, 0.12],
    fov: 40,
  },
  cover: {
    position: [NOTEBOOK_FOCUS[0], 1.95, 1.38],
    target: NOTEBOOK_FOCUS,
    fov: 28,
    duration: 2.4,
  },
  aerial: {
    // High +Y, nearly top-down over the closed book (tiny +Z keeps lookAt stable).
    position: [NOTEBOOK_FOCUS[0], 4.55, 0.68],
    target: NOTEBOOK_FOCUS,
    fov: 32,
    duration: 2.7,
  },
  page: {
    // Homepage resting shot: open looseleaf nearly fills the viewport.
    // Aspect tweaks live in pageCameraForAspect (used by CameraRig).
    position: [PAGE_FOCUS[0], PAGE_CAM.y, PAGE_CAM.z],
    target: [PAGE_FOCUS[0], 0.02, 0.02],
    fov: PAGE_CAM.fov,
    duration: 2.35,
  },
  desk: {
    position: [0.35, 4.7, 5.15],
    target: [0.25, 0, 0.12],
    fov: 38,
    duration: 2.45,
  },
  projects: {
    position: [-1.55, 2.25, 2.35],
    target: [-1.45, 0.1, 0.7],
    fov: 32,
  },
  gallery: {
    position: [2.2, 2.1, 1.4],
    target: [1.85, 0.06, -0.55],
    fov: 32,
  },
  contact: {
    position: [1.9, 1.85, 2.4],
    target: [1.55, 0.16, 1.18],
    fov: 30,
  },
}

export const ORBIT_SHOTS: ShotName[] = ['desk', 'projects', 'gallery', 'contact']
