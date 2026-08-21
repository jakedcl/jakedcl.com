'use client'

import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { resolveNotebookCopy, type NotebookCopy } from '@/data/notebook'
import Hotspot from './Hotspot'
import {
  COVER_CORNER_RADIUS,
  PAGE_CORNER_RADIUS,
  createNotebookSlabGeometry,
} from './notebookGeometry'
import {
  createCoverTexture,
  createInsideCoverTexture,
  createLooseleafResumeTexture,
} from './notebookTextures'

export const NOTEBOOK = {
  width: 1.52,
  depth: 1.98,
  cover: 0.02,
  pages: 0.045,
}

const PAGE_INSET = 0.08
const PAGE_WIDTH = NOTEBOOK.width - PAGE_INSET
const PAGE_DEPTH = NOTEBOOK.depth - PAGE_INSET
const PAGE_CLEARANCE = 0.002
const TEX_WIDTH = 2048
const TEX_HEIGHT = Math.round(TEX_WIDTH * (NOTEBOOK.depth / NOTEBOOK.width))
const PAGE_TEX_WIDTH = 1600
const PAGE_TEX_HEIGHT = Math.round(PAGE_TEX_WIDTH * (PAGE_DEPTH / PAGE_WIDTH))

function NotebookSlab({
  width,
  height,
  depth,
  radius,
  position,
  material,
  children,
  onClick,
}: {
  width: number
  height: number
  depth: number
  radius: number
  position: [number, number, number]
  material?: THREE.Material | THREE.Material[]
  children?: ReactNode
  onClick?: (event: { stopPropagation: () => void }) => void
}) {
  const geometry = useMemo(
    () => createNotebookSlabGeometry(width, height, depth, radius),
    [width, height, depth, radius],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh
      geometry={geometry}
      position={position}
      material={material}
      castShadow
      receiveShadow
      onClick={onClick}
    >
      {children}
    </mesh>
  )
}

