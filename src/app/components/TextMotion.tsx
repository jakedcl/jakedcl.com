'use client'

import type { ReactNode } from 'react'
import { ScrollFocusProvider } from './ScrollFocus'

/** Wraps resume text blocks with gentle scroll-linked scale/opacity */
export default function TextMotion({ children }: { children: ReactNode }) {
  return <ScrollFocusProvider>{children}</ScrollFocusProvider>
}
