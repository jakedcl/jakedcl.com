import * as THREE from 'three'

/** Corner hit-target size (matches the closed icon footprint). */
export const NOTEBOOK_STAGE = {
  canvasWidthRem: 9,
  canvasHeightRem: 10,
  insetRem: 0.5,
} as const

export const COVER_CENTER = new THREE.Vector3(0.26, 0.07, 0)

const raycaster = new THREE.Raycaster()
const ndc = new THREE.Vector2()
const hit = new THREE.Vector3()
const deskPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -COVER_CENTER.y)

function remPx() {
  if (typeof window === 'undefined') return 16
  return parseFloat(getComputedStyle(document.documentElement).fontSize)
}

/** Screen pixel at the center of the closed corner icon. */
export function cornerScreenCenter(size: { width: number; height: number }) {
  const root = remPx()
  const { canvasWidthRem, canvasHeightRem, insetRem } = NOTEBOOK_STAGE
  return {
    x: size.width - (insetRem + canvasWidthRem / 2) * root,
    y: size.height - (insetRem + canvasHeightRem / 2) * root,
  }
}

/** World offset so the cover center projects to a screen pixel (uses live camera). */
export function worldOffsetForScreenPoint(
  camera: THREE.Camera,
  size: { width: number; height: number },
  screenX: number,
  screenY: number,
) {
  if (size.width < 2 || size.height < 2) return { x: 0, y: 0 }

  ndc.set((screenX / size.width) * 2 - 1, -(screenY / size.height) * 2 + 1)
  raycaster.setFromCamera(ndc, camera)
  if (!raycaster.ray.intersectPlane(deskPlane, hit)) {
    return { x: 0, y: 0 }
  }
  return { x: hit.x - COVER_CENTER.x, y: hit.y - COVER_CENTER.y }
}

/**
 * Corner → centered page. At progress 1 the group sits at origin so PAGE_VIEW
 * frames the resume page — no overshoot to screen edges.
 */
export function notebookGroupOffset(
  progress: number,
  camera: THREE.Camera,
  size: { width: number; height: number },
) {
  const p = THREE.MathUtils.clamp(progress, 0, 1)
  if (p <= 0) {
    const corner = cornerScreenCenter(size)
    return worldOffsetForScreenPoint(camera, size, corner.x, corner.y)
  }
  if (p >= 1) return { x: 0, y: 0 }

  const corner = cornerScreenCenter(size)
  const offset = worldOffsetForScreenPoint(camera, size, corner.x, corner.y)
  const k = 1 - p
  return { x: offset.x * k, y: offset.y * k }
}
