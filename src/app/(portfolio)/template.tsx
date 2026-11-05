import type { ReactNode } from 'react'

export default function PortfolioPageTransition({
  children,
}: {
  children: ReactNode
}) {
  return <div className="portfolio-page-body">{children}</div>
}
