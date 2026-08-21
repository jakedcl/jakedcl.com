'use client'

import { useMemo, useRef } from 'react'
import { Html, RoundedBox, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Resume from '../Resume'
import Hotspot from './Hotspot'

export const NOTEBOOK = {
  width: 1.52,
  depth: 1.98,
  cover: 0.02,
  pages: 0.045,
}

export default function Notebook({
  opened,
  pageInteractive,
  onOpenPage,
}: {
  opened: boolean
  pageInteractive: boolean
  onOpenPage: () => void
}) {
  const coverRef = useRef<THREE.Group>(null)
  const openAmount = useRef(opened ? 1 : 0)
  const [coverMap, paperMap] = useTexture([
    '/desk/notebook-cover.jpg',
    '/desk/paper-cream.jpg',
  ])

  coverMap.colorSpace = THREE.SRGBColorSpace
  paperMap.colorSpace = THREE.SRGBColorSpace
  coverMap.anisotropy = 8
  paperMap.anisotropy = 4

  const insideMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: paperMap,
        roughness: 0.92,
        metalness: 0,
      }),
    [paperMap],
  )

  const spineMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111111',
        roughness: 0.7,
        metalness: 0.05,
      }),
    [],
  )

  useFrame((_, delta) => {
    const target = opened ? 1 : 0
    openAmount.current = THREE.MathUtils.damp(openAmount.current, target, 2.15, delta)
    if (coverRef.current) {
      coverRef.current.rotation.z = openAmount.current * Math.PI * 0.93
    }
  })

  const pageY = NOTEBOOK.cover + NOTEBOOK.pages / 2
  const coverHingeY = NOTEBOOK.cover + NOTEBOOK.pages

  return (
    <Hotspot disabled={pageInteractive} label="Resume notebook" onSelect={onOpenPage}>
      <group position={[0, 0, 0]}>
        <RoundedBox
          args={[NOTEBOOK.width, NOTEBOOK.cover, NOTEBOOK.depth]}
          radius={0.03}
          smoothness={4}
          position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]}
          castShadow
          receiveShadow
        >
          <primitive object={insideMaterial} attach="material" />
        </RoundedBox>

        <mesh
          position={[NOTEBOOK.width / 2 + 0.02, pageY, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[NOTEBOOK.width - 0.08, NOTEBOOK.pages, NOTEBOOK.depth - 0.08]} />
          <meshStandardMaterial map={paperMap} roughness={0.95} color="#f4efe3" />
        </mesh>

        <group ref={coverRef} position={[0, coverHingeY, 0]}>
          <mesh
            position={[NOTEBOOK.width / 2, NOTEBOOK.cover / 2, 0]}
            castShadow
            receiveShadow
          >
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
          <primitive object={spineMaterial} attach="material" />
        </mesh>

        {opened ? (
          <Html
            transform
            occlude={false}
            position={[NOTEBOOK.width / 2 + 0.02, coverHingeY + 0.002, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.00355}
            pointerEvents={pageInteractive ? 'auto' : 'none'}
            zIndexRange={[20, 0]}
          >
            <div
              className="lined-paper notebook-page"
              onPointerDown={(event) => event.stopPropagation()}
              onWheel={(event) => event.stopPropagation()}
            >
              <Resume variant="paper" />
            </div>
          </Html>
        ) : null}
      </group>
    </Hotspot>
  )
}
