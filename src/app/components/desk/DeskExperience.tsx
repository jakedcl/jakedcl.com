'use client'

import { useCallback, useEffect, useState } from 'react'
import TwoDPortfolio from '../TwoDPortfolio'
import CanvasErrorBoundary from './CanvasErrorBoundary'
import { canUseWebGL, isCompactViewport, prefersReducedMotion } from './capabilities'
import DeskHud from './DeskHud'
import DeskScene from './DeskScene'
import { canOrbit } from './CameraRig'
import type { ShotName } from './types'
import type { Project, SanityImage } from '@/types/sanity'

type Mode = 'boot' | '3d' | '2d'

export default function DeskExperience({
  projects,
  photos,
}: {
  projects: Project[]
  photos: SanityImage[]
}) {
  const [mode, setMode] = useState<Mode>('boot')
  const [shot, setShot] = useState<ShotName>('intro')
  const [opened, setOpened] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [arrived, setArrived] = useState(false)
  const [skipIntro, setSkipIntro] = useState(false)
  const [snapCamera, setSnapCamera] = useState(false)

  useEffect(() => {
    const decide = () => {
      const allow3d = canUseWebGL() && !isCompactViewport()
      if (prefersReducedMotion()) {
        setSkipIntro(true)
        setShot('desk')
        setIntroDone(true)
        setSnapCamera(true)
      }
      setMode(allow3d ? '3d' : '2d')
    }

    const frame = window.requestAnimationFrame(decide)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (mode !== '3d') return

    if (skipIntro) {
      setShot('desk')
      setIntroDone(true)
      setOpened(false)
      setArrived(false)
      setSnapCamera(true)
      return
    }

    const toAerial = window.setTimeout(() => setShot('aerial'), 120)
    const toDesk = window.setTimeout(() => {
      setShot('desk')
      setIntroDone(true)
      setArrived(false)
    }, 3950)

    return () => {
      window.clearTimeout(toAerial)
      window.clearTimeout(toDesk)
    }
  }, [mode, skipIntro])

  const onSelectShot = useCallback((next: ShotName) => {
    setShot(next)
    setArrived(false)
    if (next === 'page') setOpened(true)
    if (next !== 'page' && next !== 'cover' && next !== 'intro' && next !== 'aerial') {
      setIntroDone(true)
    }
  }, [])

  const fallback = (
    <TwoDPortfolio
      projects={projects}
      photos={photos}
      banner={
        canUseWebGL() ? (
          <div className="flex items-center justify-end gap-3 px-4 py-3 text-sm">
            <button
              type="button"
              className="underline underline-offset-2"
              onClick={() => {
                setSkipIntro(true)
                setMode('3d')
              }}
            >
              Enter 3D desk
            </button>
          </div>
        ) : null
      }
    />
  )

  if (mode === 'boot') {
    return <div className="h-svh bg-[#b7a48d]" aria-hidden />
  }

  if (mode === '2d') {
    return fallback
  }

  const pageInteractive = shot === 'page' && introDone
  const hotspotsActive = introDone
  const orbitEnabled = introDone && arrived && canOrbit(shot)

  return (
    <CanvasErrorBoundary key={mode} fallback={fallback}>
      <div className="relative h-svh overflow-hidden bg-[#b7a48d]">
        <DeskScene
          shot={shot}
          opened={opened}
          pageInteractive={pageInteractive}
          hotspotsActive={hotspotsActive}
          orbitEnabled={orbitEnabled}
          snapCamera={snapCamera}
          projects={projects}
          photos={photos}
          onSelectShot={onSelectShot}
          onCameraArrived={() => {
            setArrived(true)
            setSnapCamera(false)
          }}
        />
        <DeskHud
          shot={shot}
          introDone={introDone}
          projects={projects}
          photos={photos}
          onSkip={() => setSkipIntro(true)}
          onSelectShot={onSelectShot}
        />
      </div>
    </CanvasErrorBoundary>
  )
}
