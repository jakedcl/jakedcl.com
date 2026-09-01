'use client'

import { Suspense, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Notebook from './Notebook'
import NotebookCamera, { CORNER_VIEW } from './NotebookCamera'

const ICON_SCALE = 0.62

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
    const t = state.clock.elapsedTime
    const p = THREE.MathUtils.clamp(progress, 0, 1)
    const iconMode = p < 0.02

    group.current.scale.setScalar(THREE.MathUtils.lerp(ICON_SCALE, 1, p))

    if (iconMode) {
      group.current.position.y = Math.sin(t * 0.55) * 0.024
      group.current.rotation.set(
        Math.sin(t * 0.4) * 0.015,
        Math.sin(t * 0.35) * 0.02,
        Math.sin(t * 0.45) * 0.015,
      )
      return
    }

    group.current.position.y = 0
    group.current.rotation.set(0, 0, 0)
  })

  const iconMode = progress < 0.02

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
