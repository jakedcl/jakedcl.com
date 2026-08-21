'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useCursor, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { NotebookCopy } from '@/data/notebook'
import Hotspot from './Hotspot'
import {
  COVER_CORNER_RADIUS,
  PAGE_CORNER_RADIUS,
  createNotebookSlabGeometry,
} from './notebookGeometry'
import { createCompositionPageResumeTexture } from './notebookTextures'

export const NOTEBOOK = {
  width: 1.52,
  depth: 1.98,
  cover: 0.02,
  pages: 0.045,
}

const PAPER_CREAM = '#f4efe3'
const PAGE_CLEARANCE = 0.002
const PAGE_HEIGHT = NOTEBOOK.pages - PAGE_CLEARANCE
// Cloth spine is 0.10 wide at x=0.05 (occupies 0–0.10). Tiny clearance only —
// pages read flush with the marble cover, bound at the black tape.
const PAGE_SPINE_INSET = 0.105
const PAGE_OUTER_INSET = 0.015
const PAGE_EDGE_INSET = 0.015
export const PAGE_WIDTH = NOTEBOOK.width - PAGE_SPINE_INSET - PAGE_OUTER_INSET
export const PAGE_DEPTH = NOTEBOOK.depth - PAGE_EDGE_INSET * 2
export const PAGE_CENTER_X = PAGE_SPINE_INSET + PAGE_WIDTH / 2
const PAGE_TEX_WIDTH = 2048
const PAGE_TEX_HEIGHT = Math.round(PAGE_TEX_WIDTH * (PAGE_DEPTH / PAGE_WIDTH))

export default function Notebook({
  opened,
  pageInteractive,
  interactive = true,
  onOpenPage,
  onClosePage,
}: {
  opened: boolean
  pageInteractive: boolean
  interactive?: boolean
  notebook?: NotebookCopy
  onOpenPage: () => void
  onClosePage: () => void
}) {
  const coverRef = useRef<THREE.Group>(null)
  const openAmount = useRef(opened ? 1 : 0)
  const [pageHover, setPageHover] = useState(false)
  const [coverMap, paperMap] = useTexture([
    '/desk/notebook-cover.jpg',
    '/desk/paper-cream.jpg',
  ])

  coverMap.colorSpace = THREE.SRGBColorSpace
  paperMap.colorSpace = THREE.SRGBColorSpace
  coverMap.anisotropy = 8
  paperMap.anisotropy = 4

  const pageResumeMap = useMemo(
    () => createCompositionPageResumeTexture(PAGE_TEX_WIDTH, PAGE_TEX_HEIGHT),
    [],
  )

  // Rounded outer corners; square at the cloth spine. Groups match BoxGeometry order.
  const coverGeom = useMemo(
    () =>
      createNotebookSlabGeometry(
        NOTEBOOK.width,
        NOTEBOOK.cover,
        NOTEBOOK.depth,
        COVER_CORNER_RADIUS,
      ),
    [],
  )
  const pageGeom = useMemo(
    () =>
      createNotebookSlabGeometry(PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH, PAGE_CORNER_RADIUS),
    [],
  )

  useEffect(() => {
    // No mipmaps — canvas type stays crisp when the page shot is close.
    pageResumeMap.generateMipmaps = false
    pageResumeMap.minFilter = THREE.LinearFilter
    pageResumeMap.magFilter = THREE.LinearFilter
    pageResumeMap.anisotropy = 16
    pageResumeMap.needsUpdate = true
    return () => {
      pageResumeMap.dispose()
      coverGeom.dispose()
      pageGeom.dispose()
    }
  }, [pageResumeMap, coverGeom, pageGeom])

  useCursor(pageHover && pageInteractive)

  useFrame((_, delta) => {
    const target = opened ? 1 : 0
    openAmount.current = THREE.MathUtils.damp(openAmount.current, target, 2.15, delta)
    if (coverRef.current) {
      coverRef.current.rotation.z = openAmount.current * Math.PI * 0.93
    }
  })

  const pageY = NOTEBOOK.cover + PAGE_HEIGHT / 2
  const coverHingeY = NOTEBOOK.cover + NOTEBOOK.pages

  return (
    <Hotspot disabled={!interactive || pageInteractive} label="Resume notebook" onSelect={onOpenPage}>
      <group position={[-0.5, 0, 0]}>
        <mesh
          position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]}
          geometry={coverGeom}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial map={paperMap} roughness={0.92} metalness={0} />
        </mesh>

        {/* Slab groups: +X, -X, +Y ruled resume, -Y cream, +Z, -Z. */}
        <mesh
          position={[PAGE_CENTER_X, pageY, 0]}
          geometry={pageGeom}
          castShadow
          receiveShadow
          onClick={(event) => {
            event.stopPropagation()
            if (pageInteractive) onClosePage()
          }}
          onPointerOver={(event) => {
            event.stopPropagation()
            if (pageInteractive) setPageHover(true)
          }}
          onPointerOut={() => setPageHover(false)}
        >
          <meshStandardMaterial attach="material-0" color={PAPER_CREAM} roughness={0.95} />
          <meshStandardMaterial attach="material-1" color={PAPER_CREAM} roughness={0.95} />
          <meshStandardMaterial attach="material-2" map={pageResumeMap} roughness={0.95} metalness={0} />
          <meshStandardMaterial attach="material-3" map={paperMap} color={PAPER_CREAM} roughness={0.95} />
          <meshStandardMaterial attach="material-4" color={PAPER_CREAM} roughness={0.95} />
          <meshStandardMaterial attach="material-5" color={PAPER_CREAM} roughness={0.95} />
        </mesh>

        <group ref={coverRef} position={[0, coverHingeY, 0]}>
          {/* Slab groups: +X, -X, +Y marble, -Y cream, +Z, -Z. */}
          <mesh
            position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]}
            geometry={coverGeom}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial attach="material-0" color="#141414" roughness={0.6} />
            <meshStandardMaterial attach="material-1" color="#141414" roughness={0.6} />
            <meshStandardMaterial attach="material-2" map={coverMap} roughness={0.55} metalness={0.02} />
            <meshStandardMaterial attach="material-3" map={paperMap} roughness={0.92} />
            <meshStandardMaterial attach="material-4" color="#141414" roughness={0.6} />
            <meshStandardMaterial attach="material-5" color="#141414" roughness={0.6} />
          </mesh>
        </group>

        <mesh position={[0.05, coverHingeY / 2, 0]} castShadow>
          <boxGeometry args={[0.1, coverHingeY + 0.02, NOTEBOOK.depth + 0.01]} />
          <meshStandardMaterial color="#111111" roughness={0.7} metalness={0.05} />
        </mesh>
      </group>
    </Hotspot>
  )
}
