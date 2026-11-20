import { getHome, getSite, type Site } from '@/lib/content'
import {
  portfolioBody,
  portfolioGapProse,
  portfolioMeta,
  portfolioSpaceRole,
  portfolioSpaceTight,
} from '@/lib/portfolioUi'
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
        {site.name || site.tagline ? (
          <p className={`${portfolioMeta} ${portfolioSpaceRole} max-w-full`}>
            {[site.name, site.tagline].filter(Boolean).join(' · ')}
          </p>
        ) : null}

        {site.loadError || home.loadError ? <LoadError>{PAGE_LOAD_ERROR}</LoadError> : null}

        {home.bio.length > 0 ? (
          <div className={`home-bio ${portfolioBody} ${portfolioGapProse} ${portfolioSpaceTight}`}>
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
