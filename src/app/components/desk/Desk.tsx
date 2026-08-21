'use client'

import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Desk() {
  const wood = useTexture('/desk/desk-wood.jpg')
  wood.colorSpace = THREE.SRGBColorSpace
  wood.wrapS = THREE.RepeatWrapping
  wood.wrapT = THREE.RepeatWrapping
  wood.repeat.set(2.4, 1.6)
  wood.anisotropy = 8

  return (
    <group>
      <mesh position={[0.25, -0.07, 0.1]} receiveShadow castShadow>
        <boxGeometry args={[7.4, 0.14, 4.6]} />
        <meshStandardMaterial map={wood} roughness={0.82} metalness={0.02} />
      </mesh>
      <mesh position={[-3.15, -0.55, 1.9]} castShadow>
        <boxGeometry args={[0.16, 0.82, 0.16]} />
        <meshStandardMaterial map={wood} roughness={0.8} />
      </mesh>
      <mesh position={[3.55, -0.55, 1.9]} castShadow>
        <boxGeometry args={[0.16, 0.82, 0.16]} />
        <meshStandardMaterial map={wood} roughness={0.8} />
      </mesh>
      <mesh position={[-3.15, -0.55, -1.7]} castShadow>
        <boxGeometry args={[0.16, 0.82, 0.16]} />
        <meshStandardMaterial map={wood} roughness={0.8} />
      </mesh>
      <mesh position={[3.55, -0.55, -1.7]} castShadow>
        <boxGeometry args={[0.16, 0.82, 0.16]} />
        <meshStandardMaterial map={wood} roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.96, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#8d7d6c" roughness={1} />
      </mesh>
    </group>
  )
}
