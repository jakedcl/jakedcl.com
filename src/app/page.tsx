import { client } from '@/sanity/lib/client';
import { projectsQuery, settingsQuery } from '@/sanity/lib/queries';
import { Project, Settings } from '@/types/sanity';
import Image from 'next/image';
import { PortableText } from 'next-sanity';
import ProjectCard from './components/ProjectCard';
import Filmstrip from './components/Filmstrip';

export const revalidate = 0; // Always fetch fresh data

async function getProjects(): Promise<Project[]> {
  return await client.fetch(projectsQuery);
}

async function getSettings(): Promise<Settings | null> {
  return await client.fetch(settingsQuery);
}

export default async function Home() {
  const projects = await getProjects();
  const settings = await getSettings();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jake DCL',
    url: 'https://jakedcl.com',
    jobTitle: 'Web Developer',
    description: 'Portfolio website for Jacob Decore Lurker (Jake DCL).',
    sameAs: [
      'https://github.com/jakedcl',
      'https://www.linkedin.com/in/jakedcl',
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Main Content */}
      <main className="relative overflow-x-hidden">
        {/* Filmstrip Gallery - At the very top */}
        {settings?.galleryPhotos && settings.galleryPhotos.length > 0 && (
          <Filmstrip photos={settings.galleryPhotos} />
        )}

        {/* Header Section */}
        <header className="px-6 md:px-10 pt-10 pb-6">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-black">Jake DCL</h1>
            <div className="flex items-center gap-1">
              <Image src="/icons/web.png" alt="Web" width={28} height={28} className="w-7 h-7 object-contain" />
              <Image src="/icons/maps.png" alt="Maps" width={28} height={28} className="w-7 h-7 object-contain" />
              <Image src="/icons/media.png" alt="Media" width={28} height={28} className="w-7 h-7 object-contain" />
            </div>
          </div>
          {settings?.bioText && (
            <div className="text-base text-black">
              <PortableText 
                value={settings.bioText}
                components={{
                  block: {
                    normal: ({children}) => <p className="mb-2">{children}</p>,
                    h3: ({children}) => <h3 className="text-lg font-semibold mb-2">{children}</h3>,
                  },
                  marks: {
                    strong: ({children}) => <strong className="font-bold">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                    link: ({children, value}) => (
                      <a
                        href={value?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-gray-600 transition-colors"
                      >
                        {children}
                      </a>
                    ),
                  },
                }}
              />
            </div>
          )}

        </header>

        {/* Recent Work Section */}
        <section className="px-6 md:px-10 pb-10">
          <h2 className="text-2xl font-bold text-black mb-6">Recent Projects</h2>
          
          {/* Projects */}
          <div className="space-y-10">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
