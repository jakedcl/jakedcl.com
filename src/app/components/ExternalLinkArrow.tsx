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
        d="M6 10 7.9 8.1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.9 8.1H11.1M7.9 8.1V3.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}