// app/projects/page.jsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ProjectModal from "@/components/ProjectModal";

const ProjectCard = ({ project, index, onClick }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const autoRotateInterval = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const allImages = useMemo(() => {
    const images = [];
    const imageSet = new Set();

    if (project.image) {
      images.push(project.image);
      imageSet.add(project.image);
    }

    if (project.gallery && Array.isArray(project.gallery)) {
      project.gallery.forEach((img) => {
        if (!imageSet.has(img)) {
          images.push(img);
          imageSet.add(img);
        }
      });
    }

    return images;
  }, [project.image, project.gallery]);

  const hasMultipleImages = allImages.length > 1;

  useEffect(() => {
    if (!isMobile && isHovered && hasMultipleImages) {
      autoRotateInterval.current = setInterval(() => {
        setCurrentImageIndex(
          (prev) => (prev + 1) % allImages.length
        );
      }, 2000);
    } else {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
      }

      if (!isHovered) {
        setCurrentImageIndex(0);
      }
    }

    return () => {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
      }
    };
  }, [
    isHovered,
    hasMultipleImages,
    allImages.length,
    isMobile,
  ]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue =
      ((y - centerY) / centerY) * -3;

    const rotateYValue =
      ((x - centerX) / centerX) * 3;

    const glareXValue =
      (x / rect.width) * 100;

    const glareYValue =
      (y / rect.height) * 100;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setGlareX(glareXValue);
    setGlareY(glareYValue);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;

    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
    setIsHovered(false);
  };

  const handleCardClick = () => {
    onClick(project._id || project.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
      }}
      className="cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <div
        ref={cardRef}
        className="relative group h-full flex flex-col"
        onMouseMove={handleMouseMove}
        onMouseEnter={() =>
          !isMobile && setIsHovered(true)
        }
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.2s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="overflow-hidden relative w-full aspect-[4/3] bg-[#f5f5f5]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{
                opacity: 0,
                scale: 1.05,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
              className="relative w-full h-full"
            >
              <Image
                src={
                  allImages[currentImageIndex]
                }
                alt={`${project.title} - Image ${
                  currentImageIndex + 1
                }`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={index < 4}
                unoptimized={true}
              />
            </motion.div>
          </AnimatePresence>

          {!isMobile &&
            hasMultipleImages &&
            isHovered && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {allImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`transition-all duration-500 rounded-full ${
                      currentImageIndex === idx
                        ? "w-2 h-2 bg-white shadow-md"
                        : "w-1.5 h-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}

          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 pointer-events-none ${
              isHovered && !isMobile
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          />

          {!isMobile && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
              }}
            />
          )}

          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none ${
              isHovered && !isMobile
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <span className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white text-sm uppercase tracking-wider">
              View Project
            </span>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 relative">
          <motion.h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold transition-colors duration-300 group-hover:text-[var(--accent)] line-clamp-1"
            animate={{
              x:
                isHovered && !isMobile
                  ? 8
                  : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
          >
            {project.title}
          </motion.h3>

          <p className="text-[var(--muted)] mt-1 text-xs sm:text-sm uppercase tracking-wider">
            {project.location} | {project.year}
          </p>

          <p className="text-[var(--muted)] mt-0.5 text-xs">
            {project.type} • {project.category}
          </p>

          <p className="mt-2 inline-flex items-center gap-2">
            <span className="text-[var(--muted)] text-[11px] uppercase tracking-wider">
              Status
            </span>

            <span className="text-[11px] px-2 py-1 rounded-full border border-[var(--border)] bg-white/50">
              {project.status}
            </span>
          </p>

          <motion.div
            className="h-[1px] bg-[var(--accent)] mt-3"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX:
                isHovered && !isMobile
                  ? 1
                  : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{
              transformOrigin: "left",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ProjectCardSkeleton = () => (
  <div className="h-full">
    <div className="relative h-full flex flex-col">
      <div className="overflow-hidden relative w-full aspect-[4/3] bg-gray-200 animate-pulse" />

      <div className="mt-4 sm:mt-5">
        <div className="h-7 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
      </div>
    </div>
  </div>
);

const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  projectCounts,
}) => {
  const [isScrolled, setIsScrolled] =
    useState(false);

  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target
        )
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "click",
        handleClickOutside
      );
  }, []);

  const handleCategorySelect = (
    category
  ) => {
    onCategoryChange(category);
    setIsDropdownOpen(false);
  };

  const allCategories = [
    "ALL",
    ...categories,
  ];

  return (
    <>
      <motion.div
        className={`sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[var(--border)] transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : ""
        } hidden md:block`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: 0.2,
        }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex flex-wrap items-center gap-2 py-2.5 overflow-x-auto scrollbar-hide">
              {allCategories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() =>
                    onCategoryChange(category)
                  }
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeCategory === category
                      ? "text-white"
                      : "text-[var(--black)] hover:text-[var(--accent)]"
                  }`}
                >
                  {activeCategory ===
                    category && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--black)] rounded-full"
                      transition={{
                        type: "spring",
                        duration: 0.5,
                      }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    {category === "ALL"
                      ? "All Projects"
                      : category}

                    <span className="text-xs opacity-70">
                      (
                      {projectCounts[
                        category
                      ] || 0}
                      )
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[var(--border)] py-2.5">
        <div className="w-full px-4">
          <div
            className="relative"
            ref={dropdownRef}
          >
            <button
              onClick={() =>
                setIsDropdownOpen(
                  !isDropdownOpen
                )
              }
              className="flex items-center justify-between w-full px-5 py-3 bg-[var(--black)] rounded-xl text-white shadow-lg"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-[var(--muted)] opacity-70">
                  Filter by
                </span>

                <span className="text-base font-semibold">
                  {activeCategory ===
                  "ALL"
                    ? "All Projects"
                    : activeCategory}
                </span>
              </div>

              <motion.div
                animate={{
                  rotate:
                    isDropdownOpen
                      ? 180
                      : 0,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[var(--border)] overflow-hidden z-50"
                >
                  <div className="max-h-80 overflow-y-auto">
                    {allCategories.map(
                      (category) => (
                        <button
                          key={category}
                          onClick={() =>
                            handleCategorySelect(
                              category
                            )
                          }
                          className={`w-full px-5 py-3 flex items-center justify-between transition-colors ${
                            activeCategory ===
                            category
                              ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                              : "text-[var(--black)] hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-base font-medium">
                            {category ===
                            "ALL"
                              ? "All Projects"
                              : category}
                          </span>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm ${
                                activeCategory ===
                                category
                                  ? "text-[var(--accent)]"
                                  : "text-[var(--muted)]"
                              }`}
                            >
                              (
                              {projectCounts[
                                category
                              ] || 0}
                              )
                            </span>

                            {activeCategory ===
                              category && (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ProjectsPage() {
  const [projects, setProjects] =
    useState([]);

  const [selectedProjectId, setSelectedProjectId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // FILTER BY TYPE
  const [activeType, setActiveType] =
    useState("ALL");

  const [stats, setStats] = useState({
    totalProjects: 0,
    citiesCount: 0,
    yearsExperience: "-",
  });

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "/api/projects"
      );

      const data = await res.json();

      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error(
        "Error fetching projects:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch project stats and about page in parallel so we can derive
      // a dynamic "years of experience" value from the about data.
      const [statsRes, aboutRes] = await Promise.all([
        fetch("/api/projects/stats"),
        fetch("/api/about"),
      ]);

      const statsData = await statsRes.json();

      // default fallback
      let years = "-";

      try {
        if (aboutRes.ok) {
          const aboutJson = await aboutRes.json();

          if (aboutJson.success && aboutJson.data) {
            const studioStats = aboutJson.data?.studio?.stats;

            // First prefer the studio.yearsExperience fixed field (added to schema)
            if (aboutJson.data?.studio?.yearsExperience) {
              years = aboutJson.data.studio.yearsExperience;
            } else if (Array.isArray(studioStats)) {
              // fallback: find a stat whose label or value mentions "year(s)"
              const yearStat = studioStats.find((s) =>
                /year/i.test(String(s.label || "")) || /year/i.test(String(s.value || ""))
              );

              if (yearStat && yearStat.value) {
                years = yearStat.value;
              }
            }

            // fallback: compute from hero recognized/established year if available
            if ((years === "-" || !years) && aboutJson.data?.hero) {
              const hero = aboutJson.data.hero;
              const refYear = parseInt(hero.recognizedYear) || parseInt(hero.establishedYear);

              if (!isNaN(refYear)) {
                const computed = new Date().getFullYear() - refYear;
                years = `${computed > 0 ? computed : 0}+`;
              }
            }
          }
        }
      } catch (err) {
        console.error("Error deriving years from about API:", err);
      }

      if (statsData.success) {
        setStats({
          totalProjects: statsData.stats.totalProjects,
          citiesCount: statsData.stats.citiesCount,
          yearsExperience: years,
        });
      }
    } catch (error) {
      console.error(
        "Error fetching stats:",
        error
      );
    }
  };

  // TYPES
  const types = useMemo(() => {
    const uniqueTypes = new Set();

    projects.forEach((project) => {
      if (project.type) {
        uniqueTypes.add(project.type);
      }
    });

    return Array.from(uniqueTypes).sort();
  }, [projects]);

  // COUNTS
  const projectCounts = useMemo(() => {
    const counts = {
      ALL: projects.length,
    };

    types.forEach((type) => {
      counts[type] = projects.filter(
        (p) => p.type === type
      ).length;
    });

    return counts;
  }, [projects, types]);

  // FILTERED PROJECTS
  const filteredProjects = useMemo(() => {
    if (activeType === "ALL") {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.type === activeType
    );
  }, [projects, activeType]);

  const containerVariants = {
    hidden: { opacity: 0 },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <>
      <section className="bg-[var(--white)] text-[var(--black)] min-h-screen">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-10 lg:py-12">
          <div className="max-w-[1800px] mx-auto">
            <motion.div
              className="mb-8 lg:mb-10"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-6">
                <div className="flex-1">
                  <motion.h1
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-2 lg:mb-3 leading-[1.15]"
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.15,
                    }}
                  >
                    Curated
                    <br />
                    Works
                  </motion.h1>

                  <motion.p
                    className="text-[var(--muted)] max-w-2xl text-sm sm:text-base lg:text-lg"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                  >
                   Conceived with intent. Delivered with precision. Every endeavour a living 
expression of purpose.
                  </motion.p>
                </div>

                <motion.div
                  className="flex gap-6 lg:gap-8"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.25,
                  }}
                >
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-[var(--accent)]">
                      {loading
                        ? "-"
                        : stats.totalProjects}
                    </p>

                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider mt-0.5">
                      Projects
                    </p>
                  </div>

                  <div className="w-[1px] h-8 lg:h-10 bg-[var(--muted)]/20" />

                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-[var(--accent)]">
                      {loading
                        ? "-"
                        : stats.citiesCount}
                    </p>

                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider mt-0.5">
                      Cities
                    </p>
                  </div>

                  <div className="w-[1px] h-8 lg:h-10 bg-[var(--muted)]/20" />

                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-[var(--accent)]">
                      {
                        stats.yearsExperience
                      }
                    </p>

                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider mt-0.5">
                      Years
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {!loading &&
              types.length > 0 && (
                <CategoryFilter
                  categories={types}
                  activeCategory={
                    activeType
                  }
                  onCategoryChange={
                    setActiveType
                  }
                  projectCounts={
                    projectCounts
                  }
                />
              )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeType}
                variants={
                  containerVariants
                }
                initial="hidden"
                animate="visible"
                exit={{
                  opacity: 0,
                  y: 20,
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 auto-rows-fr mt-6 lg:mt-8"
              >
                {loading ? (
                  [...Array(6)].map(
                    (_, i) => (
                      <ProjectCardSkeleton
                        key={i}
                      />
                    )
                  )
                ) : filteredProjects.length >
                  0 ? (
                  filteredProjects.map(
                    (
                      project,
                      index
                    ) => (
                      <ProjectCard
                        key={
                          project._id ||
                          project.id
                        }
                        project={
                          project
                        }
                        index={index}
                        onClick={
                          setSelectedProjectId
                        }
                      />
                    )
                  )
                ) : (
                  <motion.div
                    className="col-span-full text-center py-12"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                  >
                    <p className="text-[var(--muted)] text-lg">
                      No projects found
                      in this type.
                    </p>

                    <button
                      onClick={() =>
                        setActiveType(
                          "ALL"
                        )
                      }
                      className="mt-3 text-[var(--accent)] hover:underline"
                    >
                      View all projects
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="mt-12 lg:mt-16 text-center"
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
            >
              <p className="text-[var(--muted)] text-xs uppercase tracking-[0.3em]">
                — More Coming Soon —
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProjectId && (
          <ProjectModal
            projectId={
              selectedProjectId
            }
            projects={projects}
            onClose={() =>
              setSelectedProjectId(
                null
              )
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}