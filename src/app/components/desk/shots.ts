import type { ShotName } from './types'

export type Shot = {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
  duration?: number
}

// Closed notebook cover center after the leftward shift (hinge at x = -0.5, width 1.52).
const NOTEBOOK_FOCUS: [number, number, number] = [0.26, 0.07, 0]
// Open page mesh center (local x = width/2+0.02, then group x = -0.5).
const PAGE_FOCUS: [number, number, number] = [0.28, 0.05, 0]

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
    // Close reading pose over the open spread — not the intro aerial.
    position: [PAGE_FOCUS[0], 1.32, 1.18],
    target: PAGE_FOCUS,
    fov: 32,
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
