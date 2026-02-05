import { client } from '@/sanity/lib/client';
import { projectsQuery, settingsQuery } from '@/sanity/lib/queries';
import { Project, Settings } from '@/types/sanity';
import Image from 'next/image';
import ProjectCard from './components/ProjectCard';
import Filmstrip from './components/Filmstrip';

async function getProjects(): Promise<Project[]> {
  return await client.fetch(projectsQuery);
}

async function getSettings(): Promise<Settings | null> {
  return await client.fetch(settingsQuery);
}

export default async function Home() {
  const projects = await getProjects();
  const settings = await getSettings();

  const socialLinks = [
    { text: 'github', link: 'https://github.com/jakedcl' },
    { text: 'linkedin', link: 'https://linkedin.com/in/jacobdcl' },
    { text: 'youtube', link: 'https://youtube.com/@jakedcl' },
    { text: 'instagram', link: 'https://instagram.com/jakedcl' },
  ];

  return (
    <div className="min-h-screen bg-white">
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
          <p className="text-base text-black">
            IT, Web Development
          </p>
          <p className="text-base text-black">
            @jakedcl on{' '}
            {socialLinks.map((item, index) => (
              <span key={item.text}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-600 transition-colors"
                >
                  {item.text}
                </a>
                {index < socialLinks.length - 1 && ', '}
              </span>
            ))}
          </p>
        </header>

        {/* Recent Work Section */}
        <section className="px-6 md:px-10 pb-10">
          <h2 className="text-2xl font-bold text-black mb-6">Recent Work</h2>
          
          {/* Projects */}
          <div className="space-y-8">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
