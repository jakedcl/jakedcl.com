'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Html, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { resolveNotebookCopy, type NotebookCopy } from '@/data/notebook'
import Resume from '../Resume'
import Hotspot from './Hotspot'
import {
  COVER_CORNER_RADIUS,
  PAGE_CORNER_RADIUS,
  createNotebookSlabGeometry,
} from './notebookGeometry'
import { createCoverTexture, createInsideCoverTexture } from './notebookTextures'

export const NOTEBOOK = {
  width: 1.52,
  depth: 1.98,
  cover: 0.02,
  pages: 0.045,
}

const PAGE_INSET = 0.08
const PAGE_WIDTH = NOTEBOOK.width - PAGE_INSET
const PAGE_DEPTH = NOTEBOOK.depth - PAGE_INSET
const PAPER_CSS = { width: 400, height: 560 } as const
// drei Html transform defaults distanceFactor to 10 (400px → 10 world units).
// 400 restores 1px ≈ 1 world unit so scale can map the overlay onto the mesh.
const HTML_DISTANCE_FACTOR = PAPER_CSS.width
// Cover rotation is damped; ~0.54 is vertical. Wait until it is mostly off the page
// so CSS3D resume text cannot punch through the still-closed marble.
const RESUME_REVEAL = 0.62
const CLICK_SLOP_PX = 8
const PAGE_CLEARANCE = 0.002
const TEX_WIDTH = 2048
const TEX_HEIGHT = Math.round(TEX_WIDTH * (NOTEBOOK.depth / NOTEBOOK.width))

function isPaperLink(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('a[href]'))
}

function NotebookSlab({
  width,
  height,
  depth,
  radius,
  position,
  material,
  children,
}: {
  width: number
  height: number
  depth: number
  radius: number
  position: [number, number, number]
  material?: THREE.Material | THREE.Material[]
  children?: ReactNode
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
  const resumeVisibleRef = useRef(openAmount.current > RESUME_REVEAL)
  const [resumeVisible, setResumeVisible] = useState(resumeVisibleRef.current)
  const pressRef = useRef<{ x: number; y: number; scroll: number } | null>(null)
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

  useEffect(() => {
    const maps = [coverLabelMap, insideCoverMap]
    const maxAniso = Math.max(8, gl.capabilities.getMaxAnisotropy())
    for (const map of maps) {
      if (!map) continue
      map.anisotropy = maxAniso
      map.needsUpdate = true
    }
    return () => {
      coverLabelMap?.dispose()
      insideCoverMap?.dispose()
    }
  }, [gl, coverLabelMap, insideCoverMap])

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
        map: paperMap,
        roughness: 0.95,
        metalness: 0,
        color: '#f4efe3',
        transparent: false,
        opacity: 1,
        depthWrite: true,
        depthTest: true,
      }),
    [paperMap],
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
    const nextVisible = openAmount.current > RESUME_REVEAL
    if (nextVisible !== resumeVisibleRef.current) {
      resumeVisibleRef.current = nextVisible
      setResumeVisible(nextVisible)
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

        {resumeVisible ? (
          <Html
            transform
            occlude={[coverRef as RefObject<THREE.Object3D>]}
            position={[NOTEBOOK.width / 2 + 0.02, coverHingeY + 0.002, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            distanceFactor={HTML_DISTANCE_FACTOR}
            scale={[PAGE_WIDTH / PAPER_CSS.width, PAGE_DEPTH / PAPER_CSS.height, 1]}
            pointerEvents={pageInteractive ? 'auto' : 'none'}
            zIndexRange={[20, 0]}
          >
            <div
              className="lined-paper notebook-page"
              tabIndex={0}
              aria-label="Resume. Click the page to close the notebook and return to the desk."
              onPointerDown={(event) => {
                event.stopPropagation()
                pressRef.current = {
                  x: event.clientX,
                  y: event.clientY,
                  scroll: event.currentTarget.scrollTop,
                }
              }}
              onPointerUp={(event) => {
                event.stopPropagation()
                const press = pressRef.current
                pressRef.current = null
                if (!press || isPaperLink(event.target)) return
                const dragged =
                  Math.hypot(event.clientX - press.x, event.clientY - press.y) > CLICK_SLOP_PX
                const scrolled = Math.abs(event.currentTarget.scrollTop - press.scroll) > 4
                if (dragged || scrolled) return
                onClosePage()
              }}
              onClick={(event) => event.stopPropagation()}
              onWheel={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault()
                  onClosePage()
                  return
                }
                if (event.target !== event.currentTarget) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onClosePage()
                }
              }}
            >
              <Resume variant="paper" />
            </div>
          </Html>
        ) : null}
      </group>
    </Hotspot>
  )
}
