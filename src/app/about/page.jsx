"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";

// Animation Components
const FadeInUp = ({ children, delay = 0 }) => {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
          y: 30,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const StaggerChildren = ({ children }) => {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
  });

  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children }) => (
  <motion.div
    variants={{
      hidden: {
        opacity: 0,
        y: 20,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  const sectionRefs = useRef([]);
  const currentSection = useRef(0);

  const scrollToSection = (index) => {
    if (
      index >= 0 &&
      index < sectionRefs.current.length &&
      sectionRefs.current[index]
    ) {
      currentSection.current = index;
      setActiveSection(index);

      sectionRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToSection(currentSection.current + 1);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToSection(currentSection.current - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Detect Current Section
  useEffect(() => {
    const observers = [];

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            currentSection.current = index;
            setActiveSection(index);
          }
        },
        {
          threshold: 0.6,
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [aboutData]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/about");
        const result = await res.json();

        if (result.success) {
          setAboutData(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !aboutData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C6A77D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-[#6B7280]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="bg-white h-screen snap-y snap-mandatory scroll-smooth relative overflow-y-auto overflow-x-hidden"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style jsx>{`
        main::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Navigation Dots */}
      <div className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {sectionRefs.current.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? "bg-[#C6A77D] scale-125"
                : "bg-[#D1D5DB] hover:bg-[#9CA3AF]"
            }`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        className="relative bg-[#111111] text-white overflow-hidden snap-start min-h-screen"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#C6A77D] blur-[100px] animate-pulse" />

          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#C6A77D] blur-[120px] animate-pulse" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 h-screen flex items-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="max-w-3xl"
          >
            <div className="inline-block mb-6">
              <span className="text-[#C6A77D] font-mono text-sm tracking-wider">
                ✦ EST. {aboutData?.hero?.recognizedYear}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
              {aboutData?.hero?.title}

              <span className="font-para-regular block text-[#C6A77D] mt-2 tracking-[0.15em]">
                {aboutData?.hero?.subtitle}
              </span>
            </h1>

            <div className="w-20 h-0.5 bg-[#C6A77D] mb-8" />

            <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed">
              {aboutData?.hero?.description}
            </p>
          </motion.div>
        </div>

        {/* Scroll Down Button */}
        <motion.button
          onClick={() => scrollToSection(1)}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-[#C6A77D]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.button>
      </section>

      {/* Philosophy Section */}
      {aboutData?.visibility?.philosophy && (
        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          className="py-24 md:py-32 bg-white snap-start min-h-screen flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] rounded-full mb-8">
                  <span className="text-[#C6A77D] text-lg">✧</span>

                  <span className="text-[#111111] text-sm font-medium tracking-wide">
                    {aboutData?.philosophy?.tagline}
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-serif italic text-[#111111] mb-8 leading-tight">
                  {aboutData?.philosophy?.quote}
                </h2>

                <p className="text-[#6B7280] text-lg leading-relaxed max-w-3xl mx-auto">
                  {aboutData?.philosophy?.description}
                </p>
              </div>
            </FadeInUp>
          </div>
        </section>
      )}

      {/* Studio Section */}
      {aboutData?.visibility?.studio && (
        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className="py-24 md:py-32 bg-white snap-start min-h-screen flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <FadeInUp delay={0.2}>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[#C6A77D] text-2xl">✦</span>

                    <span className="text-[#111111] text-sm font-semibold tracking-wider uppercase">
                      {aboutData?.studio?.tagline}
                    </span>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-bold text-[#111111] leading-tight">
                    {aboutData?.studio?.title}
                  </h3>

                  <div className="w-16 h-px bg-[#C6A77D]" />

                  <p className="text-[#6B7280] text-lg leading-relaxed">
                    {aboutData?.studio?.description}
                  </p>

                  <div className="pt-4 grid grid-cols-2 gap-6">
                    {aboutData?.studio?.stats?.map((stat, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{
                          scale: 1.05,
                        }}
                        className="border-l-2 border-[#C6A77D] pl-4"
                      >
                        <p className="text-2xl font-bold text-[#111111]">
                          {stat.value}
                        </p>

                        <p className="text-sm text-[#6B7280] uppercase tracking-wide">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <div className="relative bg-[#F9F9F9] p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-[#C6A77D]" />

                  <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-[#C6A77D]" />

                  <p className="text-[#111111] text-lg italic font-serif leading-relaxed">
                    “{aboutData?.studio?.testimonial?.quote}”
                  </p>

                  <p className="mt-4 text-[#C6A77D] font-medium">
                    {aboutData?.studio?.testimonial?.author}
                  </p>
                </div>
              </FadeInUp>
            </div>
          </div>
        </section>
      )}

      {/* Work Scope Section */}
      <section
        ref={(el) => (sectionRefs.current[3] = el)}
        className="py-24 md:py-32 bg-white snap-start min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp delay={0.6}>
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-[#C6A77D] text-sm font-bold tracking-wider mb-4">
                  {aboutData?.workScope?.sectors?.title}
                </h4>

                <StaggerChildren>
                  <ul className="space-y-3">
                    {aboutData?.workScope?.sectors?.items?.map((item, idx) => (
                      <StaggerItem key={idx}>
                        <li className="text-[#111111] font-medium hover:text-[#C6A77D] transition-colors">
                          {item}
                        </li>
                      </StaggerItem>
                    ))}
                  </ul>
                </StaggerChildren>
              </div>

              <div>
                <h4 className="text-[#C6A77D] text-sm font-bold tracking-wider mb-4">
                  {aboutData?.workScope?.approach?.title}
                </h4>

                <StaggerChildren>
                  <ul className="space-y-3">
                    {aboutData?.workScope?.approach?.items?.map((item, idx) => (
                      <StaggerItem key={idx}>
                        <li className="text-[#6B7280] hover:text-[#111111] transition-colors">
                          {item}
                        </li>
                      </StaggerItem>
                    ))}
                  </ul>
                </StaggerChildren>
              </div>

              <div>
                <h4 className="text-[#C6A77D] text-sm font-bold tracking-wider mb-4">
                  {aboutData?.workScope?.commitment?.title}
                </h4>

                <p className="text-[#6B7280] leading-relaxed">
                  {aboutData?.workScope?.commitment?.description}
                </p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Founders Section */}
      {aboutData?.visibility?.founders && (
        <section
          ref={(el) => (sectionRefs.current[4] = el)}
          className="py-24 md:py-32 bg-[#FBFBFB] border-t border-[#E5E7EB] snap-start min-h-screen flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[#C6A77D] text-sm font-mono tracking-wider">
                  ✦ THE MINDS BEHIND
                </span>

                <h2 className="text-3xl md:text-5xl font-bold text-[#111111] mt-4 mb-6">
                  {aboutData?.founders?.title}
                </h2>

                <div className="w-12 h-px bg-[#C6A77D] mx-auto" />

                <p className="text-[#6B7280] mt-6">
                  {aboutData?.founders?.subtitle}
                </p>
              </div>
            </FadeInUp>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {aboutData?.founders?.founders?.map((founder, idx) => (
                <motion.div
                  key={idx}
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.2,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-[#E5E7EB] aspect-[4/5] mb-6">
                    {founder?.image ? (
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#111111] to-[#1a1a1a] text-white">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-[#111111]">
                      {founder?.name}
                    </h3>

                    <p className="text-[#C6A77D] font-medium mb-3">
                      {founder?.role}
                    </p>

                    <p className="text-[#6B7280] leading-relaxed mb-4">
                      {founder?.bio}
                    </p>

                    <div className="mb-4">
                      <p className="text-xs text-[#C6A77D] font-semibold uppercase tracking-wider mb-2">
                        Achievements
                      </p>

                      <ul className="text-sm text-[#6B7280] space-y-1">
                        {founder?.achievements?.map((achievement, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2"
                          >
                            <span className="text-[#C6A77D]">✓</span>

                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Social links */}
                    <div className="mt-4 flex items-center gap-3">
                      {founder?.social?.linkedin && (
                        <a href={founder.social.linkedin} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-black">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.983 3.5C4.983 4.88071 3.864 6 2.483 6C1.103 6 0 4.88071 0 3.5C0 2.11929 1.103 1 2.483 1C3.864 1 4.983 2.11929 4.983 3.5Z" fill="currentColor"/>
                            <path d="M6.75 8.25H0V24H6.75V8.25Z" fill="currentColor" opacity="0.9"/>
                            <path d="M24 24H17.25V14.25C17.25 12.2812 16.219 10.5 13.7812 10.5C11.375 10.5 10.5 12.1562 10.5 14.0625V24H3.75V8.25H10.125V10.125H10.2188C10.95 8.76562 12.6562 7.5 15.6562 7.5C20.1562 7.5 24 10.3125 24 16.0312V24Z" fill="currentColor"/>
                          </svg>
                        </a>
                      )}

                      {founder?.social?.email && (
                        <a href={`mailto:${founder.social.email}`} className="text-gray-700 hover:text-black">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                          </svg>
                        </a>
                      )}

                      {founder?.social?.twitter && (
                        <a href={founder.social.twitter} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-black">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.46 6.003c-.77.344-1.6.576-2.46.68a4.27 4.27 0 0 0 1.88-2.36 8.53 8.53 0 0 1-2.71 1.04 4.26 4.26 0 0 0-7.26 3.88A12.08 12.08 0 0 1 3.15 4.67a4.26 4.26 0 0 0 1.32 5.69c-.64-.02-1.24-.2-1.77-.5v.05c0 2.04 1.45 3.75 3.37 4.14-.56.15-1.15.18-1.76.07.5 1.57 1.95 2.71 3.67 2.74A8.55 8.55 0 0 1 2 19.54a12.06 12.06 0 0 0 6.53 1.91c7.84 0 12.13-6.5 12.13-12.13 0-.18-.01-.36-.02-.54.83-.6 1.54-1.35 2.11-2.2a8.3 8.3 0 0 1-2.99.82z" fill="currentColor"/>
                          </svg>
                        </a>
                      )}

                      {founder?.social?.instagram && (
                        <a href={founder.social.instagram} target="_blank" rel="noreferrer" className="text-gray-700 hover:text-black">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7z" fill="currentColor"/>
                            <circle cx="12" cy="12" r="3" fill="currentColor"/>
                            <circle cx="18" cy="6" r="1" fill="currentColor"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}