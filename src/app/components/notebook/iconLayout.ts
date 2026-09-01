import * as THREE from 'three'

/** Cover center when the floating group is at origin — matches NotebookCamera focus. */
export const COVER_CENTER = new THREE.Vector3(0.26, 0.07, 0)

export const ICON_LAYOUT = {
  widthRem: 3.25,
  heightRem: 4,
  insetRem: 0.625,
} as const

const raycaster = new THREE.Raycaster()
const ndc = new THREE.Vector2()
const hit = new THREE.Vector3()
const deskPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -COVER_CENTER.y)

function rootFontPx() {
  if (typeof window === 'undefined') return 16
  return parseFloat(getComputedStyle(document.documentElement).fontSize)
}

/** Offset from rest pose so the cover center lands on the bottom-right hit target. */
export function cornerOffsetForCamera(
  camera: THREE.Camera,
  size: { width: number; height: number },
) {
  const rootPx = rootFontPx()
  const { widthRem, heightRem, insetRem } = ICON_LAYOUT
  const screenX = size.width - (insetRem + widthRem / 2) * rootPx
  const screenY = size.height - (insetRem + heightRem / 2) * rootPx

  ndc.set((screenX / size.width) * 2 - 1, -(screenY / size.height) * 2 + 1)
  raycaster.setFromCamera(ndc, camera)
  if (!raycaster.ray.intersectPlane(deskPlane, hit)) {
    return { x: 0, y: 0 }
  }

  return {
    x: hit.x - COVER_CENTER.x,
    y: hit.y - COVER_CENTER.y,
  }
}
