/**
 * Opaque shell so the portfolio paper grain never shows under Sanity Studio.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[1] overflow-auto bg-white">
      {children}
    </div>
  );
}
