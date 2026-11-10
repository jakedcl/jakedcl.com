/** Screen-reader note after links that open a new tab. Text from Studio > Site-wide. */
export default function NewTabNote({ note }: { note: string }) {
  if (!note) return null
  return <span className="sr-only">{` ${note}`}</span>
}
