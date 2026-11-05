import { getHomeContent, type HomeContent } from '@/lib/siteContent'
import BioCopy from '../components/BioCopy'

export const revalidate = 60

const linkClass =
  'underline decoration-ink/30 underline-offset-[3px] transition-colors hover:text-signal-blue hover:decoration-signal-blue'

export default async function Home() {
  const content = await getHomeContent()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(content)) }}
      />
      {content.legalName ? (
        <p className="mt-5 text-sm text-ink/70">{content.legalName}</p>
      ) : null}
      {content.tagline ? (
        <p className="font-utility mt-1 text-sm text-ink/60">{content.tagline}</p>
      ) : null}

      {content.loadError ? (
        <p role="alert" className="mt-8 text-sm leading-relaxed text-ink/70">
          The page copy could not load. Refresh to try again.
        </p>
      ) : null}

      {content.bio.length > 0 ? (
        <div className="mt-8 space-y-4 text-[0.95rem] leading-relaxed text-ink/90 md:text-base">
          <BioCopy blocks={content.bio} />
        </div>
      ) : null}

      {content.links.length > 0 ? (
        <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[0.95rem]">
          {content.links.map((link) => {
            const external = link.href.startsWith('http')
            return (
              <a
                key={link._key ?? link.href}
                href={link.href}
                className={linkClass}
                {...(external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {link.label}
                {external ? (
                  <span className="sr-only"> (opens in a new tab)</span>
                ) : null}
              </a>
            )
          })}
        </p>
      ) : null}

      {content.footerText ? (
        <footer className="mt-16 pt-4">
          <p className="font-utility text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
            {content.footerText}
          </p>
        </footer>
      ) : null}
    </>
  )
}

function structuredData(content: HomeContent) {
  const email = content.links.find((link) => link.href.startsWith('mailto:'))
  const telephone = content.links.find((link) => link.href.startsWith('tel:'))
  const sameAs = content.links
    .map((link) => link.href)
    .filter((href) => href.startsWith('http'))

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    url: 'https://jakedcl.com',
    ...(content.legalName ? { name: content.legalName } : {}),
    ...(email ? { email: email.href.slice('mailto:'.length) } : {}),
    ...(telephone ? { telephone: telephone.href.slice('tel:'.length) } : {}),
    ...(content.summary ? { description: content.summary } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}
