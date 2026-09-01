'use client'

import { Suspense, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Notebook from './Notebook'
import NotebookCamera, { CORNER_VIEW } from './NotebookCamera'
import { cornerCenterWorld } from './iconLayout'

const ICON_SCALE = 0.22

function FloatingNotebook({
  progress,
  opened,
  onCornerClick,
  onClosePage,
}: {
  progress: number
  opened: boolean
  onCornerClick: () => void
  onClosePage: () => void
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = THREE.MathUtils.clamp(progress, 0, 1)
    const clock = state.clock.elapsedTime
    const wobble = 1 - t

    group.current.scale.setScalar(THREE.MathUtils.lerp(ICON_SCALE, 1, t))

    const { width, height } = state.viewport
    group.current.position.x = (1 - t) * (width / 2 - CORNER_MARGIN_X)
    group.current.position.y =
      (1 - t) * (-(height / 2 - CORNER_MARGIN_Y)) + Math.sin(clock * 0.55) * 0.024 * wobble

    group.current.rotation.x = Math.sin(clock * 0.4) * 0.015 * wobble
    group.current.rotation.y = Math.sin(clock * 0.35) * 0.02 * wobble
    group.current.rotation.z = Math.sin(clock * 0.45) * 0.015 * wobble
  })

  const iconMode = progress < 0.04 && !opened

  return (
    <group ref={group}>
      <Notebook
        progress={progress}
        pageInteractive={opened && progress > 0.72}
        interactive={iconMode}
        onOpenPage={onCornerClick}
        onClosePage={onClosePage}
      />
    </group>
  )
}

function SceneContents({
  progress,
  opened,
  onCornerClick,
  onClosePage,
}: {
  progress: number
  opened: boolean
  onCornerClick: () => void
  onClosePage: () => void
}) {
  return (
    <>
      <ambientLight intensity={0.92} />
      <directionalLight position={[2, 4, 5]} intensity={1.2} />
      <directionalLight position={[-1.5, 2, 2]} intensity={0.35} />
      <NotebookCamera progress={progress} />
      <FloatingNotebook
        progress={progress}
        opened={opened}
        onCornerClick={onCornerClick}
        onClosePage={onClosePage}
      />
      {progress > 0.2 && (
        <ContactShadows
          position={[0, -0.22, 0]}
          opacity={0.18 * progress}
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
  progress,
  opened,
  onCornerClick,
  onClosePage,
}: {
  progress: number
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
      style={{ background: 'transparent', width: '100%', height: '100%', display: 'block' }}
    >
      <Suspense fallback={null}>
        <SceneContents
          progress={progress}
          opened={opened}
          onCornerClick={onCornerClick}
          onClosePage={onClosePage}
        />
      </Suspense>
    </Canvas>
  )
}
