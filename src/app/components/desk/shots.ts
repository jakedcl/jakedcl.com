import type { ShotName } from './types'

export type Shot = {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}

export const shots: Record<ShotName, Shot> = {
  intro: {
    position: [2.55, 3.9, 4.35],
    target: [0.45, 0.08, 0.05],
    fov: 36,
  },
  cover: {
    position: [0.72, 2.05, 1.72],
    target: [0.74, 0.07, 0.02],
    fov: 30,
  },
  page: {
    position: [0.84, 2.48, 0.05],
    target: [0.84, 0.05, 0],
    fov: 26,
  },
  desk: {
    position: [0.35, 4.7, 5.15],
    target: [0.25, 0, 0.12],
    fov: 38,
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
