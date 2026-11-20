/** Inline up-right arrow for external content links (decorative; in code). */
export default function ExternalLinkArrow() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      className="content-link-external-arrow"
      aria-hidden
    >
      <path
        d="M3 9 9 3"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="nonScalingStroke"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4.5 3H9V7.5"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="nonScalingStroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}