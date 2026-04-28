// // components/ProjectModal.jsx
// "use client";

// import { useState, useEffect, useMemo } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// // Custom icon components
// const XIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="18" y1="6" x2="6" y2="18"></line>
//     <line x1="6" y1="6" x2="18" y2="18"></line>
//   </svg>
// );

// const ChevronLeftIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="15 18 9 12 15 6"></polyline>
//   </svg>
// );

// const ChevronRightIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="9 18 15 12 9 6"></polyline>
//   </svg>
// );

// const ProjectModal = ({ projectId, projects, onClose }) => {
//   // Find project by _id or id (handles both MongoDB and static data)
//   const project = projects.find(p => {
//     // Compare as strings to handle ObjectId
//     return String(p._id) === String(projectId) || String(p.id) === String(projectId);
//   });
  
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [imageError, setImageError] = useState(false);

//   // Get all images (main image + gallery) - NO DUPLICATES
//   const allImages = useMemo(() => {
//     if (!project) return [];
    
//     const images = [];
//     const imageSet = new Set();
    
//     // Add main image first
//     if (project.image) {
//       images.push(project.image);
//       imageSet.add(project.image);
//     }
    
//     // Add gallery images without duplicates
//     if (project.gallery && Array.isArray(project.gallery)) {
//       project.gallery.forEach(img => {
//         if (!imageSet.has(img)) {
//           images.push(img);
//           imageSet.add(img);
//         }
//       });
//     }
    
//     return images;
//   }, [project]);

//   // Debug log
//   useEffect(() => {
//     console.log("Modal opened with projectId:", projectId);
//     console.log("Found project:", project);
//     console.log("All images:", allImages);
//   }, [projectId, project, allImages]);

//   // Prevent body scroll when modal is open
//   useEffect(() => {
//     if (project) {
//       document.body.style.overflow = 'hidden';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [project]);

//   // Reset image index when project changes
//   useEffect(() => {
//     setCurrentImageIndex(0);
//     setImageError(false);
//   }, [project]);

//   if (!project) {
//     console.error("Project not found for ID:", projectId);
//     return null;
//   }

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => 
//       prev === allImages.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => 
//       prev === 0 ? allImages.length - 1 : prev - 1
//     );
//   };

//   const handleImageError = () => {
//     setImageError(true);
//   };

//   // Fallback image
//   const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
//       style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}
//       onClick={onClose}
//     >
//       {/* Subtle pattern overlay for texture */}
//       <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//         }}
//       />

//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.95, opacity: 0 }}
//         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//         className="relative max-w-7xl w-full max-h-[90vh] bg-[var(--white)] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
//           border: '1px solid rgba(0, 0, 0, 0.05)'
//         }}
//       >
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-lg"
//           style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
//         >
//           <XIcon />
//         </button>

//         <div className="flex flex-col lg:flex-row h-full overflow-y-auto">
//           {/* Image Gallery Section */}
//           <div className="relative w-full lg:w-3/5 bg-[#f5f5f5]">
//             <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
//               <Image
//                 src={imageError ? fallbackImage : (allImages[currentImageIndex] || project.image)}
//                 alt={`${project.title} - Image ${currentImageIndex + 1}`}
//                 fill
//                 className="object-cover"
//                 onError={handleImageError}
//                 priority
//                 unoptimized={true}
//               />
              
//               {/* Gradient overlay for better text visibility on navigation */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              
//               {/* Gallery Navigation */}
//               {allImages.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-lg"
//                   >
//                     <ChevronLeftIcon />
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-lg"
//                   >
//                     <ChevronRightIcon />
//                   </button>
                  
//                   {/* Image counter */}
//                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[var(--black)] text-sm shadow-lg">
//                     {currentImageIndex + 1} / {allImages.length}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Content Section */}
//           <div className="w-full lg:w-2/5 p-6 md:p-8 lg:p-10 flex flex-col overflow-y-auto bg-[var(--white)]">
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.1 }}
//             >
//               <h2 className="text-3xl md:text-4xl font-semibold text-[var(--black)] mb-2">
//                 {project.title}
//               </h2>
//               <p className="text-[var(--accent)] uppercase tracking-wider text-sm mb-6">
//                 {project.location}
//               </p>
//             </motion.div>

//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.15 }}
//               className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-[var(--muted)]/20"
//             >
//               <div>
//                 <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Year</p>
//                 <p className="text-lg font-semibold text-[var(--black)]">{project.year}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Area</p>
//                 <p className="text-lg font-semibold text-[var(--black)]">{project.area}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Type</p>
//                 <p className="text-lg font-semibold text-[var(--black)]">{project.type}</p>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               <h3 className="text-sm uppercase tracking-wider text-[var(--muted)] mb-3">
//                 About the Project
//               </h3>
//               <p className="text-[var(--muted)] leading-relaxed mb-6">
//                 {project.description || "No description available."}
//               </p>
//             </motion.div>