export default function Notebook({
  opened,
  pageInteractive,
  interactive = true,
  notebook = resolveNotebookCopy(null),
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
  const { gl } = useThree()
  const [coverMap, paperMap] = useTexture([
    '/desk/notebook-cover.jpg',
    '/desk/paper-cream.jpg',
  ])

  coverMap.colorSpace = THREE.SRGBColorSpace
  paperMap.colorSpace = THREE.SRGBColorSpace
  coverMap.anisotropy = 8
  paperMap.anisotropy = 4

  const coverLabelMap = useMemo(() => {
    if (typeof document === 'undefined') return null
    const image = coverMap.image as CanvasImageSource | undefined
    if (!image) return null
    return createCoverTexture(image, notebook.cover, TEX_WIDTH, TEX_HEIGHT)
  }, [coverMap, notebook.cover])

  const insideCoverMap = useMemo(() => {
    if (typeof document === 'undefined') return null
    return createInsideCoverTexture(notebook.inside, TEX_WIDTH, TEX_HEIGHT)
  }, [notebook.inside])

  const pageResumeMap = useMemo(() => {
    if (typeof document === 'undefined') return null
    return createLooseleafResumeTexture(PAGE_TEX_WIDTH, PAGE_TEX_HEIGHT)
  }, [])

  useEffect(() => {
    const maps = [coverLabelMap, insideCoverMap, pageResumeMap]
    const maxAniso = Math.max(8, gl.capabilities.getMaxAnisotropy())
    for (const map of maps) {
      if (!map) continue
      map.anisotropy = maxAniso
      map.needsUpdate = true
    }
    return () => {
      coverLabelMap?.dispose()
      insideCoverMap?.dispose()
      pageResumeMap?.dispose()
    }
  }, [gl, coverLabelMap, insideCoverMap, pageResumeMap])

  const backCoverMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: paperMap,
        roughness: 0.92,
        metalness: 0,
        transparent: false,
        opacity: 1,
        depthWrite: true,
      }),
    [paperMap],
  )

  const spineMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111111',
        roughness: 0.7,
        metalness: 0.05,
        transparent: false,
        opacity: 1,
        depthWrite: true,
      }),
    [],
  )

  const coverSideMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#141414',
        roughness: 0.6,
        transparent: false,
        opacity: 1,
        depthWrite: true,
        depthTest: true,
      }),
    [],
  )

  const coverFaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: coverLabelMap ?? coverMap,
        roughness: 0.55,
        metalness: 0.02,
        transparent: false,
        opacity: 1,
        depthWrite: true,
        depthTest: true,
      }),
    [coverLabelMap, coverMap],
  )

  const insideFaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: insideCoverMap ?? paperMap,
        roughness: 0.92,
        transparent: false,
        opacity: 1,
        depthWrite: true,
        depthTest: true,
      }),
    [insideCoverMap, paperMap],
  )

  const coverMaterials = useMemo(
    () => [
      coverSideMaterial,
      coverSideMaterial,
      coverFaceMaterial,
      insideFaceMaterial,
      coverSideMaterial,
      coverSideMaterial,
    ],
    [coverFaceMaterial, coverSideMaterial, insideFaceMaterial],
  )

  const pageSideMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: paperMap,
        roughness: 0.95,
        color: '#f4efe3',
        transparent: false,
        opacity: 1,
        depthWrite: true,
      }),
    [paperMap],
  )

  const pageFaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: pageResumeMap ?? paperMap,
        roughness: 0.95,
        metalness: 0,
        color: pageResumeMap ? '#ffffff' : '#f4efe3',
        transparent: false,
        opacity: 1,
        depthWrite: true,
        depthTest: true,
      }),
    [pageResumeMap, paperMap],
  )

  const pageMaterials = useMemo(
    () => [
      pageSideMaterial,
      pageSideMaterial,
      pageFaceMaterial,
      pageSideMaterial,
      pageSideMaterial,
      pageSideMaterial,
    ],
    [pageFaceMaterial, pageSideMaterial],
  )

  useFrame((_, delta) => {
    const target = opened ? 1 : 0
    openAmount.current = THREE.MathUtils.damp(openAmount.current, target, 2.15, delta)
    if (coverRef.current) {
      coverRef.current.rotation.z = openAmount.current * Math.PI * 0.93
    }
  })

  const pageHeight = NOTEBOOK.pages - PAGE_CLEARANCE
  const pageY = NOTEBOOK.cover + pageHeight / 2
  const coverHingeY = NOTEBOOK.cover + NOTEBOOK.pages

  return (
    <Hotspot disabled={!interactive || pageInteractive} label="Resume notebook" onSelect={onOpenPage}>
      <group position={[-0.5, 0, 0]}>
        <NotebookSlab
          width={NOTEBOOK.width}
          height={NOTEBOOK.cover}
          depth={NOTEBOOK.depth}
          radius={COVER_CORNER_RADIUS}
          position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]}
          material={backCoverMaterial}
        />

        <NotebookSlab
          width={PAGE_WIDTH}
          height={pageHeight}
          depth={PAGE_DEPTH}
          radius={PAGE_CORNER_RADIUS}
          position={[NOTEBOOK.width / 2 + 0.02, pageY, 0]}
          material={pageMaterials}
          onClick={(event) => {
            event.stopPropagation()
            if (pageInteractive) onClosePage()
          }}
        />

        <group ref={coverRef} position={[0, coverHingeY, 0]}>
          <NotebookSlab
            width={NOTEBOOK.width}
            height={NOTEBOOK.cover}
            depth={NOTEBOOK.depth}
            radius={COVER_CORNER_RADIUS}
            position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]}
            material={coverMaterials}
          />
        </group>

        <mesh position={[0.05, coverHingeY / 2, 0]} castShadow>
          <boxGeometry args={[0.1, coverHingeY + 0.02, NOTEBOOK.depth + 0.01]} />
          <primitive object={spineMaterial} attach="material" />
        </mesh>
      </group>
    </Hotspot>
  )
}
