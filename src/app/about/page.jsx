"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";

// Animation Components
const FadeInUp = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
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
        hidden: { opacity: 0, y: 30 },
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
  const isInView = useInView(ref, { once: true });
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
        hidden: { opacity: 0 },
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
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      },
    }}
  >
    {children}
  </motion.div>
);

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/about");
        const result = await res.json();

        console.log(result);

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
    <main className="bg-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative bg-[#111111] text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#C6A77D] blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#C6A77D] blur-[120px] animate-pulse" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
      </section>

      {/* Philosophy Section */}
      {aboutData?.visibility?.philosophy && (
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <FadeInUp>
              <div className="max-w-4xl mx-auto text-center mb-20">

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

            {/* Studio */}
            {aboutData?.visibility?.studio && (
              <div className="grid md:grid-cols-2 gap-12 items-start mb-24">

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
                          whileHover={{ scale: 1.05 }}
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
            )}

            {/* Work Scope */}
            <FadeInUp delay={0.6}>
              <div className="border-t border-[#E5E7EB] pt-20">

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

              </div>
            </FadeInUp>

          </div>
        </section>
      )}

      {/* Founders Section */}
      {aboutData?.visibility?.founders && (
        <section className="py-20 md:py-28 bg-[#FBFBFB] border-t border-[#E5E7EB]">

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
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  viewport={{ once: true }}
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