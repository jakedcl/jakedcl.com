import PortfolioChrome from '@/app/components/PortfolioChrome'
import { getSite } from '@/lib/content'
import { sectionNavItems } from '@/lib/sections'

export const revalidate = 60

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const site = await getSite()

  return (
    <div className="min-h-screen bg-background text-ink">
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-[max(1.75rem,env(safe-area-inset-top))] sm:pt-14">
        <PortfolioChrome
          heroTitle={site.bigTitle}
          navItems={sectionNavItems(site.nav)}
          navAriaLabel={site.navAriaLabel}
        >
          {children}
        </PortfolioChrome>
      </main>
    </div>
  )
}
