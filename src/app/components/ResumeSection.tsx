'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Resume from './Resume'

const NotebookViewer = dynamic(() => import('./notebook/NotebookViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[4/3] min-h-[min(72vh,520px)] w-full items-center justify-center rounded-lg bg-neutral-100 text-sm text-neutral-500">
      Loading notebook…
    </div>
  ),
})

type Mode = 'text' | 'notebook'

export default function ResumeSection() {
  const [mode, setMode] = useState<Mode>('text')

  return (
    <div>
      <div
        className="mb-5 inline-flex rounded-full border border-neutral-200 bg-neutral-50 p-1 text-sm"
        role="tablist"
        aria-label="Resume view"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'text'}
          className={`rounded-full px-4 py-1.5 transition-colors ${
            mode === 'text' ? 'bg-black text-white' : 'text-neutral-700 hover:text-black'
          }`}
          onClick={() => setMode('text')}
        >
          Text resume
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'notebook'}
          className={`rounded-full px-4 py-1.5 transition-colors ${
            mode === 'notebook' ? 'bg-black text-white' : 'text-neutral-700 hover:text-black'
          }`}
          onClick={() => setMode('notebook')}
        >
          Notebook
        </button>
      </div>

      {mode === 'text' ? <Resume /> : <NotebookViewer />}
    </div>
  )
}
