'use client'

import { SanityImage } from '@/types/sanity';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import { urlFor } from '@/sanity/lib/image';

interface FilmstripProps {
  photos: SanityImage[];
  variant?: 'page' | 'overlay';
}

export default function Filmstrip({ photos, variant = 'page' }: FilmstripProps) {
  const isOverlay = variant === 'overlay';
  const [shuffledPhotos, setShuffledPhotos] = useState<SanityImage[]>([]);
  const [originalPhotoOrder, setOriginalPhotoOrder] = useState<number[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const isPausedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartPosition = useRef(0);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const hasMoved = useRef(false); // Track if user moved during touch/mouse down
  const dragThreshold = 5; // Minimum pixels moved to consider it a drag
  const lastMoveTime = useRef<number | null>(null);
  const lastMoveX = useRef<number | null>(null);
  const velocity = useRef(0); // Current scroll velocity
  const isMomentumScrolling = useRef(false);

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
    const friction = 0.95; // Friction coefficient for momentum scrolling (0.95 = 5% loss per frame)
    const minVelocity = 0.1; // Minimum velocity to continue momentum scrolling
    
    const animate = () => {
      if (!container) return;
      
      // Momentum scrolling (after user releases)
      if (isMomentumScrolling.current && Math.abs(velocity.current) > minVelocity) {
        positionRef.current += velocity.current;
        velocity.current *= friction; // Apply friction
        
        // Handle seamless looping
        if (containerRef.current) {
          const setWidth = containerRef.current.scrollWidth / 2;
          if (positionRef.current < 0) {
            positionRef.current = setWidth + positionRef.current;
          } else if (positionRef.current >= setWidth) {
            positionRef.current = positionRef.current - setWidth;
          }
        }
      }
      // Auto-scroll (when not paused and not momentum scrolling)
      else if (!isPausedRef.current && !isMomentumScrolling.current) {
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
      }
      // Stop momentum scrolling if velocity is too low
      else if (isMomentumScrolling.current && Math.abs(velocity.current) <= minVelocity) {
        isMomentumScrolling.current = false;
        velocity.current = 0;
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

  // Touch handlers for swipe functionality (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    isPausedRef.current = true;
    isMomentumScrolling.current = false;
    hasMoved.current = false;
    velocity.current = 0;
    touchStartX.current = e.touches[0].clientX;
    touchStartPosition.current = positionRef.current;
    lastMoveTime.current = Date.now();
    lastMoveX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || lastMoveTime.current === null || lastMoveX.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const currentTime = Date.now();
    const diff = Math.abs(touchStartX.current - currentX);
    
    // Mark as moved if movement exceeds threshold
    if (diff > dragThreshold) {
      hasMoved.current = true;
    }
    
    // Calculate velocity (pixels per millisecond)
    const timeDelta = currentTime - lastMoveTime.current;
    const distanceDelta = lastMoveX.current - currentX; // Positive = swiped left
    if (timeDelta > 0) {
      velocity.current = distanceDelta / timeDelta; // pixels per ms
    }
    
    const scrollDiff = touchStartX.current - currentX; // Positive = swiped left
    
    // Update position based on swipe
    positionRef.current = touchStartPosition.current + scrollDiff;
    
    // Handle seamless looping
    if (containerRef.current) {
      const setWidth = containerRef.current.scrollWidth / 2;
      if (positionRef.current < 0) {
        positionRef.current = setWidth + positionRef.current;
      } else if (positionRef.current >= setWidth) {
        positionRef.current = positionRef.current - setWidth;
      }
    }
    
    // Update tracking for next velocity calculation
    lastMoveTime.current = currentTime;
    lastMoveX.current = currentX;
  };

  const handleTouchEnd = () => {
    isPausedRef.current = false;
    touchStartX.current = null;
    
    // Convert velocity from pixels/ms to pixels/frame (assuming 60fps = ~16.67ms per frame)
    const velocityPerFrame = velocity.current * 16.67;
    
    // Only start momentum if velocity is significant
    if (Math.abs(velocityPerFrame) > 0.5) {
      velocity.current = velocityPerFrame;
      isMomentumScrolling.current = true;
    } else {
      velocity.current = 0;
      isMomentumScrolling.current = false;
    }
    
    lastMoveTime.current = null;
    lastMoveX.current = null;
    
    // Reset after a short delay to allow click handler to check
    setTimeout(() => {
      hasMoved.current = false;
    }, 100);
  };

  // Mouse handlers for drag functionality (desktop)
  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return;
    
    const currentX = e.clientX;
    const currentTime = Date.now();
    const diff = Math.abs(mouseStartX.current - currentX);
    
    // Mark as moved if movement exceeds threshold
    if (diff > dragThreshold) {
      hasMoved.current = true;
    }
    
    // Calculate velocity (pixels per millisecond)
    if (lastMoveTime.current !== null && lastMoveX.current !== null) {
      const timeDelta = currentTime - lastMoveTime.current;
      const distanceDelta = lastMoveX.current - currentX; // Positive = dragged left
      if (timeDelta > 0) {
        velocity.current = distanceDelta / timeDelta; // pixels per ms
      }
    }
    
    const scrollDiff = mouseStartX.current - currentX; // Positive = dragged left
    
    // Update position based on drag
    positionRef.current = touchStartPosition.current + scrollDiff;
    
    // Handle seamless looping
    if (containerRef.current) {
      const setWidth = containerRef.current.scrollWidth / 2;
      if (positionRef.current < 0) {
        positionRef.current = setWidth + positionRef.current;
      } else if (positionRef.current >= setWidth) {
        positionRef.current = positionRef.current - setWidth;
      }
    }
    
    // Update tracking for next velocity calculation
    lastMoveTime.current = currentTime;
    lastMoveX.current = currentX;
  };

  const handleMouseUp = () => {
    isPausedRef.current = false;
    isDragging.current = false;
    mouseStartX.current = null;
    window.removeEventListener('mousemove', handleGlobalMouseMove);
    window.removeEventListener('mouseup', handleGlobalMouseUp);
    
    // Convert velocity from pixels/ms to pixels/frame (assuming 60fps = ~16.67ms per frame)
    const velocityPerFrame = velocity.current * 16.67;
    
    // Only start momentum if velocity is significant
    if (Math.abs(velocityPerFrame) > 0.5) {
      velocity.current = velocityPerFrame;
      isMomentumScrolling.current = true;
    } else {
      velocity.current = 0;
      isMomentumScrolling.current = false;
    }
    
    lastMoveTime.current = null;
    lastMoveX.current = null;
    
    // Reset after a short delay to allow click handler to check
    setTimeout(() => {
      hasMoved.current = false;
    }, 100);
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    handleMouseMove(e);
  };

  const handleGlobalMouseUp = () => {
    handleMouseUp();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isPausedRef.current = true;
    isMomentumScrolling.current = false;
    isDragging.current = true;
    hasMoved.current = false;
    velocity.current = 0;
    mouseStartX.current = e.clientX;
    touchStartPosition.current = positionRef.current;
    lastMoveTime.current = Date.now();
    lastMoveX.current = e.clientX;
    e.preventDefault();
    
    // Add global listeners for dragging outside the container
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
  };

  // Walk the shuffled strip order (first half only — second half is the loop duplicate).
  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (selectedPhoto === null || originalPhotoOrder.length === 0 || !photos) return;

    const stripOrder = originalPhotoOrder
      .slice(0, originalPhotoOrder.length / 2)
      .filter((index) => photos[index]?.asset);
    if (stripOrder.length === 0) return;

    const currentStripIndex = stripOrder.indexOf(selectedPhoto);
    if (currentStripIndex === -1) {
      setSelectedPhoto(stripOrder[0]);
      return;
    }

    if (direction === 'prev') {
      const prevIndex = currentStripIndex === 0 ? stripOrder.length - 1 : currentStripIndex - 1;
      setSelectedPhoto(stripOrder[prevIndex]);
    } else {
      const nextIndex = currentStripIndex === stripOrder.length - 1 ? 0 : currentStripIndex + 1;
      setSelectedPhoto(stripOrder[nextIndex]);
    }
  }, [selectedPhoto, originalPhotoOrder, photos]);

  useEffect(() => {
    if (selectedPhoto === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, navigateLightbox]);

  // Early return AFTER all hooks
  if (!photos || photos.length === 0) return null;

  const handlePhotoClick = (index: number) => {
    // Only open lightbox if it was a tap (not a drag/swipe)
    if (hasMoved.current) return;
    
    // Get the original photo index from the shuffled order
    if (originalPhotoOrder.length > 0) {
      const originalIndex = originalPhotoOrder[index];
      setSelectedPhoto(originalIndex);
    }
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <section
        className={`w-full overflow-hidden ${isOverlay ? 'bg-transparent' : 'bg-white pt-2'}`}
      >
        <div className={`relative ${isOverlay ? 'h-24 md:h-32' : 'h-48 md:h-64'}`}>
          {isOverlay ? (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#b7a48d]/90 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#b7a48d]/90 to-transparent" />
            </>
          ) : null}
          <div 
            ref={containerRef}
            className="flex h-full gap-2 cursor-grab active:cursor-grabbing"
            style={{ willChange: 'transform', touchAction: 'pan-y pinch-zoom', userSelect: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {shuffledPhotos
              .map((photo, originalIndex) => ({ photo, originalIndex }))
              .filter(({ photo }) => photo?.asset)
              .map(({ photo, originalIndex }) => (
                <button
                  type="button"
                  key={`${photo.asset?._ref || 'photo'}-${originalIndex}`}
                  onClick={() => handlePhotoClick(originalIndex)}
                  className="flex-shrink-0 h-full cursor-pointer hover:opacity-90 active:opacity-90 transition-opacity filmstrip-image-container"
                  style={{ 
                    width: 'fit-content',
                    maxWidth: 'fit-content',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: 0,
                  }}
                >
                  <Image
                    src={urlFor(photo).width(800).url()}
                    alt={photo.alt || `Gallery image ${originalIndex + 1}`}
                    width={800}
                    height={600}
                    className="h-full w-auto object-contain"
                    style={{
                      display: 'block',
                      height: '100%',
                      width: 'auto',
                      maxWidth: 'none',
                      flexShrink: 0,
                    }}
                    unoptimized
                  />
                </button>
              ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && photos && photos[selectedPhoto]?.asset && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 cursor-pointer p-2 text-white transition-colors hover:text-gray-300"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('prev');
            }}
            className="absolute left-4 cursor-pointer p-2 text-white transition-colors hover:text-gray-300"
            aria-label="Previous"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('next');
            }}
            className="absolute right-4 cursor-pointer p-2 text-white transition-colors hover:text-gray-300"
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
