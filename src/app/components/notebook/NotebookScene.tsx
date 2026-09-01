'use client'

import { Suspense, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Notebook from './Notebook'
import NotebookCamera, { CORNER_VIEW, type NotebookView } from './NotebookCamera'

function FloatingNotebook({
  view,
  opened,
  onCornerClick,
  onClosePage,
}: {
  view: NotebookView
  opened: boolean
  onCornerClick: () => void
  onClosePage: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const tilt = useRef({ x: -0.07, y: 0.18, z: 0.11 })

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    if (view === 'corner' && !opened) {
      group.current.position.y = Math.sin(t * 0.55) * 0.04
      group.current.rotation.x = tilt.current.x + Math.sin(t * 0.33) * 0.02
      group.current.rotation.y = tilt.current.y + Math.sin(t * 0.35) * 0.04
      group.current.rotation.z = tilt.current.z + Math.sin(t * 0.4) * 0.025
      return
    }

    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, 0, 4, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0, 4, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0, 4, delta)
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, 0, 4, delta)
  })

  return (
    <group ref={group}>
      <Notebook
        opened={opened}
        pageInteractive={opened}
        interactive={view === 'corner' && !opened}
        onOpenPage={onCornerClick}
        onClosePage={onClosePage}
      />
    </group>
  )
}

function SceneContents({
  view,
  opened,
  onCornerClick,
  onClosePage,
}: {
  view: NotebookView
  opened: boolean
  onCornerClick: () => void
  onClosePage: () => void
}) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} castShadow />
      <directionalLight position={[-2, 2, -3]} intensity={0.3} />
      <NotebookCamera view={view} />
      <FloatingNotebook
        view={view}
        opened={opened}
        onCornerClick={onCornerClick}
        onClosePage={onClosePage}
      />
      {view !== 'corner' && (
        <ContactShadows
          position={[0, -0.22, 0]}
          opacity={0.22}
          scale={3.2}
          blur={2.4}
          far={1.1}
          color="#171717"
        />
      )}
    </>
  )
}

export default function NotebookScene({
  view,
  opened,
  onCornerClick,
  onClosePage,
}: {
  view: NotebookView
  opened: boolean
  onCornerClick: () => void
  onClosePage: () => void
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{
        position: CORNER_VIEW.position.toArray(),
        fov: CORNER_VIEW.fov,
        near: 0.1,
        far: 40,
      }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMappingExposure = 1.15
      }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <SceneContents
          view={view}
          opened={opened}
          onCornerClick={onCornerClick}
          onClosePage={onClosePage}
        />
      </Suspense>
    </Canvas>
  )
}
