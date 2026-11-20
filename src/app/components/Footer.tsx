export default function Footer({ text }: { text: string }) {
  if (!text) return null
  return (
    <footer className="mt-10 pt-3 sm:mt-12 sm:pt-4">
      <p className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
        {text}
      </p>
    </footer>
  )
}
