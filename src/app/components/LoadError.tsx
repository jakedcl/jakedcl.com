/**
 * Shown only when Sanity cannot be reached, so this text cannot come from Studio.
 * It is one of the few strings allowed to live in code.
 */
export default function LoadError({ children }: { children: string }) {
  return (
    <p role="alert" className="mt-8 text-sm leading-relaxed text-ink/70">
      {children}
    </p>
  )
}

export const PAGE_LOAD_ERROR = 'The page copy could not load. Refresh to try again.'
export const PROJECTS_LOAD_ERROR = 'Projects could not load. Refresh the page to try again.'
export const CASE_STUDY_LOAD_ERROR = 'The case study could not load. Refresh to try again.'
