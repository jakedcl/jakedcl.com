'use client'

import { Suspense, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Notebook from './Notebook'
import NotebookCamera, { CORNER_VIEW } from './NotebookCamera'

const ICON_SCALE = 0.46

function FloatingNotebook({
  prominence,
  opened,
  onCornerClick,
  onClosePage,
}: {
  prominence: number
  opened: boolean
  onCornerClick: () => void
  onClosePage: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const tilt = useRef({ x: -0.09, y: 0.22, z: 0.14 })

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const iconMode = prominence < 0.08 && !opened

    const targetScale = THREE.MathUtils.lerp(ICON_SCALE, 1, THREE.MathUtils.clamp(prominence, 0, 1))
    const s = THREE.MathUtils.damp(group.current.scale.x, targetScale, 6, delta)
    group.current.scale.setScalar(s)

    if (iconMode) {
      group.current.position.y = Math.sin(t * 0.55) * 0.035
      group.current.rotation.x = tilt.current.x + Math.sin(t * 0.33) * 0.02
      group.current.rotation.y = tilt.current.y + Math.sin(t * 0.35) * 0.045
      group.current.rotation.z = tilt.current.z + Math.sin(t * 0.4) * 0.03
      return
    }

    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, 0, 5, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0, 5, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0, 5, delta)
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, 0, 5, delta)
  })

  const iconMode = prominence < 0.08 && !opened

  return (
    <group ref={group}>
      <Notebook
        opened={opened}
        pageInteractive={opened}
        interactive={iconMode}
        onOpenPage={onCornerClick}
        onClosePage={onClosePage}
      />
    </group>
  )
}

function SceneContents({
  prominence,
  opened,
  onCornerClick,
  onClosePage,
}: {
  prominence: number
  opened: boolean
  onCornerClick: () => void
  onClosePage: () => void
}) {
  const showShadow = prominence > 0.35

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} castShadow />
      <directionalLight position={[-2, 2, -3]} intensity={0.3} />
      <NotebookCamera prominence={prominence} opened={opened} />
      <FloatingNotebook
        prominence={prominence}
        opened={opened}
        onCornerClick={onCornerClick}
        onClosePage={onClosePage}
      />
      {showShadow && (
        <ContactShadows
          position={[0, -0.22, 0]}
          opacity={0.2}
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
  prominence,
  opened,
  onCornerClick,
  onClosePage,
}: {
  prominence: number
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
          prominence={prominence}
          opened={opened}
          onCornerClick={onCornerClick}
          onClosePage={onClosePage}
        />
      </Suspense>
    </Canvas>
  )
}
