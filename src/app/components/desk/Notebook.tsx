'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Html, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { NotebookCopy } from '@/data/notebook'
import Resume from '../Resume'
import Hotspot from './Hotspot'
import { PAGE_CORNER_RADIUS, createNotebookSlabGeometry } from './notebookGeometry'

export const NOTEBOOK = {
  width: 1.52,
  depth: 1.98,
  cover: 0.02,
  pages: 0.045,
}

const PAPER_CREAM = '#f4efe3'
const PAGE_CLEARANCE = 0.002
const PAGE_HEIGHT = NOTEBOOK.pages - PAGE_CLEARANCE
// Spine tape is a 0.10-wide box centered at x=0.05 (occupies 0–0.10).
const PAGE_SPINE_INSET = 0.12
const PAGE_OUTER_INSET = 0.04
const PAGE_EDGE_INSET = 0.04
export const PAGE_WIDTH = NOTEBOOK.width - PAGE_SPINE_INSET - PAGE_OUTER_INSET
export const PAGE_DEPTH = NOTEBOOK.depth - PAGE_EDGE_INSET * 2
export const PAGE_CENTER_X = PAGE_SPINE_INSET + PAGE_WIDTH / 2
const PAPER_CSS = { width: 400, height: 560 } as const
// drei Html transform defaults distanceFactor to 10 (400px → 10 world units).
// 400 restores 1px ≈ 1 world unit so scale can map the overlay onto the mesh.
const HTML_DISTANCE_FACTOR = PAPER_CSS.width
const CLICK_SLOP_PX = 8
// Cover rotation is damped; ~0.54 is vertical. Wait until it is mostly off the page.
const RESUME_REVEAL = 0.66
// Sit slightly into the page so the CSS3D sheet is the bound face, not a card above it.
const HTML_PAGE_EMBED = 0.0012
// CSS radii that stay circular in world space after the non-uniform Html scale.
const PAGE_CORNER_CSS = `${(PAGE_CORNER_RADIUS / PAGE_WIDTH) * PAPER_CSS.width}px ${(PAGE_CORNER_RADIUS / PAGE_DEPTH) * PAPER_CSS.height}px`

function isPaperLink(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('a[href]'))
}

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
  const pressRef = useRef<{ x: number; y: number; scroll: number } | null>(null)
  const openAmount = useRef(opened ? 1 : 0)
  const resumeVisibleRef = useRef(openAmount.current > RESUME_REVEAL)
  const [resumeVisible, setResumeVisible] = useState(resumeVisibleRef.current)
  const [coverMap, paperMap] = useTexture([
    '/desk/notebook-cover.jpg',
    '/desk/paper-cream.jpg',
  ])
  const pageGeometry = useMemo(
    () => createNotebookSlabGeometry(PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH, PAGE_CORNER_RADIUS),
    [],
  )

  useEffect(() => () => pageGeometry.dispose(), [pageGeometry])

  coverMap.colorSpace = THREE.SRGBColorSpace
  paperMap.colorSpace = THREE.SRGBColorSpace
  coverMap.anisotropy = 8
  paperMap.anisotropy = 4

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

  const pageY = NOTEBOOK.cover + PAGE_HEIGHT / 2
  const coverHingeY = NOTEBOOK.cover + NOTEBOOK.pages
  const pageTop = NOTEBOOK.cover + PAGE_HEIGHT

  return (
    <Hotspot disabled={!interactive || pageInteractive} label="Resume notebook" onSelect={onOpenPage}>
      <group position={[-0.5, 0, 0]}>
        <mesh position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[NOTEBOOK.width, NOTEBOOK.cover, NOTEBOOK.depth]} />
          <meshStandardMaterial map={paperMap} roughness={0.92} metalness={0} />
        </mesh>

        <mesh
          geometry={pageGeometry}
          position={[PAGE_CENTER_X, pageY, 0]}
          castShadow
          receiveShadow
          visible={!resumeVisible}
          onClick={(event) => {
            event.stopPropagation()
            if (pageInteractive) onClosePage()
          }}
        >
          <meshStandardMaterial map={paperMap} roughness={0.95} color={PAPER_CREAM} />
        </mesh>

        <group ref={coverRef} position={[0, coverHingeY, 0]}>
          {/* BoxGeometry groups: +X, -X, +Y marble, -Y cream, +Z, -Z. */}
          <mesh position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[NOTEBOOK.width, NOTEBOOK.cover, NOTEBOOK.depth]} />
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

        {resumeVisible ? (
          <Html
            transform
            occlude={false}
            wrapperClass="lined-html-portal"
            className="lined-html"
            position={[PAGE_CENTER_X, pageTop - HTML_PAGE_EMBED, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            distanceFactor={HTML_DISTANCE_FACTOR}
            scale={[PAGE_WIDTH / PAPER_CSS.width, PAGE_DEPTH / PAPER_CSS.height, 1]}
            pointerEvents={pageInteractive ? 'auto' : 'none'}
            zIndexRange={[20, 0]}
            style={{
              background: PAPER_CREAM,
              boxShadow: 'none',
              filter: 'none',
              outline: 'none',
              overflow: 'hidden',
              borderTopRightRadius: PAGE_CORNER_CSS,
              borderBottomRightRadius: PAGE_CORNER_CSS,
            }}
          >
            <div
              className="lined-paper notebook-page"
              style={{
                borderTopRightRadius: PAGE_CORNER_CSS,
                borderBottomRightRadius: PAGE_CORNER_CSS,
              }}
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
