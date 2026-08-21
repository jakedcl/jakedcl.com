'use client'

import { useRef, useState } from 'react'
import { Html, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { NotebookCopy } from '@/data/notebook'
import Resume from '../Resume'
import Hotspot from './Hotspot'

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
const CLICK_SLOP_PX = 8
const PAGE_CLEARANCE = 0.002
// Cover rotation is damped; ~0.54 is vertical. Wait until it is mostly off the page.
const RESUME_REVEAL = 0.66
// Spine tape occupies x≈0–0.10; page mesh left is 0.06. Nudge the overlay onto the cream.
const HTML_SPINE_NUDGE = 0.04
// Sit slightly into the page so the CSS3D sheet is not a card hovering above it.
const HTML_PAGE_EMBED = 0.0006

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

  const pageHeight = NOTEBOOK.pages - PAGE_CLEARANCE
  const pageY = NOTEBOOK.cover + pageHeight / 2
  const coverHingeY = NOTEBOOK.cover + NOTEBOOK.pages
  const pageTop = NOTEBOOK.cover + pageHeight

  return (
    <Hotspot disabled={!interactive || pageInteractive} label="Resume notebook" onSelect={onOpenPage}>
      <group position={[-0.5, 0, 0]}>
        <mesh position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[NOTEBOOK.width, NOTEBOOK.cover, NOTEBOOK.depth]} />
          <meshStandardMaterial map={paperMap} roughness={0.92} metalness={0} />
        </mesh>

        <mesh
          position={[NOTEBOOK.width / 2 + 0.02, pageY, 0]}
          castShadow
          receiveShadow
          onClick={(event) => {
            event.stopPropagation()
            if (pageInteractive) onClosePage()
          }}
        >
          <boxGeometry args={[PAGE_WIDTH, pageHeight, PAGE_DEPTH]} />
          <meshStandardMaterial map={paperMap} roughness={0.95} color="#f4efe3" />
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
            position={[
              NOTEBOOK.width / 2 + 0.02 + HTML_SPINE_NUDGE,
              pageTop - HTML_PAGE_EMBED,
              0,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
            distanceFactor={HTML_DISTANCE_FACTOR}
            scale={[PAGE_WIDTH / PAPER_CSS.width, PAGE_DEPTH / PAPER_CSS.height, 1]}
            pointerEvents={pageInteractive ? 'auto' : 'none'}
            zIndexRange={[20, 0]}
            style={{ background: 'transparent', boxShadow: 'none' }}
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
