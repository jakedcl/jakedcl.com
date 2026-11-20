import type { ReactNode } from 'react'

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
      <div className="mt-8 sm:mt-10">{children}</div>
    </>
  )
}
