'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center bg-background px-5 text-ink">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        This page did not load
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-ink/75">
        Something broke while rendering the portfolio. Refresh, or try again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 w-fit underline decoration-ink/30 underline-offset-[3px] hover:text-signal-blue hover:decoration-signal-blue"
      >
        Try again
      </button>
    </main>
  )
}
