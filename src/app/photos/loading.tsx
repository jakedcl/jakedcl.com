export default function PhotosLoading() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <header className="border-b-2 border-ink px-4 py-3 md:px-6">
        <p className="font-display text-lg font-extrabold tracking-tight">JAKE DCL</p>
      </header>
      <main className="px-4 py-10 md:px-6 md:py-14">
        <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">PHOTOS</h1>
        <p className="font-utility mt-6 text-sm uppercase tracking-[0.16em] text-ink/40">Loading photos</p>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-[4/3] bg-ink/[0.06]" />
          ))}
        </div>
      </main>
    </div>
  )
}
