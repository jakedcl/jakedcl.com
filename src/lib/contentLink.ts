/** Portfolio interactive targets; --content-link-hover is set by LinkHoverCycle. */
export const contentLinkClass =
  'content-link underline decoration-ink/30 underline-offset-[3px] transition-colors'

/** Same hover cycle, without underline (e.g. photo wraps). */
export const contentLinkBareClass = 'content-link transition-colors'

/** Block row: fully clickable, underline/hover accent on `.content-link-mark` only. */
export const contentLinkRowClass =
  'content-link content-link-row transition-colors no-underline'

export const contentLinkMarkClass = 'content-link-mark transition-colors'

/** External URL with label + inline SVG arrow; underline on `.content-link-external-mark`. */
export const contentLinkExternalAnchorClass =
  'content-link content-link-external no-underline transition-colors'

export const contentLinkExternalMarkClass =
  'content-link-external-mark transition-colors'