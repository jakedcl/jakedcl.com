import * as THREE from 'three'

/** Visual anchor for the corner icon (fullscreen canvas, no clip-path). */
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

function viewportSize() {
  if (typeof window === 'undefined') return { width: 1280, height: 720 }
  return { width: window.innerWidth, height: window.innerHeight }
}

/** Where the cover should sit on screen for this progress (corner → center). */
export function coverScreenPosition(progress: number) {
  const p = Math.min(1, Math.max(0, progress))
  const root = remPx()
  const { width, height } = viewportSize()
  const { canvasWidthRem, canvasHeightRem, insetRem } = NOTEBOOK_STAGE
  const cornerX = width - (insetRem + canvasWidthRem / 2) * root
  const cornerY = height - (insetRem + canvasHeightRem / 2) * root
  return {
    x: THREE.MathUtils.lerp(cornerX, width / 2, p),
    y: THREE.MathUtils.lerp(cornerY, height / 2, p),
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
