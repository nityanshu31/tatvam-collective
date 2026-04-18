// app/projects/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
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

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -3;
    const rotateYValue = ((x - centerX) / centerX) * 3;
    
    const glareXValue = (x / rect.width) * 100;
    const glareYValue = (y / rect.height) * 100;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setGlareX(glareXValue);
    setGlareY(glareYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="cursor-pointer h-full"
      onClick={() => onClick(project._id || project.id)}
    >
      <div
        ref={cardRef}
        className="relative group h-full flex flex-col"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Image container */}
        <div className="overflow-hidden rounded-2xl relative w-full aspect-[4/3]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index < 4}
            unoptimized={true}
          />
          
          {/* Overlay gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          
          {/* Glare effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
            }}
          />
          
          {/* View project button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white text-sm uppercase tracking-wider">
              View Project
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 sm:mt-5 relative">
          <motion.h3 
            className="text-lg sm:text-xl lg:text-2xl font-semibold transition-colors duration-300 group-hover:text-[var(--accent)] line-clamp-1"
            animate={{ x: isHovered ? 8 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {project.title}
          </motion.h3>
          <p className="text-[var(--muted)] mt-1 text-xs sm:text-sm uppercase tracking-wider">
            {project.location}
          </p>
          
          {/* Animated underline */}
          <motion.div 
            className="h-[1px] bg-[var(--accent)] mt-3"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Loading skeleton
const ProjectCardSkeleton = () => (
  <div className="h-full">
    <div className="relative h-full flex flex-col">
      <div className="overflow-hidden rounded-2xl relative w-full aspect-[4/3] bg-gray-200 animate-pulse" />
      <div className="mt-4 sm:mt-5">
        <div className="h-7 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
      </div>
    </div>
  </div>
);

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    citiesCount: 0,
    yearsExperience: "15+"
  });

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log("projects",projects)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/projects/stats');
      const data = await res.json();
      
      if (data.success) {
        setStats({
          totalProjects: data.stats.totalProjects,
          citiesCount: data.stats.citiesCount,
          yearsExperience: "15+"
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <>
      <section className="bg-[var(--white)] text-[var(--black)] min-h-screen">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-20 lg:py-24">
          <div className="max-w-[1800px] mx-auto">
            <motion.div 
              className="mb-12 lg:mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
                <div className="flex-1">
                  <motion.p 
                    className="text-[var(--accent)] uppercase tracking-[0.3em] text-xs sm:text-sm mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Portfolio
                  </motion.p>

                  <motion.h1 
                    className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-4 lg:mb-6 leading-[1.1]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    Selected
                    <br />
                    Projects
                  </motion.h1>

                  <motion.p 
                    className="text-[var(--muted)] max-w-2xl text-base sm:text-lg lg:text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    A curated collection of architectural works reflecting our design
                    philosophy, attention to detail, and commitment to timeless spaces.
                  </motion.p>
                </div>
                
                <motion.div 
                  className="flex gap-6 lg:gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="text-right">
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--accent)]">
                      {loading ? '-' : stats.totalProjects}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--muted)] uppercase tracking-wider mt-1">Projects</p>
                  </div>
                  <div className="w-[1px] h-12 lg:h-16 bg-[var(--muted)]/20" />
                  <div className="text-right">
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--accent)]">
                      {loading ? '-' : stats.citiesCount}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--muted)] uppercase tracking-wider mt-1">Cities</p>
                  </div>
                  <div className="w-[1px] h-12 lg:h-16 bg-[var(--muted)]/20" />
                  <div className="text-right">
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--accent)]">
                      {stats.yearsExperience}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--muted)] uppercase tracking-wider mt-1">Years</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8 auto-rows-fr">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))
              ) : (
                projects.map((project, index) => (
                  <ProjectCard 
                    key={project._id || project.id}
                    project={project} 
                    index={index} 
                    onClick={setSelectedProjectId}
                  />
                ))
              )}
            </div>
            
            <motion.div 
              className="mt-16 lg:mt-24 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-[var(--muted)] text-sm uppercase tracking-[0.3em]">
                — More Coming Soon —
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProjectId && (
          <ProjectModal 
            projectId={selectedProjectId}
            projects={projects}
            onClose={() => setSelectedProjectId(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}