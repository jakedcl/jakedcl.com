import type { ReactNode } from 'react'

import Footer from './Footer'
import LoadError, { PAGE_LOAD_ERROR } from './LoadError'

export default function SectionPageShell({
  loadError,
  footer,
  children,
}: {
  loadError: boolean
  footer: string
  children: ReactNode
}) {
  return (
    <>
      {loadError ? <LoadError>{PAGE_LOAD_ERROR}</LoadError> : null}
      <div className="mt-14">{children}</div>
      <Footer text={footer} />
    </>
  )
}
