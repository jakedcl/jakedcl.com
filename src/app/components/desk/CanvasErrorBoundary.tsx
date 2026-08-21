'use client'

import { Component, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback: ReactNode
}

export default class CanvasErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
