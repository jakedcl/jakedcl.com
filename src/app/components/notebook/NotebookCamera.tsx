'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COVER_FOCUS = new THREE.Vector3(0.26, 0.06, 0)
const PAGE_FOCUS = new THREE.Vector3(0.3, 0.04, 0)

export const CORNER_VIEW = {
  position: new THREE.Vector3(0.32, 0.48, 2.05),
  target: new THREE.Vector3(0.26, 0.02, 0),
  fov: 26,
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

export type NotebookView = 'corner' | 'center' | 'page'

const VIEW_BY_MODE: Record<NotebookView, typeof CORNER_VIEW> = {
  corner: CORNER_VIEW,
  center: CENTER_VIEW,
  page: PAGE_VIEW,
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

export default function NotebookCamera({ view }: { view: NotebookView }) {
  const { camera } = useThree()
  const lookAt = useRef(CORNER_VIEW.target.clone())
  const startPos = useRef(CORNER_VIEW.position.clone())
  const startTarget = useRef(CORNER_VIEW.target.clone())
  const destPos = useRef(CORNER_VIEW.position.clone())
  const destTarget = useRef(CORNER_VIEW.target.clone())
  const startFov = useRef(CORNER_VIEW.fov)
  const progress = useRef(1)
  const duration = useRef(0.85)
  const currentView = useRef<NotebookView>(view)

  useEffect(() => {
    const dest = VIEW_BY_MODE[view]
    startPos.current.copy(camera.position)
    startTarget.current.copy(lookAt.current)
    destPos.current.copy(dest.position)
    destTarget.current.copy(dest.target)
    startFov.current = 'fov' in camera ? camera.fov : dest.fov
    duration.current = view === 'page' || currentView.current === 'page' ? 1.2 : 0.85
    progress.current = 0
    currentView.current = view
  }, [camera, view])

  useFrame((_, delta) => {
    if (progress.current >= 1) return

    progress.current = Math.min(1, progress.current + delta / duration.current)
    const t = easeOutCubic(progress.current)
    const dest = VIEW_BY_MODE[currentView.current]

    camera.position.lerpVectors(startPos.current, destPos.current, t)
    lookAt.current.lerpVectors(startTarget.current, destTarget.current, t)
    camera.lookAt(lookAt.current)

    if ('fov' in camera) {
      camera.fov = THREE.MathUtils.lerp(startFov.current, dest.fov, t)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
