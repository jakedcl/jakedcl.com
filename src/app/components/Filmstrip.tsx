'use client'

import { SanityImage } from '@/types/sanity';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { urlFor } from '@/sanity/lib/image';

interface FilmstripProps {
  photos: SanityImage[];
}

export default function Filmstrip({ photos }: FilmstripProps) {
  const [shuffledPhotos, setShuffledPhotos] = useState<SanityImage[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // All hooks must be called before any early returns
  useEffect(() => {
    // Shuffle photos on mount
    if (photos && photos.length > 0) {
      const shuffled = [...photos].sort(() => Math.random() - 0.5);
      // Duplicate for seamless infinite loop
      setShuffledPhotos([...shuffled, ...shuffled]);
    }
  }, [photos]);

  useEffect(() => {
    if (selectedPhoto === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhoto((prev) => prev === null ? null : (prev === 0 ? (photos?.length || 0) - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedPhoto((prev) => prev === null ? null : (prev === (photos?.length || 0) - 1 ? 0 : prev + 1));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, photos?.length]);

  // Early return AFTER all hooks
  if (!photos || photos.length === 0) return null;

  const handlePhotoClick = (index: number) => {
    // Map clicked index to original array (accounting for duplication)
    const originalIndex = index % photos.length;
    setSelectedPhoto(originalIndex);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (selectedPhoto === null) return;
    if (direction === 'prev') {
      setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1);
    } else {
      setSelectedPhoto(selectedPhoto === photos.length - 1 ? 0 : selectedPhoto + 1);
    }
  };

  return (
    <>
      <section className="w-full overflow-hidden bg-white">
        <div className="relative h-48 md:h-64">
          <div className="flex h-full animate-scroll-left gap-2">
            {shuffledPhotos.map((photo, index) => (
              <button
                key={`${photo.asset._ref}-${index}`}
                onClick={() => handlePhotoClick(index)}
                className="flex-shrink-0 h-full cursor-pointer hover:opacity-90 transition-opacity"
                style={{ width: 'auto' }}
              >
                <Image
                  src={urlFor(photo).width(400).height(400).fit('max').url()}
                  alt={photo.alt || `Gallery image ${index + 1}`}
                  width={400}
                  height={400}
                  className="h-full w-auto object-contain"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('prev');
            }}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Previous"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('next');
            }}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Next"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            className="max-w-7xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={urlFor(photos[selectedPhoto]).width(1920).height(1080).fit('max').url()}
              alt={photos[selectedPhoto].alt || `Gallery image ${selectedPhoto + 1}`}
              width={1920}
              height={1080}
              className="max-w-full max-h-[90vh] object-contain"
              unoptimized
            />
            {photos[selectedPhoto].caption && (
              <p className="text-white text-center mt-4 text-sm">{photos[selectedPhoto].caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
