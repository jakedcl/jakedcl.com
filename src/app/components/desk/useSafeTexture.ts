'use client'

import { useEffect, useState } from 'react'
import * as THREE from 'three'

export function useSafeTexture(url: string | null, fallbackUrl: string) {
  const [map, setMap] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    let cancelled = false
    let loaded: THREE.Texture | null = null

    const apply = (texture: THREE.Texture) => {
      if (cancelled) {
        texture.dispose()
        return
      }
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 4
      loaded = texture
      setMap(texture)
    }

    loader.load(fallbackUrl, apply)

    if (url && url !== fallbackUrl) {
      loader.load(url, apply, undefined, () => {
        // Keep the local fallback if the remote image fails.
      })
    }

    return () => {
      cancelled = true
      loaded?.dispose()
    }
  }, [url, fallbackUrl])

  return map
}
