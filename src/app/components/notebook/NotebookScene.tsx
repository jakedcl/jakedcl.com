'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Notebook from './Notebook'

function FloatingNotebook({
  opened,
  onOpen,
  onClose,
}: {
  opened: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = Math.sin(t * 0.55) * 0.04
    group.current.rotation.y = Math.sin(t * 0.35) * 0.06
    group.current.rotation.x = Math.sin(t * 0.28) * 0.03
  })

  return (
    <group ref={group}>
      <Notebook
        opened={opened}
        pageInteractive={opened}
        interactive={!opened}
        onOpenPage={onOpen}
        onClosePage={onClose}
      />
    </group>
  )
}

function SceneContents({
  opened,
  onOpen,
  onClose,
}: {
  opened: boolean
  onOpen: () => void
  onClose: () => void
}) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={1.25} />
      <directionalLight position={[-2, 2, -3]} intensity={0.35} />
      <FloatingNotebook opened={opened} onOpen={onOpen} onClose={onClose} />
    </>
  )
}

export default function NotebookScene({
  opened,
  onOpen,
  onClose,
}: {
  opened: boolean
  onOpen: () => void
  onClose: () => void
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.35, 2.65], fov: 32, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMappingExposure = 1.15
      }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <SceneContents opened={opened} onOpen={onOpen} onClose={onClose} />
      </Suspense>
    </Canvas>
  )
}
