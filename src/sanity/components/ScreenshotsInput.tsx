'use client'

import imageUrlBuilder from '@sanity/image-url'
import { useMemo } from 'react'
import { type ArrayOfObjectsInputProps, useClient } from 'sanity'

/**
 * Film window on the site is 4:3 (112×149 world px inside the sprockets).
 * Keep this in sync with FRAME_ASPECT in the filmstrip.
 */
const FRAME_W = 4
const FRAME_H = 3

type Shot = {
  _key?: string
  alt?: string
  asset?: { _ref?: string; _id?: string }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

function frameUrl(builder: ReturnType<typeof imageUrlBuilder>, shot: Shot) {
  if (!shot?.asset?._ref && !shot?.asset?._id) return ''
  try {
    return builder.image(shot).width(640).height(480).fit('crop').auto('format').url()
  } catch {
    return ''
  }
}

/**
 * Default array input, plus a crop preview that matches the filmstrip window
 * so a hotspot lines up with what the homepage will show.
 */
export function ScreenshotsInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: '2025-09-08' })
  const builder = useMemo(() => imageUrlBuilder(client), [client])
  const shots = ((props.value as Shot[] | undefined) ?? []).slice(0, 2)

  return (
    <div>
      {props.renderDefault(props)}
      <p
        style={{
          margin: '14px 0 8px',
          fontSize: 12,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#6b6860',
        }}
      >
        Filmstrip preview — each window is 4:3, cover-cropped with the hotspot
      </p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
        {[0, 1].map((i) => {
          const shot = shots[i]
          const url = shot ? frameUrl(builder, shot) : ''
          return (
            <div key={shot?._key ?? i} style={{ flex: '1 1 0', minWidth: 0, maxWidth: 280 }}>
              <div
                style={{
                  background: '#08080a',
                  padding: '10px 8px',
                }}
              >
                <div
                  style={{
                    aspectRatio: `${FRAME_W} / ${FRAME_H}`,
                    background: '#000',
                    overflow: 'hidden',
                  }}
                >
                  {url ? (
                    // Studio preview only — not the public site.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={shot?.alt || `Screenshot ${i + 1}`}
                      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : null}
                </div>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 11, color: '#6b6860' }}>
                {url ? `Frame ${i + 1}` : `Frame ${i + 1} — empty`}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
