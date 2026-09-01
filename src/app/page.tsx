import { client } from '@/sanity/lib/client';
import { projectsQuery, settingsQuery } from '@/sanity/lib/queries';
import { Project, Settings } from '@/types/sanity';
import FloatingNotebookWidget from './components/FloatingNotebookWidget';
import HomeIntro from './components/HomeIntro';
import ProjectCard from './components/ProjectCard';
import Filmstrip from './components/Filmstrip';

export const revalidate = 0; // Always fetch fresh data

async function getProjects(): Promise<Project[]> {
  return await client.fetch(projectsQuery);
}

async function getSettings(): Promise<Settings | null> {
  return await client.fetch(settingsQuery);
}

function ProjectsList({
  projects,
  compact = false,
  className = '',
}: {
  projects: Project[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} compact={compact} />
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
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="relative overflow-x-hidden">
        {settings?.galleryPhotos && settings.galleryPhotos.length > 0 && (
          <Filmstrip photos={settings.galleryPhotos} />
        )}

        <div className="px-6 pb-16 pt-10 md:px-10 lg:grid lg:grid-cols-[minmax(0,1fr)_min(19rem,26%)] lg:items-start lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_min(22rem,28%)] xl:gap-x-14">
          <div className="min-w-0 space-y-10 pb-8 lg:pb-0">
            <HomeIntro />
            <section className="lg:hidden">
              <h2 className="mb-6 text-2xl font-bold text-black">Recent Projects</h2>
              <ProjectsList projects={projects} className="space-y-10" />
            </section>
          </div>

          <aside className="hidden min-w-0 lg:block lg:sticky lg:top-8 lg:self-start">
            <h2 className="mb-5 text-lg font-bold text-black xl:text-xl">Recent Projects</h2>
            <ProjectsList projects={projects} compact className="space-y-6" />
          </aside>
        </div>
      </main>

      <FloatingNotebookWidget />
    </div>
  );
}
