import type { ReactNode } from 'react'

import { portfolioSpacePage } from '@/lib/portfolioUi'

import LoadError, { PAGE_LOAD_ERROR } from './LoadError'

export default function SectionPageShell({
  loadError,
  children,
}: {
  loadError: boolean
  children: ReactNode
}) {
  return (
    <>
      {loadError ? <LoadError>{PAGE_LOAD_ERROR}</LoadError> : null}
      <div className={portfolioSpacePage}>{children}</div>
    </>
  )
}
