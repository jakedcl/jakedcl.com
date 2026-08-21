'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ORBIT_SHOTS, shots } from './shots'
import type { ShotName } from './types'

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

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
  const { camera } = useThree()
  const lookAt = useRef(new THREE.Vector3(...shots[shot].target))
  const startPos = useRef(new THREE.Vector3(...shots.intro.position))
  const startTarget = useRef(new THREE.Vector3(...shots.intro.target))
  const destPos = useRef(new THREE.Vector3(...shots[shot].position))
  const destTarget = useRef(new THREE.Vector3(...shots[shot].target))
  const startFov = useRef(shots.intro.fov)
  const duration = useRef(shots[shot].duration ?? 1.55)
  const progress = useRef(0)
  const currentShot = useRef(shot)
  const arrived = useRef(false)
  const snapRef = useRef(snap)
  snapRef.current = snap

  useEffect(() => {
    startPos.current.copy(camera.position)
    startTarget.current.copy(lookAt.current)
    destPos.current.set(...shots[shot].position)
    destTarget.current.set(...shots[shot].target)
    startFov.current = 'fov' in camera ? camera.fov : shots[shot].fov
    duration.current = snapRef.current ? 0.001 : (shots[shot].duration ?? 1.55)
    progress.current = 0
    arrived.current = false
    currentShot.current = shot
  }, [camera, shot])

  useFrame((_, delta) => {
    if (orbitEnabled && arrived.current) return

    progress.current = Math.min(1, progress.current + delta / duration.current)
    const t = easeOutCubic(progress.current)
    const dest = shots[currentShot.current]

    camera.position.lerpVectors(startPos.current, destPos.current, t)
    lookAt.current.lerpVectors(startTarget.current, destTarget.current, t)
    camera.lookAt(lookAt.current)

    if ('fov' in camera) {
      camera.fov = THREE.MathUtils.lerp(startFov.current, dest.fov, t)
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