//             {/* Thumbnail Gallery */}
//             {allImages.length > 1 && (
//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.25 }}
//                 className="mt-auto"
//               >
//                 <h3 className="text-sm uppercase tracking-wider text-[var(--muted)] mb-3">
//                   Gallery
//                 </h3>
//                 <div className="grid grid-cols-3 gap-2">
//                   {allImages.map((img, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => setCurrentImageIndex(idx)}
//                       className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all duration-300 ${
//                         currentImageIndex === idx 
//                           ? 'ring-2 ring-[var(--accent)] shadow-lg scale-[0.98]' 
//                           : 'opacity-60 hover:opacity-100 hover:shadow-md'
//                       }`}
//                     >
//                       <Image
//                         src={img}
//                         alt={`Thumbnail ${idx + 1}`}
//                         fill
//                         className="object-cover"
//                         unoptimized={true}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ProjectModal;





// components/ProjectModal.jsx



"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Custom icon components
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const autoPlayIntervalRef = useRef(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Find project by _id or id (handles both MongoDB and static data)
  const project = projects.find(p => {
    return String(p._id) === String(projectId) || String(p.id) === String(projectId);
  });
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Get all images (main image + gallery) - NO DUPLICATES
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

  // Auto-slide functionality
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

  // Start/stop auto-play
  const startAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    if (isAutoPlaying && allImages.length > 1) {
      autoPlayIntervalRef.current = setInterval(nextImage, 4000);
    }
  }, [isAutoPlaying, nextImage, allImages.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  }, []);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  // Reset auto-play when image changes
  useEffect(() => {
    if (isAutoPlaying) {
      stopAutoPlay();
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [currentImageIndex, isAutoPlaying, startAutoPlay, stopAutoPlay]);

  // Debug log
  useEffect(() => {
    console.log("Modal opened with projectId:", projectId);
    console.log("Found project:", project);
    console.log("All images:", allImages);
  }, [projectId, project, allImages]);

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
    setImageError(false);
    setIsInfoOpen(false);
    setIsAutoPlaying(true);
  }, [project]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
        if (isAutoPlaying) stopAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextImage();
        if (isAutoPlaying) stopAutoPlay();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevImage, nextImage, onClose, isAutoPlaying, stopAutoPlay]);

  if (!project) {
    console.error("Project not found for ID:", projectId);
    return null;
  }

  const handleImageError = () => {
    setImageError(true);
  };

  const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-1 md:p-2"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}
      onClick={onClose}
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
          className="absolute top-3 right-3 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-lg"
        >
          <XIcon />
        </button>

        {/* + Info Button - Bottom Right with animated label */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isInfoOpen ? 0 : 1, x: isInfoOpen ? 20 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium text-[var(--black)] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
          >
            {isInfoOpen ? "Close" : "Project Info"}
          </motion.span>
          <motion.button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="p-3 bg-[var(--accent)] rounded-full text-white hover:bg-[var(--black)] transition-all duration-300 shadow-lg"
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: isInfoOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isInfoOpen ? <MinusIcon /> : <PlusIcon />}
          </motion.button>
        </div>

        {/* Image counter with auto-play toggle */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
            <button
              onClick={toggleAutoPlay}
              className="text-[var(--black)] hover:text-[var(--accent)] transition-colors"
            >
              {isAutoPlaying ? "⏸" : "▶"}
            </button>
            <span className="text-[var(--black)] text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </span>
          </div>
        )}

        {/* Main Content Area - Image full bleed */}
        <div className="relative flex-1 overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={imageError ? fallbackImage : (allImages[currentImageIndex] || project.image)}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                onError={handleImageError}
                priority
                unoptimized={true}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => { prevImage(); if (isAutoPlaying) stopAutoPlay(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-lg"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={() => { nextImage(); if (isAutoPlaying) stopAutoPlay(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shadow-lg"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}
        </div>

        {/* Info Panel - Slides up from bottom - SMALLER SIZE */}
        <AnimatePresence>
          {isInfoOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-2xl shadow-2xl max-h-[40vh] overflow-y-auto"
              style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
            >
              <div className="p-5 md:p-6">
                {/* Close button inside info panel */}
                <button
                  onClick={() => setIsInfoOpen(false)}
                  className="absolute top-3 right-3 z-30 p-1.5 bg-gray-100 rounded-full text-[var(--black)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
                >
                  <XIcon />
                </button>

                {/* Drag handle */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                
                <h2 className="text-3xl md:text-4xl font-semibold text-[var(--black)] mb-2">
                  {project.title}
                </h2>
                <p className="text-[var(--accent)] uppercase tracking-wider text-base mb-5">
                  {project.location}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b border-[var(--muted)]/20">
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

                <div className="mb-5">
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
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentImageIndex(idx);
                            if (isAutoPlaying) stopAutoPlay();
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