import { getHome, getSite, type Site } from '@/lib/content'
import BioCopy from '../components/BioCopy'
import FeaturedProjects from '../components/FeaturedProjects'
import LoadError, { PAGE_LOAD_ERROR } from '../components/LoadError'

export const revalidate = 60

export default async function HomePage() {
  const [site, home] = await Promise.all([getSite(), getHome()])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(site)) }}
      />
      <div className="home-fit">
        {site.name ? <p className="mt-3 text-sm text-ink/70 sm:mt-4">{site.name}</p> : null}
        {site.tagline ? (
          <p className="font-utility mt-1 text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">{site.tagline}</p>
        ) : null}

        {site.loadError || home.loadError ? <LoadError>{PAGE_LOAD_ERROR}</LoadError> : null}

        {home.bio.length > 0 ? (
          <div className="home-bio mt-1.5 space-y-2.5 text-[0.95rem] leading-relaxed text-ink/90 sm:mt-2 md:text-base">
            <BioCopy blocks={home.bio} newTabNote={site.newTabNote} />
          </div>
        ) : null}

        {home.featured.length > 0 ? (
          <FeaturedProjects label={home.featureLabel} projects={home.featured} />
        ) : null}

      </div>
    </>
  )
}

function structuredData(site: Site) {
  const email = site.footerLinks.find((link) => link.href.startsWith('mailto:'))
  const telephone = site.footerLinks.find((link) => link.href.startsWith('tel:'))
  const sameAs = site.footerLinks.map((link) => link.href).filter((href) => href.startsWith('http'))

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...(site.siteUrl ? { url: site.siteUrl } : {}),
    ...(site.name ? { name: site.name } : {}),
    ...(email ? { email: email.href.slice('mailto:'.length) } : {}),
    ...(telephone ? { telephone: telephone.href.slice('tel:'.length) } : {}),
    ...(site.personSummary ? { description: site.personSummary } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}
