'use client'

import FloatingNotebookWidget from './FloatingNotebookWidget'

/**
 * Fixed viewport layer for 3D / UI that sits outside the page scroll flow.
 * Keeps WebGL canvases out of <main> so layout and animation stay predictable.
 */
export default function SiteOverlays() {
  return (
    <div id="site-overlays" className="pointer-events-none fixed inset-0 z-50">
      <FloatingNotebookWidget />
    </div>
  )
}
