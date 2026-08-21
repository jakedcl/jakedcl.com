'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ORBIT_SHOTS, pageCameraForAspect, shots } from './shots'
import type { ShotName } from './types'

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

function resolveDest(shot: ShotName, aspect: number) {
  if (shot === 'page') return pageCameraForAspect(aspect)
  const s = shots[shot]
  return { position: s.position, target: s.target, fov: s.fov }
}

export default function CameraRig({
  shot,
  orbitEnabled,
  snap,
  onArrived,
}: {
  shot: ShotName
  orbitEnabled: boolean
  snap?: boolean
  onArrived?: (shot: ShotName) => void
}) {
  const { camera, size } = useThree()
  const lookAt = useRef(new THREE.Vector3(...shots[shot].target))
  const startPos = useRef(new THREE.Vector3(...shots.intro.position))
  const startTarget = useRef(new THREE.Vector3(...shots.intro.target))
  const destPos = useRef(new THREE.Vector3(...shots[shot].position))
  const destTarget = useRef(new THREE.Vector3(...shots[shot].target))
  const startFov = useRef(shots.intro.fov)
  const destFov = useRef(shots[shot].fov)
  const duration = useRef(shots[shot].duration ?? 1.55)
  const progress = useRef(0)
  const currentShot = useRef(shot)
  const arrived = useRef(false)
  const snapRef = useRef(snap)
  snapRef.current = snap

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1)
    const dest = resolveDest(shot, aspect)
    startPos.current.copy(camera.position)
    startTarget.current.copy(lookAt.current)
    destPos.current.set(...dest.position)
    destTarget.current.set(...dest.target)
    destFov.current = dest.fov
    startFov.current = 'fov' in camera ? camera.fov : dest.fov
    duration.current = snapRef.current ? 0.001 : (shots[shot].duration ?? 1.55)
    progress.current = 0
    arrived.current = false
    currentShot.current = shot
    // Aspect at shot-change only; live page reframing is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- size read once per shot
  }, [camera, shot])

  useEffect(() => {
    if (currentShot.current !== 'page') return
    const dest = pageCameraForAspect(size.width / Math.max(size.height, 1))
    destPos.current.set(...dest.position)
    destTarget.current.set(...dest.target)
    destFov.current = dest.fov
    if (arrived.current && 'fov' in camera) {
      camera.position.copy(destPos.current)
      lookAt.current.copy(destTarget.current)
      camera.lookAt(lookAt.current)
      camera.fov = destFov.current
      camera.updateProjectionMatrix()
    }
  }, [camera, size.width, size.height])

  useFrame((_, delta) => {
    if (orbitEnabled && arrived.current) return

    progress.current = Math.min(1, progress.current + delta / duration.current)
    const easing = duration.current >= 2.2 ? easeInOutCubic : easeOutCubic
    const t = easing(progress.current)

    camera.position.lerpVectors(startPos.current, destPos.current, t)
    lookAt.current.lerpVectors(startTarget.current, destTarget.current, t)
    camera.lookAt(lookAt.current)

    if ('fov' in camera) {
      camera.fov = THREE.MathUtils.lerp(startFov.current, destFov.current, t)
      camera.updateProjectionMatrix()
    }

    if (progress.current >= 1 && !arrived.current) {
      arrived.current = true
      onArrived?.(currentShot.current)
    }
  })

  return null
}

export function canOrbit(shot: ShotName) {
  return ORBIT_SHOTS.includes(shot)
}
