'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCursor, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import {
  COVER_CORNER_RADIUS,
  PAGE_CORNER_RADIUS,
  createNotebookSlabGeometry,
} from './notebookGeometry'
import {
  createCompositionPageResumeTexture,
  createInsideCoverTexture,
} from './notebookTextures'

export const NOTEBOOK = {
  width: 1.52,
  depth: 1.98,
  cover: 0.02,
  pages: 0.045,
}

const PAPER_CREAM = '#f4efe3'
const PAGE_CLEARANCE = 0.002
const PAGE_HEIGHT = NOTEBOOK.pages - PAGE_CLEARANCE
const PAGE_SPINE_INSET = 0.101
const PAGE_OUTER_INSET = 0.01
const PAGE_EDGE_INSET = 0.01
export const PAGE_WIDTH = NOTEBOOK.width - PAGE_SPINE_INSET - PAGE_OUTER_INSET
export const PAGE_DEPTH = NOTEBOOK.depth - PAGE_EDGE_INSET * 2
export const PAGE_CENTER_X = PAGE_SPINE_INSET + PAGE_WIDTH / 2
const PAGE_TEX_WIDTH = 3072
const PAGE_TEX_HEIGHT = Math.round(PAGE_TEX_WIDTH * (PAGE_DEPTH / PAGE_WIDTH))
const COVER_TEX_WIDTH = 2048
const COVER_TEX_HEIGHT = Math.round(COVER_TEX_WIDTH * (NOTEBOOK.depth / NOTEBOOK.width))

/** Marble composition notebook — geometry + textures. */
export default function Notebook({
  openAmount = 0,
  interactive = false,
  pageInteractive = false,
  onPress,
  onClosePage,
}: {
  openAmount?: number
  interactive?: boolean
  pageInteractive?: boolean
  onPress?: () => void
  onClosePage?: () => void
}) {
  const [pageHover, setPageHover] = useState(false)
  const [coverMap, paperMap] = useTexture([
    '/notebook/notebook-cover.jpg',
    '/notebook/paper-cream.jpg',
  ])

  coverMap.colorSpace = THREE.SRGBColorSpace
  paperMap.colorSpace = THREE.SRGBColorSpace
  coverMap.anisotropy = 8
  paperMap.anisotropy = 4

  const pageResumeMap = useMemo(
    () => createCompositionPageResumeTexture(PAGE_TEX_WIDTH, PAGE_TEX_HEIGHT),
    [],
  )
  const classProgramMap = useMemo(
    () => createInsideCoverTexture(COVER_TEX_WIDTH, COVER_TEX_HEIGHT),
    [],
  )

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
    pageResumeMap.generateMipmaps = false
    pageResumeMap.minFilter = THREE.LinearFilter
    pageResumeMap.magFilter = THREE.LinearFilter
    pageResumeMap.anisotropy = 16
    pageResumeMap.needsUpdate = true
    classProgramMap.anisotropy = 8
    classProgramMap.needsUpdate = true
    return () => {
      pageResumeMap.dispose()
      classProgramMap.dispose()
      coverGeom.dispose()
      pageGeom.dispose()
    }
  }, [pageResumeMap, classProgramMap, coverGeom, pageGeom])

  useCursor(pageHover && (interactive || pageInteractive))

  const coverOpen = THREE.MathUtils.clamp(openAmount, 0, 1) * Math.PI * 0.93
  const pageY = NOTEBOOK.cover + PAGE_HEIGHT / 2
  const coverHingeY = NOTEBOOK.cover + NOTEBOOK.pages

  return (
    <group
      position={[-0.5, 0, 0]}
      onClick={(event) => {
        event.stopPropagation()
        if (interactive) onPress?.()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        if (interactive) setPageHover(true)
      }}
      onPointerOut={() => setPageHover(false)}
    >
      <mesh
        position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]}
        geometry={coverGeom}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={paperMap} roughness={0.92} metalness={0} />
      </mesh>

      <mesh
        position={[PAGE_CENTER_X, pageY, 0]}
        geometry={pageGeom}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation()
          if (pageInteractive) onClosePage?.()
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          if (pageInteractive) setPageHover(true)
        }}
        onPointerOut={() => setPageHover(false)}
      >
        <meshStandardMaterial attach="material-0" color={PAPER_CREAM} roughness={0.95} />
        <meshStandardMaterial attach="material-1" color={PAPER_CREAM} roughness={0.95} />
        <meshBasicMaterial attach="material-2" map={pageResumeMap} />
        <meshStandardMaterial attach="material-3" map={paperMap} color={PAPER_CREAM} roughness={0.95} />
        <meshStandardMaterial attach="material-4" color={PAPER_CREAM} roughness={0.95} />
        <meshStandardMaterial attach="material-5" color={PAPER_CREAM} roughness={0.95} />
      </mesh>

      <group position={[0, coverHingeY, 0]} rotation={[0, 0, coverOpen]}>
        <mesh
          position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]}
          geometry={coverGeom}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial attach="material-0" color="#141414" roughness={0.6} />
          <meshStandardMaterial attach="material-1" color="#141414" roughness={0.6} />
          <meshStandardMaterial attach="material-2" map={coverMap} roughness={0.55} metalness={0.02} />
          <meshStandardMaterial
            attach="material-3"
            map={classProgramMap}
            roughness={0.92}
            metalness={0}
          />
          <meshStandardMaterial attach="material-4" color="#141414" roughness={0.6} />
          <meshStandardMaterial attach="material-5" color="#141414" roughness={0.6} />
        </mesh>
      </group>

      <mesh position={[0.05, coverHingeY / 2, 0]} castShadow>
        <boxGeometry args={[0.1, coverHingeY + 0.02, NOTEBOOK.depth + 0.01]} />
        <meshStandardMaterial color="#111111" roughness={0.7} metalness={0.05} />
      </mesh>
    </group>
  )
}
