'use client'

import { SanityImage } from '@/types/sanity';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { urlFor } from '@/sanity/lib/image';

interface FilmstripProps {
  photos: SanityImage[];
}

export default function Filmstrip({ photos }: FilmstripProps) {
  const [shuffledPhotos, setShuffledPhotos] = useState<SanityImage[]>([]);
  const [originalPhotoOrder, setOriginalPhotoOrder] = useState<number[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const positionRef = useRef(0);

  // All hooks must be called before any early returns
  useEffect(() => {
    // Shuffle photos on mount using Fisher-Yates algorithm
    if (photos && photos.length > 0) {
      const shuffled = [...photos];
      const indices = photos.map((_, i) => i);
      
      // Shuffle both arrays in sync
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      
      // Duplicate for seamless infinite loop
      setShuffledPhotos([...shuffled, ...shuffled]);
      setOriginalPhotoOrder([...indices, ...indices]);
    }
  }, [photos]);

  // JavaScript-based infinite scroll that never resets
  useEffect(() => {
    if (!containerRef.current || shuffledPhotos.length === 0) return;

    const container = containerRef.current;
    const scrollSpeed = window.innerWidth < 768 ? 0.7 : 0.5; // pixels per frame (faster on mobile)
    
    const animate = () => {
      if (!container) return;
      
      positionRef.current += scrollSpeed;
      
      // Get the width of one set of photos
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const setWidth = container.scrollWidth / 2; // Since we duplicate twice
        
        // When we've scrolled one full set, reset position seamlessly
        if (positionRef.current >= setWidth) {
          positionRef.current = positionRef.current - setWidth;
        }
      }
      
      container.style.transform = `translateX(-${positionRef.current}px)`;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shuffledPhotos.length]);

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
    // Get the original photo index from the shuffled order
    if (originalPhotoOrder.length > 0) {
      const originalIndex = originalPhotoOrder[index];
      setSelectedPhoto(originalIndex);
    }
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
          <div 
            ref={containerRef}
            className="flex h-full gap-2"
            style={{ willChange: 'transform' }}
          >
            {shuffledPhotos
              .map((photo, originalIndex) => ({ photo, originalIndex }))
              .filter(({ photo }) => photo?.asset)
              .map(({ photo, originalIndex }) => (
                <button
                  key={`${photo.asset?._ref || 'photo'}-${originalIndex}`}
                  onClick={() => handlePhotoClick(originalIndex)}
                  className="flex-shrink-0 h-full cursor-pointer hover:opacity-90 active:opacity-90 transition-opacity"
                  style={{ width: 'auto' }}
                >
                  <Image
                    src={urlFor(photo).width(800).url()}
                    alt={photo.alt || `Gallery image ${originalIndex + 1}`}
                    width={800}
                    height={600}
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
            className="max-w-[95vw] max-h-[95vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={urlFor(photos[selectedPhoto]).width(2400).url()}
              alt={photos[selectedPhoto].alt || `Gallery image ${selectedPhoto + 1}`}
              width={2400}
              height={2400}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
              unoptimized
              priority
            />
            {photos[selectedPhoto].caption && (
              <p className="text-white text-center mt-4 text-sm max-w-2xl px-4">{photos[selectedPhoto].caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
