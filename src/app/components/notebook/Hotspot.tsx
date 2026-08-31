'use client'

import { useState, type ReactNode } from 'react'
import { useCursor } from '@react-three/drei'

export default function Hotspot({
  children,
  disabled,
  label,
  onSelect,
}: {
  children: ReactNode
  disabled?: boolean
  label: string
  onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && !disabled)

  return (
    <group
      userData={{ name: label }}
      onClick={(event) => {
        event.stopPropagation()
        if (!disabled) onSelect()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        if (!disabled) setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  )
}
