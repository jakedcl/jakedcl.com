'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Closed cover center (hinge group x = -0.5, cover center x = 0.26).
const COVER_FOCUS = new THREE.Vector3(0.26, 0.06, 0)
// Open ruled page center.
const PAGE_FOCUS = new THREE.Vector3(0.3, 0.04, 0)

const CLOSED = {
  position: new THREE.Vector3(0.26, 0.42, 2.35),
  target: COVER_FOCUS,
  fov: 30,
}

const OPEN = {
  position: new THREE.Vector3(0.3, 2.65, 0.72),
  target: PAGE_FOCUS,
  fov: 31,
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

export default function NotebookCamera({ opened }: { opened: boolean }) {
  const { camera } = useThree()
  const lookAt = useRef(COVER_FOCUS.clone())
  const startPos = useRef(CLOSED.position.clone())
  const startTarget = useRef(COVER_FOCUS.clone())
  const destPos = useRef(CLOSED.position.clone())
  const destTarget = useRef(COVER_FOCUS.clone())
  const startFov = useRef(CLOSED.fov)
  const progress = useRef(1)
  const duration = 1.35

  useEffect(() => {
    const dest = opened ? OPEN : CLOSED
    startPos.current.copy(camera.position)
    startTarget.current.copy(lookAt.current)
    destPos.current.copy(dest.position)
    destTarget.current.copy(dest.target)
    startFov.current = 'fov' in camera ? camera.fov : dest.fov
    progress.current = 0
  }, [camera, opened])

  useFrame((_, delta) => {
    if (progress.current >= 1) return

    progress.current = Math.min(1, progress.current + delta / duration)
    const t = easeOutCubic(progress.current)

    camera.position.lerpVectors(startPos.current, destPos.current, t)
    lookAt.current.lerpVectors(startTarget.current, destTarget.current, t)
    camera.lookAt(lookAt.current)

    if ('fov' in camera) {
      camera.fov = THREE.MathUtils.lerp(startFov.current, opened ? OPEN.fov : CLOSED.fov, t)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
