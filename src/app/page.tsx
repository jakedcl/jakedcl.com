import { client } from '@/sanity/lib/client';
import { projectsQuery, settingsQuery } from '@/sanity/lib/queries';
import { Project, Settings } from '@/types/sanity';
import ProjectCard from './components/ProjectCard';
import Filmstrip from './components/Filmstrip';
import Resume from './components/Resume';

export const revalidate = 0; // Always fetch fresh data

async function getProjects(): Promise<Project[]> {
  return await client.fetch(projectsQuery);
}

async function getSettings(): Promise<Settings | null> {
  return await client.fetch(settingsQuery);
}

function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
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
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="relative overflow-x-hidden">
        {settings?.galleryPhotos && settings.galleryPhotos.length > 0 && (
          <Filmstrip photos={settings.galleryPhotos} />
        )}

        <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 md:px-8 md:pt-10">
          <header className="flex items-start justify-between gap-x-10 gap-y-4">
            <h1 className="sr-only">Jake DCL</h1>
            <div className="min-w-0 flex-1">
              <Resume part="intro" />
            </div>
            <a
              href="#resume"
              className="mt-3 inline-flex shrink-0 items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-black"
            >
              Resume
              <svg
                viewBox="0 0 12 12"
                aria-hidden
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M6 1.5v8M3 7l3 3 3-3" />
              </svg>
            </a>
          </header>

          <section className="mt-12 md:mt-16">
            <h2 className="mb-5 border-b border-neutral-300 pb-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-neutral-500">
              Work
            </h2>
            <ProjectsList projects={projects} />
          </section>

          <div id="resume" className="mt-16 max-w-3xl scroll-mt-8 md:mt-20">
            <Resume part="body" />
          </div>
        </div>
      </main>
    </div>
  );
}
