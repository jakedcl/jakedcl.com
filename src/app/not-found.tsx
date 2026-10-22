import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center bg-background px-5 text-ink">
      <h1 className="font-shape text-3xl font-extrabold tracking-tight">
        No page here
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-ink/75">
        That address is not a page or a project short link on this site.
      </p>
      <Link
        href="/"
        className="mt-6 w-fit underline decoration-ink/30 underline-offset-[3px] hover:text-signal-blue hover:decoration-signal-blue"
      >
        Back to the portfolio
      </Link>
    </main>
  )
}
