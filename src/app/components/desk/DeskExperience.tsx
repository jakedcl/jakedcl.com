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

  useEffect(() => {
    const allow3d = canUseWebGL() && !prefersReducedMotion() && !isCompactViewport()
    setMode(allow3d ? '3d' : '2d')
  }, [])

  useEffect(() => {
    if (mode !== '3d') return

    if (skipIntro) {
      setOpened(true)
      setShot('page')
      setIntroDone(true)
      setArrived(false)
      return
    }

    const zoom = window.setTimeout(() => setShot('cover'), 400)
    const open = window.setTimeout(() => {
      setOpened(true)
      setShot('page')
    }, 3100)
    const done = window.setTimeout(() => setIntroDone(true), 5400)

    return () => {
      window.clearTimeout(zoom)
      window.clearTimeout(open)
      window.clearTimeout(done)
    }
  }, [mode, skipIntro])

  const onSelectShot = useCallback((next: ShotName) => {
    setShot(next)
    setArrived(false)
    if (next === 'page') setOpened(true)
    if (next !== 'page' && next !== 'cover' && next !== 'intro') {
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
    <CanvasErrorBoundary fallback={fallback}>
      <div className="relative h-svh overflow-hidden bg-[#b7a48d]">
        <DeskScene
          shot={shot}
          opened={opened}
          pageInteractive={pageInteractive}
          hotspotsActive={hotspotsActive}
          orbitEnabled={orbitEnabled}
          projects={projects}
          photos={photos}
          onSelectShot={onSelectShot}
          onCameraArrived={() => setArrived(true)}
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
