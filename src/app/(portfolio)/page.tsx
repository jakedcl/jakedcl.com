import { getHome, getSite, type Home, type Site } from '@/lib/content'
import { SHOWCASE_PATH } from '@/lib/routes'
import BioCopy from '../components/BioCopy'
import FeaturedCaseStudy from '../components/FeaturedCaseStudy'
import Footer from '../components/Footer'
import LoadError, { PAGE_LOAD_ERROR } from '../components/LoadError'
import NewTabNote from '../components/NewTabNote'

export const revalidate = 60

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

export default async function HomePage() {
  const [site, home] = await Promise.all([getSite(), getHome()])
  const showFeature =
    home.showFeature && Boolean(site.caseStudyName) && Boolean(home.featureSentence)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(site, home)) }}
      />
      {site.name ? <p className="mt-5 text-sm text-ink/70">{site.name}</p> : null}
      {site.tagline ? (
        <p className="font-utility mt-1 text-sm text-ink/60">{site.tagline}</p>
      ) : null}

      {site.loadError || home.loadError ? <LoadError>{PAGE_LOAD_ERROR}</LoadError> : null}

      {home.bio.length > 0 ? (
        <div className="mt-8 space-y-4 text-[0.95rem] leading-relaxed text-ink/90 md:text-base">
          <BioCopy blocks={home.bio} newTabNote={site.newTabNote} />
        </div>
      ) : null}

      {showFeature ? (
        <FeaturedCaseStudy
          label={home.featureLabel}
          name={site.caseStudyName}
          sentence={home.featureSentence}
          image={home.featureImage}
          linkLabel={home.featureLinkLabel}
          href={SHOWCASE_PATH}
        />
      ) : null}

      {home.links.length > 0 ? (
        <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[0.95rem]">
          {home.links.map((link) => {
            const external = link.href.startsWith('http')
            return (
              <a
                key={link._key ?? link.href}
                href={link.href}
                className={linkClass}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
                {external ? <NewTabNote note={site.newTabNote} /> : null}
              </a>
            )
          })}
        </p>
      ) : null}

      <Footer text={site.footer} />
    </>
  )
}

function structuredData(site: Site, home: Home) {
  const email = home.links.find((link) => link.href.startsWith('mailto:'))
  const telephone = home.links.find((link) => link.href.startsWith('tel:'))
  const sameAs = home.links.map((link) => link.href).filter((href) => href.startsWith('http'))

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
