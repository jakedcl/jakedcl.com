import * as THREE from 'three'
import { PAGE_FOCUS } from './NotebookCamera'

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
const anchorScratch = new THREE.Vector3()

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

/** Corner icon → screen center on the same timeline as camera + cover open. */
export function trackingScreenPosition(
  progress: number,
  size: { width: number; height: number },
) {
  const p = THREE.MathUtils.clamp(progress, 0, 1)
  const corner = cornerScreenCenter(size)
  return {
    x: THREE.MathUtils.lerp(corner.x, size.width / 2, p),
    y: THREE.MathUtils.lerp(corner.y, size.height / 2, p),
  }
}

/** Track cover in the corner, page focus when open — matches PAGE_VIEW at progress 1. */
export function trackingAnchor(progress: number) {
  const p = THREE.MathUtils.clamp(progress, 0, 1)
  return anchorScratch.copy(COVER_CENTER).lerp(PAGE_FOCUS, p)
}

/** World offset so `anchor` projects to a screen pixel (uses live camera). */
export function worldOffsetForScreenPoint(
  camera: THREE.Camera,
  size: { width: number; height: number },
  screenX: number,
  screenY: number,
  anchor: THREE.Vector3 = COVER_CENTER,
) {
  if (size.width < 2 || size.height < 2) return { x: 0, y: 0 }

  ndc.set((screenX / size.width) * 2 - 1, -(screenY / size.height) * 2 + 1)
  raycaster.setFromCamera(ndc, camera)
  if (!raycaster.ray.intersectPlane(deskPlane, hit)) {
    return { x: 0, y: 0 }
  }
  return { x: hit.x - anchor.x, y: hit.y - anchor.y }
}

export function notebookGroupOffset(
  progress: number,
  camera: THREE.Camera,
  size: { width: number; height: number },
) {
  const screen = trackingScreenPosition(progress, size)
  const anchor = trackingAnchor(progress)
  return worldOffsetForScreenPoint(camera, size, screen.x, screen.y, anchor)
}
