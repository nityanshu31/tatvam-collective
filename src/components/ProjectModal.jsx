"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Icon components
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const PlusIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MinusIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ProjectModal = ({ projectId, projects, onClose }) => {
  const router = useRouter();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const autoPlayIntervalRef = useRef(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Find project by _id or id
  const project = projects.find(p => {
    return String(p._id) === String(projectId) || String(p.id) === String(projectId);
  });
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState({});

  // Get all images
  const allImages = useMemo(() => {
    if (!project) return [];
    const images = [];
    const imageSet = new Set();
    
    if (project.image) {
      images.push(project.image);
      imageSet.add(project.image);
    }
    
    if (project.gallery && Array.isArray(project.gallery)) {
      project.gallery.forEach(img => {
        if (!imageSet.has(img)) {
          images.push(img);
          imageSet.add(img);
        }
      });
    }
    
    return images;
  }, [project]);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide functionality (only for desktop)
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);

  // Start/stop auto-play (only for desktop)
  const startAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    if (isAutoPlaying && allImages.length > 1 && !isMobile) {
      autoPlayIntervalRef.current = setInterval(nextImage, 4000);
    }
  }, [isAutoPlaying, nextImage, allImages.length, isMobile]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  }, []);

  // Reset auto-play when image changes (desktop only)
  useEffect(() => {
    if (!isMobile) {
      if (isAutoPlaying) {
        stopAutoPlay();
        startAutoPlay();
      }
      return () => stopAutoPlay();
    }
  }, [currentImageIndex, isAutoPlaying, startAutoPlay, stopAutoPlay, isMobile]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  // Reset states when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError({});
    setIsInfoOpen(false);
    setIsAutoPlaying(true);
  }, [project]);

  // Handle mobile back button - close modal instead of going back
  useEffect(() => {
    if (!isMobile || !project) return;

    const handlePopState = (event) => {
      event.preventDefault();
      onClose();
      // Push a new state to prevent going back
      window.history.pushState(null, '', window.location.href);
    };

    // Push a dummy state to handle back button
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isMobile, project, onClose]);

  // Close info panel when clicking outside
  const handleOverlayClick = (e) => {
    // Close info panel if it's open
    if (isInfoOpen) {
      setIsInfoOpen(false);
    } else {
      // If info panel is closed, close the entire modal
      onClose();
    }
  };

  // Keyboard navigation (desktop only)
  useEffect(() => {
    if (isMobile) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevImage, nextImage, onClose, isMobile]);

  if (!project) return null;

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  // MOBILE VIEW - Stack all images vertically
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white overflow-y-auto"
        style={{ backgroundColor: 'white' }}
        onClick={handleOverlayClick}
      >
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="flex justify-between items-center p-4">
            <div>
              <h1 className="text-xl font-semibold text-[var(--black)]">{project.title}</h1>
              <p className="text-sm text-[var(--accent)]">{project.location}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
            >
              <XIcon />
            </button>
          </div>
        </div>

        {/* All Images Stacked Vertically */}
        <div className="pb-20" onClick={(e) => e.stopPropagation()}>
          {allImages.map((img, idx) => (
            <div key={idx} className="relative w-full bg-black">
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={imageError[idx] ? fallbackImage : img}
                  alt={`${project.title} - Image ${idx + 1}`}
                  fill
                  className="object-contain"
                  onError={() => handleImageError(idx)}
                  priority={idx === 0}
                  unoptimized={true}
                  sizes="100vw"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                {idx + 1} / {allImages.length}
              </div>
            </div>
          ))}

          {/* Project Details Section */}
          <div className="p-5 bg-white border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Year</p>
                <p className="text-base font-semibold text-[var(--black)]">{project.year}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Area</p>
                <p className="text-base font-semibold text-[var(--black)]">{project.area}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Type</p>
                <p className="text-base font-semibold text-[var(--black)]">{project.type}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-wider text-[var(--muted)] mb-3">
                About the Project
              </h3>
              <p className="text-[var(--muted)] leading-relaxed text-sm">
                {project.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // DESKTOP VIEW - Carousel Modal
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-1 md:p-2"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-[95%] md:w-[90%] h-[92vh] bg-[var(--white)] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-sm"
        >
          <XIcon />
        </button>

        {/* Info Button - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isInfoOpen ? 0 : 1, x: isInfoOpen ? 20 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-medium text-[var(--black)] bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
          >
            {isInfoOpen ? "Close" : "Info"}
          </motion.span>
          <motion.button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="p-2 bg-[var(--accent)]/80 backdrop-blur-sm rounded-full text-white hover:bg-[var(--accent)] transition-all duration-300 shadow-md"
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: isInfoOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isInfoOpen ? <MinusIcon /> : <PlusIcon />}
          </motion.button>
        </div>

        {/* Main Image Container - Carousel */}
        <div className="relative flex-1 overflow-hidden bg-black flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative max-w-full max-h-full w-auto h-auto">
                  <Image
                    src={imageError[currentImageIndex] ? fallbackImage : allImages[currentImageIndex]}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    width={1200}
                    height={800}
                    className="object-contain w-auto h-auto max-w-full max-h-full"
                    onError={() => handleImageError(currentImageIndex)}
                    priority
                    unoptimized={true}
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Clean transparent design, no background */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white transition-all duration-300 focus:outline-none"
                aria-label="Previous image"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white transition-all duration-300 focus:outline-none"
                aria-label="Next image"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <ChevronRightIcon />
              </button>
            </>
          )}
        </div>

        {/* Info Panel - Slides up from bottom - TAKES 75% OF MODAL */}
        <AnimatePresence>
          {isInfoOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-2xl shadow-2xl overflow-y-auto"
              style={{ 
                height: '75%',
                borderTop: "1px solid rgba(0,0,0,0.1)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 h-full overflow-y-auto">
                {/* Close button inside info panel */}
                <button
                  onClick={() => setIsInfoOpen(false)}
                  className="absolute top-4 right-4 z-30 p-2 bg-gray-100 rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
                >
                  <XIcon />
                </button>

                {/* Drag handle */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                
                <h2 className="text-3xl md:text-4xl font-semibold text-[var(--black)] mb-2 pr-8">
                  {project.title}
                </h2>
                <p className="text-[var(--accent)] uppercase tracking-wider text-base mb-6">
                  {project.location}
                </p>

                <div className="grid grid-cols-3 gap-6 mb-6 pb-6 border-b border-[var(--muted)]/20">
                  <div>
                    <p className="text-sm text-[var(--muted)] uppercase tracking-wider mb-1">Year</p>
                    <p className="text-xl font-semibold text-[var(--black)]">{project.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted)] uppercase tracking-wider mb-1">Area</p>
                    <p className="text-xl font-semibold text-[var(--black)]">{project.area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted)] uppercase tracking-wider mb-1">Type</p>
                    <p className="text-xl font-semibold text-[var(--black)]">{project.type}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-base uppercase tracking-wider text-[var(--muted)] mb-3">
                    About the Project
                  </h3>
                  <p className="text-[var(--muted)] leading-relaxed text-base">
                    {project.description || "No description available."}
                  </p>
                </div>

                {/* Thumbnail Gallery */}
                {allImages.length > 1 && (
                  <div>
                    <h3 className="text-base uppercase tracking-wider text-[var(--muted)] mb-3">
                      Gallery
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentImageIndex(idx);
                            setIsInfoOpen(false);
                          }}
                          className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all duration-300 ${
                            currentImageIndex === idx 
                              ? 'ring-2 ring-[var(--accent)] shadow-lg scale-95' 
                              : 'opacity-60 hover:opacity-100 hover:shadow-md'
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={true}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;