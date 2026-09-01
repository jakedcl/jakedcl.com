import * as THREE from 'three'

/** Corner canvas size — oversized on purpose so WebGL doesn't clip the mesh. */
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

/** Reveal corner → fullscreen without resizing the WebGL canvas. */
export function cornerClipPath(progress: number): string {
  const p = Math.min(1, Math.max(0, progress))
  const { canvasWidthRem, canvasHeightRem, insetRem } = NOTEBOOK_STAGE
  const k = 1 - p
  const top = `calc((100dvh - ${canvasHeightRem}rem - ${insetRem}rem) * ${k})`
  const left = `calc((100vw - ${canvasWidthRem}rem - ${insetRem}rem) * ${k})`
  const bottom = `calc(${insetRem}rem * ${k})`
  const right = `calc(${insetRem}rem * ${k})`
  return `inset(${top} ${right} ${bottom} ${left})`
}

/** Where the cover should sit on screen for this progress (corner → center). */
export function coverScreenPosition(
  progress: number,
  size: { width: number; height: number },
) {
  const p = Math.min(1, Math.max(0, progress))
  const root = remPx()
  const { canvasWidthRem, canvasHeightRem, insetRem } = NOTEBOOK_STAGE
  const cornerX = size.width - (insetRem + canvasWidthRem / 2) * root
  const cornerY = size.height - (insetRem + canvasHeightRem / 2) * root
  return {
    x: THREE.MathUtils.lerp(cornerX, size.width / 2, p),
    y: THREE.MathUtils.lerp(cornerY, size.height / 2, p),
  }
}

/** World offset so the cover center projects to a screen pixel (uses live camera). */
export function worldOffsetForScreenPoint(
  camera: THREE.Camera,
  size: { width: number; height: number },
  screenX: number,
  screenY: number,
) {
  ndc.set((screenX / size.width) * 2 - 1, -(screenY / size.height) * 2 + 1)
  raycaster.setFromCamera(ndc, camera)
  if (!raycaster.ray.intersectPlane(deskPlane, hit)) {
    return { x: 0, y: 0 }
  }
  return { x: hit.x - COVER_CENTER.x, y: hit.y - COVER_CENTER.y }
}
