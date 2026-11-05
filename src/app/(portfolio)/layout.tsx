import PortfolioChrome from '@/app/components/PortfolioChrome'
import { sectionNavItems } from '@/lib/sections'
import { getHomeContent } from '@/lib/siteContent'

export const revalidate = 60

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const content = await getHomeContent()
  const navItems = sectionNavItems(content)

  return (
    <div className="min-h-screen bg-background text-ink">
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-[max(1.75rem,env(safe-area-inset-top))] sm:pt-14">
        <PortfolioChrome heroTitle={content.heroTitle} navItems={navItems}>
          {children}
        </PortfolioChrome>
      </main>
    </div>
  )
}
