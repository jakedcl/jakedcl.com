export type FocusIntensity = 'subtle' | 'normal'

export type FocusPreset = {
  scaleMin: number
  scaleMax: number
  opacityMin: number
  opacityMax: number
  falloff: number
}

/** Gentle presets for readable text only — scale + opacity, no distortion */
export const FOCUS_PRESETS: Record<FocusIntensity, FocusPreset> = {
  subtle: {
    scaleMin: 0.985,
    scaleMax: 1.008,
    opacityMin: 0.9,
    opacityMax: 1,
    falloff: 0.55,
  },
  normal: {
    scaleMin: 0.97,
    scaleMax: 1.015,
    opacityMin: 0.78,
    opacityMax: 1,
    falloff: 0.6,
  },
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function easeFocus(t: number) {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

export function computeFocusStyle(
  element: HTMLElement,
  preset: FocusPreset,
  viewportHeight: number,
) {
  const rect = element.getBoundingClientRect()
  const elementCenter = rect.top + rect.height / 2
  const viewportCenter = viewportHeight / 2
  const distance = Math.abs(elementCenter - viewportCenter)
  const maxDistance = viewportHeight * preset.falloff
  const t = easeFocus(distance / maxDistance)

  const scale = lerp(preset.scaleMax, preset.scaleMin, t)
  const opacity = lerp(preset.opacityMax, preset.opacityMin, t)

  return {
    scale,
    opacity,
    transform: `scale(${scale.toFixed(4)})`,
  }
}
