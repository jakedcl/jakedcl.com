'use client'

import { Suspense, useMemo } from 'react'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import CameraRig from './CameraRig'
import Desk from './Desk'
import DeskProps from './DeskProps'
import Notebook from './Notebook'
import { shots } from './shots'
import type { ShotName } from './types'
import type { Project, SanityImage } from '@/types/sanity'

function SceneContents({
  shot,
  opened,
  pageInteractive,
  hotspotsActive,
  orbitEnabled,
  snapCamera,
  projects,
  photos,
  onSelectShot,
  onCameraArrived,
}: {
  shot: ShotName
  opened: boolean
  pageInteractive: boolean
  hotspotsActive: boolean
  orbitEnabled: boolean
  snapCamera?: boolean
  projects: Project[]
  photos: SanityImage[]
  onSelectShot: (shot: ShotName) => void
  onCameraArrived: (shot: ShotName) => void
}) {
  const target = useMemo(() => shots[shot].target, [shot])

  return (
    <>
      <color attach="background" args={['#b7a48d']} />
      <fog attach="fog" args={['#b7a48d', 10, 22]} />
      <ambientLight intensity={0.52} />
      <hemisphereLight args={['#f3efe8', '#8d7d6c', 0.7]} />
      <directionalLight
        position={[4.2, 7.2, 3.6]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={18}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <CameraRig shot={shot} orbitEnabled={orbitEnabled} snap={snapCamera} onArrived={onCameraArrived} />
      <OrbitControls
        enabled={orbitEnabled}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.55}
        maxPolarAngle={1.22}
        minDistance={2.4}
        maxDistance={8.2}
        target={target}
      />
      <Desk />
      <Notebook
        opened={opened}
        pageInteractive={pageInteractive}
        interactive={hotspotsActive}
        onOpenPage={() => onSelectShot(shot === 'page' ? 'desk' : 'page')}
        onClosePage={() => onSelectShot('desk')}
      />
      <DeskProps
        projects={projects}
        photos={photos}
        interactive={hotspotsActive}
        onSelectShot={onSelectShot}
      />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.38} scale={9} blur={2.2} far={5} />
    </>
  )
}

export default function DeskScene({
  shot,
  opened,
  pageInteractive,
  hotspotsActive,
  orbitEnabled,
  snapCamera,
  projects,
  photos,
  onSelectShot,
  onCameraArrived,
}: {
  shot: ShotName
  opened: boolean
  pageInteractive: boolean
  hotspotsActive: boolean
  orbitEnabled: boolean
  snapCamera?: boolean
  projects: Project[]
  photos: SanityImage[]
  onSelectShot: (shot: ShotName) => void
  onCameraArrived: (shot: ShotName) => void
}) {
  const start = snapCamera ? shots.desk : shots.intro

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: start.position, fov: start.fov, near: 0.1, far: 40 }}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <SceneContents
          shot={shot}
          opened={opened}
          pageInteractive={pageInteractive}
          hotspotsActive={hotspotsActive}
          orbitEnabled={orbitEnabled}
          snapCamera={snapCamera}
          projects={projects}
          photos={photos}
          onSelectShot={onSelectShot}
          onCameraArrived={onCameraArrived}
        />
      </Suspense>
    </Canvas>
  )
}
