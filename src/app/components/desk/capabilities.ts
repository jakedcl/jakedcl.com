export function canUseWebGL() {
  if (typeof document === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isCompactViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px)').matches
}
