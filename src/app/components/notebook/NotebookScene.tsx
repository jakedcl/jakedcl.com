'use client'

import { Suspense, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Notebook from './Notebook'
import NotebookCamera, { CORNER_VIEW } from './NotebookCamera'
import { coverScreenPosition, worldOffsetForScreenPoint } from './stage'

function NotebookStage({
  progress,
  opened,
  onOpen,
  onClose,
}: {
  progress: number
  opened: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const { camera, size } = useThree()

  useFrame(() => {
    if (!group.current) return
    const screen = coverScreenPosition(progress, size)
    const offset = worldOffsetForScreenPoint(camera, size, screen.x, screen.y)
    group.current.position.set(offset.x, offset.y, 0)
  })

  const iconMode = progress < 0.04 && !opened

  return (
    <group ref={group}>
      <Notebook
        openAmount={progress}
        interactive={iconMode}
        pageInteractive={opened && progress > 0.65}
        onPress={onOpen}
        onClosePage={onClose}
      />
      {progress > 0.15 && (
        <ContactShadows
          position={[0, -0.22, 0]}
          opacity={0.16 * progress}
          scale={3.2}
          blur={2.4}
          far={1.1}
          color="#171717"
        />
      )}
    </group>
  )
}

export default function NotebookScene({
  progress,
  opened,
  onOpen,
  onClose,
}: {
  progress: number
  opened: boolean
  onOpen: () => void
  onClose: () => void
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
      onCreated={({ camera, gl }) => {
        camera.lookAt(CORNER_VIEW.target)
        gl.setClearColor(0x000000, 0)
        gl.toneMappingExposure = 1.15
      }}
      style={{ background: 'transparent', width: '100%', height: '100%', display: 'block' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.92} />
        <directionalLight position={[2, 4, 5]} intensity={1.2} />
        <directionalLight position={[-1.5, 2, 2]} intensity={0.35} />
        <NotebookCamera progress={progress} />
        <NotebookStage
          progress={progress}
          opened={opened}
          onOpen={onOpen}
          onClose={onClose}
        />
      </Suspense>
    </Canvas>
  )
}
