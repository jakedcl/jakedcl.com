'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Notebook from './Notebook'

/** Static cover shot — animation/camera rig will plug in here later. */
export const NOTEBOOK_CAMERA = {
  position: new THREE.Vector3(0.26, 1.95, 1.38),
  target: new THREE.Vector3(0.26, 0.07, 0),
  fov: 28,
}

export default function NotebookScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{
        position: NOTEBOOK_CAMERA.position.toArray(),
        fov: NOTEBOOK_CAMERA.fov,
        near: 0.1,
        far: 40,
      }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(NOTEBOOK_CAMERA.target)
        gl.setClearColor(0x000000, 0)
        gl.toneMappingExposure = 1.15
      }}
      style={{ background: 'transparent', width: '100%', height: '100%', display: 'block' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.92} />
        <directionalLight position={[2, 4, 5]} intensity={1.2} />
        <directionalLight position={[-1.5, 2, 2]} intensity={0.35} />
        <Notebook />
      </Suspense>
    </Canvas>
  )
}
