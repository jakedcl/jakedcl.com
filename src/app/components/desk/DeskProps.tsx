'use client'

import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { portableTextToPlain } from '@/lib/portableText'
import type { Project, SanityImage } from '@/types/sanity'
import Hotspot from './Hotspot'
import type { ShotName } from './types'

function Folder({
  position,
  rotation,
  title,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  title: string
}) {
  const folderMap = useTexture('/desk/folder-yellow.jpg')
  folderMap.colorSpace = THREE.SRGBColorSpace

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow position={[0, 0.012, 0]}>
        <boxGeometry args={[0.72, 0.012, 0.95]} />
        <meshStandardMaterial map={folderMap} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.02, 0.03, -0.02]} rotation={[-0.12, 0, 0.04]}>
        <boxGeometry args={[0.72, 0.012, 0.95]} />
        <meshStandardMaterial map={folderMap} roughness={0.88} />
      </mesh>
      <mesh position={[0.18, 0.05, -0.42]}>
        <boxGeometry args={[0.28, 0.01, 0.16]} />
        <meshStandardMaterial map={folderMap} roughness={0.9} />
      </mesh>
      <Html position={[0, 0.08, 0.1]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <span className="desk-label">{title}</span>
      </Html>
    </group>
  )
}

function Polaroid({
  position,
  rotation,
  map,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  map: THREE.Texture
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.58, 0.012, 0.7]} />
        <meshStandardMaterial color="#f7f7f3" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.008, 0.04]}>
        <planeGeometry args={[0.48, 0.48]} />
        <meshStandardMaterial map={map} color="#ece6d8" roughness={0.7} />
      </mesh>
    </group>
  )
}

function Pencil({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.42, 8]} />
        <meshStandardMaterial color="#f2c14e" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.185, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.05, 8]} />
        <meshStandardMaterial color="#e89aa8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.155, 0]}>
        <cylinderGeometry args={[0.019, 0.019, 0.02, 8]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.22, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.018, 0.06, 8]} />
        <meshStandardMaterial color="#e8d3b0" roughness={0.8} />
      </mesh>
    </group>
  )
}

function PencilCup({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.11, 0.22, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.45} roughness={0.35} />
      </mesh>
      <Pencil position={[0.02, 0.22, 0.02]} rotation={[0.12, 0.2, 0.08]} />
      <Pencil position={[-0.03, 0.2, -0.02]} rotation={[-0.1, -0.3, 0.05]} />
      <Pencil position={[0.01, 0.24, -0.04]} rotation={[0.05, 0.8, -0.1]} />
      <Pencil position={[-0.01, 0.18, 0.04]} rotation={[-0.18, 0.4, 0.12]} />
    </group>
  )
}

function CrayonBox({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.18, 0.42]} />
        <meshStandardMaterial color="#ffd54a" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.095, 0]}>
        <boxGeometry args={[0.62, 0.01, 0.34]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.6} />
      </mesh>
    </group>
  )
}

function Glue({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.06, 12]} />
        <meshStandardMaterial color="#f97316" roughness={0.4} />
      </mesh>
    </group>
  )
}

export default function DeskProps({
  projects,
  photos,
  interactive,
  onSelectShot,
}: {
  projects: Project[]
  photos: SanityImage[]
  interactive: boolean
  onSelectShot: (shot: ShotName) => void
}) {
  const [ruler, polaroidMap] = useTexture(['/desk/ruler.jpg', '/desk/paper-cream.jpg'])
  ruler.colorSpace = THREE.SRGBColorSpace
  polaroidMap.colorSpace = THREE.SRGBColorSpace

  const folderProjects = projects.slice(0, 3)
  // Blank frames only — never TextureLoader/useTexture on cdn.sanity.io (CORS).
  // Real gallery photos render in the HUD via <img>.
  const polaroidCount = Math.min(4, Math.max(3, photos.length || 3))
  const folderTitles = folderProjects.map((project) => portableTextToPlain(project.title) || 'Project')

  return (
    <group>
      <Hotspot disabled={!interactive} label="Projects" onSelect={() => onSelectShot('projects')}>
        <group>
          {(folderTitles.length ? folderTitles : ['Projects']).map((title, index) => (
            <Folder
              key={`${title}-${index}`}
              title={index === 0 ? 'Projects' : title}
              position={[-1.55 - index * 0.08, 0, 0.72 + index * 0.12]}
              rotation={[0, 0.18 + index * 0.08, 0]}
            />
          ))}
        </group>
      </Hotspot>

      <Hotspot disabled={!interactive} label="Photos" onSelect={() => onSelectShot('gallery')}>
        <group>
          {Array.from({ length: polaroidCount }, (_, index) => (
            <Polaroid
              key={`polaroid-${index}`}
              map={polaroidMap}
              position={[1.55 + (index % 2) * 0.55, 0.01, -0.45 - Math.floor(index / 2) * 0.62]}
              rotation={[0, 0.18 - index * 0.12, 0]}
            />
          ))}
        </group>
      </Hotspot>

      <Hotspot disabled={!interactive} label="Contact" onSelect={() => onSelectShot('contact')}>
        <PencilCup position={[1.58, 0.11, 1.18]} />
      </Hotspot>

      <mesh position={[-0.15, 0.012, 1.38]} rotation={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.05, 0.02, 0.22]} />
        <meshStandardMaterial map={ruler} roughness={0.7} />
      </mesh>

      <CrayonBox position={[-1.85, 0.09, -0.7]} />
      <Glue position={[2.2, 0.1, 0.45]} />
      <mesh position={[1.12, 0.02, 1.38]} castShadow>
        <boxGeometry args={[0.16, 0.04, 0.08]} />
        <meshStandardMaterial color="#f4b8c5" roughness={0.85} />
      </mesh>
      <mesh position={[1.28, 0.02, 1.32]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.16, 0.04, 0.08]} />
        <meshStandardMaterial color="#f4b8c5" roughness={0.85} />
      </mesh>
      <Pencil position={[0.22, 0.02, 1.18]} rotation={[Math.PI / 2, 0, 0.6]} />
      <Pencil position={[0.48, 0.02, 1.28]} rotation={[Math.PI / 2, 0, -0.35]} />
    </group>
  )
}
