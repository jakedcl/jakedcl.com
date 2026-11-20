/**
 * Shown only when Sanity cannot be reached, so this text cannot come from Studio.
 * It is one of the few strings allowed to live in code.
 */
import { portfolioBody, portfolioSpaceSection } from '@/lib/portfolioUi'

export default function LoadError({ children }: { children: string }) {
  return (
    <p role="alert" className={`${portfolioSpaceSection} ${portfolioBody}`}>
      {children}
    </p>
  )
}

export const PAGE_LOAD_ERROR = 'The page copy could not load. Refresh to try again.'
export const WORK_LOAD_ERROR = 'Work could not load. Refresh the page to try again.'
