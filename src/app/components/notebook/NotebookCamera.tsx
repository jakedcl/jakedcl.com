'use client'

import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COVER_FOCUS = new THREE.Vector3(0.26, 0.07, 0)
const PAGE_FOCUS = new THREE.Vector3(0.02, 0.02, 0.02)

export const CORNER_VIEW = {
  position: new THREE.Vector3(0.26, 2.9, 3.75),
  target: COVER_FOCUS,
  fov: 34,
}

const PAGE_CAM = { y: 3.95, z: 0.82, fov: 32 } as const

function pageViewForAspect(aspect: number) {
  const ref = 16 / 9
  const pull = Math.min(1.16, Math.max(0.92, Math.sqrt(ref / Math.max(aspect, 0.5))))
  return {
    position: new THREE.Vector3(PAGE_FOCUS.x, PAGE_CAM.y * pull, PAGE_CAM.z * pull),
    target: PAGE_FOCUS.clone(),
    fov: PAGE_CAM.fov * (0.98 + (pull - 1) * 0.4),
  }
}

function lerpView(a: typeof CORNER_VIEW, b: typeof CORNER_VIEW, t: number) {
  return {
    position: a.position.clone().lerp(b.position, t),
    target: a.target.clone().lerp(b.target, t),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, t),
  }
}

export default function NotebookCamera({ progress }: { progress: number }) {
  const { camera, size } = useThree()

  useFrame(() => {
    const t = THREE.MathUtils.clamp(progress, 0, 1)
    const aspect = size.width / Math.max(size.height, 1)
    const pageView = pageViewForAspect(aspect)
    const view = lerpView(CORNER_VIEW, pageView, t)
    camera.position.copy(view.position)
    camera.lookAt(view.target)
    if ('fov' in camera) {
      camera.fov = view.fov
      camera.aspect = aspect
      camera.updateProjectionMatrix()
    }
  })

  return null
}
