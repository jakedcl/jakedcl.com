'use client'

import { Project } from '@/types/sanity';
import { PortableText } from 'next-sanity';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { urlFor } from '@/sanity/lib/image';

export default function ProjectCard({ project }: { project: Project }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [fitsInView, setFitsInView] = useState(false);

  useEffect(() => {
    const carousel = document.getElementById(`carousel-${project._id}`);
    if (!carousel) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = carousel;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      setNeedsScroll(scrollWidth > clientWidth);
      setFitsInView(scrollWidth <= clientWidth);
    };

    checkScroll();
    carousel.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      carousel.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [project._id]);

  const handleScrollLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const carousel = document.getElementById(`carousel-${project._id}`);
    if (carousel) {
      const scrollAmount = 2 * (window.innerWidth < 768 ? 160 : 220);
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const carousel = document.getElementById(`carousel-${project._id}`);
    if (carousel) {
      const scrollAmount = 2 * (window.innerWidth < 768 ? 160 : 220);
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const cardContent = (
    <>
      {/* Project Title */}
      <div className="text-left mb-4">
        <PortableText 
          value={project.title} 
          components={{
            block: {
              normal: ({children}) => <p className="text-lg md:text-xl text-black">{children}</p>,
              // Keep card titles semantically below page <h1>.
              h1: ({children}) => <h3 className="text-xl md:text-2xl font-bold text-black">{children}</h3>,
              h2: ({children}) => <h3 className="text-lg md:text-xl font-bold text-black">{children}</h3>,
              h3: ({children}) => <h4 className="text-lg md:text-xl font-semibold text-black">{children}</h4>,
            },
            marks: {
              strong: ({children}) => <strong className="font-bold">{children}</strong>,
              em: ({children}) => <em className="italic">{children}</em>,
              code: ({children}) => <code className="font-mono text-sm bg-gray-100 px-1 rounded">{children}</code>,
            }
          }}
        />
      </div>

      {/* Project Photos Carousel */}
      <div className={`${fitsInView ? 'w-fit max-w-full' : 'w-full'} h-40 md:h-48 rounded-lg overflow-hidden relative border border-gray-200`}>
        {project.photos && project.photos.length > 0 ? (
          <>
            <div 
              className="flex overflow-x-auto gap-3 h-full scrollbar-hide p-2" 
              id={`carousel-${project._id}`}
            >
              {project.photos
                .filter((photo) => photo?.asset)
                .map((photo, index) => (
                  <div key={index} className="flex-shrink-0 h-full aspect-[4/3]">
                    <Image
                      src={urlFor(photo).width(280).height(210).fit('max').url()}
                      alt={photo.alt || `Project image ${index + 1}`}
                      width={280}
                      height={210}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
            </div>
            
            {/* Left scroll button */}
            {needsScroll && canScrollLeft && (
              <button
                type="button"
                onClick={handleScrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                aria-label="Scroll project images left"
              >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {/* Right scroll button */}
            {needsScroll && canScrollRight && (
              <button
                type="button"
                onClick={handleScrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                aria-label="Scroll project images right"
              >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
            No images
          </div>
        )}
      </div>
    </>
  );

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white rounded-xl p-4 md:p-5 border border-gray-300 shadow-sm hover:border-gray-400 hover:shadow-lg transition-all duration-200 overflow-hidden"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-300 shadow-sm overflow-hidden">
      {cardContent}
    </div>
  );
}
