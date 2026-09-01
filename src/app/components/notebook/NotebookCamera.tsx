'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COVER_FOCUS = new THREE.Vector3(0.26, 0.06, 0)
const PAGE_FOCUS = new THREE.Vector3(0.3, 0.04, 0)

/** Tiny icon in the corner — camera far back, tight fov. */
export const CORNER_VIEW = {
  position: new THREE.Vector3(0.26, 0.22, 4.35),
  target: new THREE.Vector3(0.26, 0.04, 0),
  fov: 17,
}

export const CENTER_VIEW = {
  position: new THREE.Vector3(0.26, 0.42, 2.35),
  target: COVER_FOCUS,
  fov: 30,
}

export const PAGE_VIEW = {
  position: new THREE.Vector3(0.3, 2.65, 0.72),
  target: PAGE_FOCUS,
  fov: 31,
}

function lerpView(
  a: typeof CORNER_VIEW,
  b: typeof CORNER_VIEW,
  t: number,
): typeof CORNER_VIEW {
  return {
    position: a.position.clone().lerp(b.position, t),
    target: a.target.clone().lerp(b.target, t),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, t),
  }
}

export default function NotebookCamera({
  prominence,
  opened,
}: {
  prominence: number
  opened: boolean
}) {
  const { camera } = useThree()
  const openMix = useRef(0)

  useFrame((_, delta) => {
    const centerMix = THREE.MathUtils.clamp(prominence, 0, 1)
    openMix.current = THREE.MathUtils.damp(openMix.current, opened ? 1 : 0, 5, delta)

    const centered = lerpView(CORNER_VIEW, CENTER_VIEW, centerMix)
    const target = lerpView(centered, PAGE_VIEW, openMix.current)

    camera.position.copy(target.position)
    camera.lookAt(target.target)
    if ('fov' in camera) {
      camera.fov = target.fov
      camera.updateProjectionMatrix()
    }
  })

  return null
}
