'use client'

import { Suspense, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
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
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} castShadow />
      <directionalLight position={[-2, 2, -3]} intensity={0.3} />
      <FloatingNotebook opened={opened} onOpen={onOpen} onClose={onClose} />
      <ContactShadows
        position={[0, -0.22, 0]}
        opacity={0.28}
        scale={3.2}
        blur={2.4}
        far={1.1}
        color="#171717"
      />
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
