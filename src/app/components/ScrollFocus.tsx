'use client'

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react'
import {
  FOCUS_PRESETS,
  computeFocusStyle,
  type FocusIntensity,
} from '@/lib/scrollFocusMath'

type RegisteredItem = {
  element: HTMLElement
  intensity: FocusIntensity
}

type ScrollFocusContextValue = {
  register: (id: string, element: HTMLElement | null, intensity: FocusIntensity) => void
}

const ScrollFocusContext = createContext<ScrollFocusContextValue | null>(null)

export function ScrollFocusProvider({ children }: { children: ReactNode }) {
  const itemsRef = useRef<Map<string, RegisteredItem>>(new Map())

  const register = (id: string, element: HTMLElement | null, intensity: FocusIntensity) => {
    if (!element) {
      itemsRef.current.delete(id)
      return
    }
    itemsRef.current.set(id, { element, intensity })
  }

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const viewportHeight = window.innerHeight

      itemsRef.current.forEach(({ element, intensity }) => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const mobile = window.matchMedia('(max-width: 767px)').matches

        if (reduced || mobile) {
          element.style.transform = ''
          element.style.opacity = ''
          element.style.filter = ''
          return
        }

        const preset = FOCUS_PRESETS[intensity]
        const { transform, opacity } = computeFocusStyle(
          element,
          preset,
          viewportHeight,
        )

        element.style.transform = transform
        element.style.opacity = opacity.toFixed(3)
        element.style.filter = ''
      })
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <ScrollFocusContext.Provider value={{ register }}>
      {children}
    </ScrollFocusContext.Provider>
  )
}

export function ScrollFocus({
  children,
  intensity = 'normal',
  className = '',
}: {
  children: ReactNode
  intensity?: FocusIntensity
  className?: string
}) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const context = useContext(ScrollFocusContext)

  useEffect(() => {
    if (!context) return
    context.register(id, ref.current, intensity)
    return () => context.register(id, null, intensity)
  }, [context, id, intensity])

  return (
    <div
      ref={ref}
      className={`scroll-focus-item ${className}`.trim()}
      style={{ transformOrigin: 'center center', willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  )
}
