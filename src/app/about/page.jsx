// app/about/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

// Mock Data
const mockData = {
  hero: {
    establishedYear: "2025",
    recognizedYear: "2017",
    title: "About Us",
    subtitle: "— Tatvam Collective",
    description:
      "Multidisciplinary design and consulting practice based in Vadodara, working across architecture, interior design, urban planning, and construction.",
  },
  philosophy: {
    tagline: "OUR PHILOSOPHY",
    quote:
      "Every space holds a Tatva — an intrinsic essence that defines its purpose, experience, and identity.",
    description:
      "At Tatvam Collective, design is approached as a thoughtful synthesis of space, function, material, and human experience. Rather than viewing architecture as a mere physical outcome, we see it as a layered process of inquiry and expression — where ideas are carefully analyzed, articulated, and translated into meaningful built environments.",
  },
  studio: {
    tagline: "The Studio",
    title: "Led by a duo of architects",
    description:
      "The studio delivers context-driven solutions that balance aesthetic clarity with technical precision. Each project is treated as a cohesive journey — from concept to completion — guided by disciplined processes, integrated consultancy, and a commitment to excellence in execution.",
    stats: [
      { value: "50+", label: "Projects Delivered" },
      { value: "8+", label: "Years of Excellence" },
      { value: "Pan-India", label: "Presence" },
      { value: "24/7", label: "Client Support" },
    ],
    testimonial: {
      quote:
        "We aim to craft spaces that resonate with their users and contribute meaningfully to the built environment — not just as structures, but as living expressions of purpose.",
      author: "— Founders, Tatvam Collective",
    },
  },
  workScope: {
    sectors: {
      title: "SECTORS",
      items: [
        "Residential Architecture",
        "Institutional Design",
        "Urban Planning",
        "Interior Design",
        "Construction Consulting",
        "Commercial Spaces",
        "Hospitality",
        "Landscape Design",
      ],
    },
    approach: {
      title: "APPROACH",
      items: [
        "Context-driven solutions",
        "Aesthetic clarity",
        "Technical precision",
        "Integrated consultancy",
        "Concept-to-key delivery",
        "Sustainable practices",
        "User-centric design",
        "Innovative materials",
      ],
    },
    commitment: {
      title: "COMMITMENT",
      description:
        "Seamless 'concept-to-key' experience — ensuring clarity, accountability, and integrity at every stage of the project, from first sketch to final handover.",
    },
  },
  founders: {
    title: "Meet the Founders",
    subtitle:
      "A visionary duo shaping spaces with purpose, precision, and a deep understanding of the human experience.",
    founders: [
      {
        id: 1,
        name: "Founder 1 ",
        role: "Rolw",
        bio: "With over a decade of experience in urban design and sustainable architecture, Aditya brings a rigorous analytical approach to every project, ensuring that each space is both functional and inspiring. His work has been featured in Architectural Digest and India Today.",
        image: "/founder-1.jpg",
        social: {
          linkedin: "https://linkedin.com/in/aditya-sharma",
          email: "founder1@tatvam.com",
          twitter: "https://twitter.com/aditya_tatvam",
        },
        achievements: [
          "IIA Young Architect Award 2020",
          "Featured in '40 Under 40' 2023",
          "LEED Accredited Professional",
        ],
      },
      {
        id: 2,
        name: "Founder 2 ",
        bio: "Bio",
        image: "/founder-2.jpg",
        social: {
          linkedin: "https://linkedin.com/in/meera-desai",
          email: "meera@tatvam.com",
          twitter: "https://twitter.com/meera_tatvam",
        },
        achievements: [
          "IED Best Interior Designer 2022",
          "Design Excellence Award 2024",
          "Published in Elle Decor India",
        ],
      },
    ],
  },
  cta: {
    title: "Ready to craft your Tatva?",
    subtitle:
      "Let's collaborate to create spaces that resonate, endure, and inspire.",
    buttons: [
      { label: "Start a Project", primary: true },
      { label: "Contact Us", primary: false },
    ],
  },
};

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
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
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
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }}
  >
    {children}
  </motion.div>
);

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C6A77D] blur-[150px] opacity-30" />
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
                ✦ EST. {mockData.hero.recognizedYear}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
              {mockData.hero.title}
              <span className="block text-[#C6A77D] mt-2">
                {mockData.hero.subtitle}
              </span>
            </h1>
            <div className="w-20 h-0.5 bg-[#C6A77D] mb-8" />
            <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed">
              {mockData.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="max-w-4xl mx-auto text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] rounded-full mb-8">
                <span className="text-[#C6A77D] text-lg">✧</span>
                <span className="text-[#111111] text-sm font-medium tracking-wide">
                  {mockData.philosophy.tagline}
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif italic text-[#111111] mb-8 leading-tight">
                {mockData.philosophy.quote.split("Tatva")[0]}
                <span className="text-[#C6A77D] not-italic">Tatva</span>
                {mockData.philosophy.quote.split("Tatva")[1]}
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed max-w-3xl mx-auto">
                {mockData.philosophy.description}
              </p>
            </div>
          </FadeInUp>

          {/* Studio Section */}
          <div className="grid md:grid-cols-2 gap-12 items-start mb-24">
            <FadeInUp delay={0.2}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2">
                  <span className="text-[#C6A77D] text-2xl">✦</span>
                  <span className="text-[#111111] text-sm font-semibold tracking-wider uppercase">
                    {mockData.studio.tagline}
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-[#111111] leading-tight">
                  {mockData.studio.title}
                </h3>
                <div className="w-16 h-px bg-[#C6A77D]" />
                <p className="text-[#6B7280] text-lg leading-relaxed">
                  {mockData.studio.description}
                </p>
                <div className="pt-4 grid grid-cols-2 gap-6">
                  {mockData.studio.stats.map((stat, idx) => (
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
                  “{mockData.studio.testimonial.quote}”
                </p>
                <p className="mt-4 text-[#C6A77D] font-medium">
                  {mockData.studio.testimonial.author}
                </p>
              </div>
            </FadeInUp>
          </div>

          {/* Work Scope */}
          <FadeInUp delay={0.6}>
            <div className="border-t border-[#E5E7EB] pt-20">
              <div className="grid md:grid-cols-3 gap-12">
                <div>
                  <h4 className="text-[#C6A77D] text-sm font-bold tracking-wider mb-4">
                    {mockData.workScope.sectors.title}
                  </h4>
                  <StaggerChildren>
                    <ul className="space-y-3">
                      {mockData.workScope.sectors.items.map((item, idx) => (
                        <StaggerItem key={idx}>
                          <li className="text-[#111111] font-medium hover:text-[#C6A77D] transition-colors cursor-pointer">
                            {item}
                          </li>
                        </StaggerItem>
                      ))}
                    </ul>
                  </StaggerChildren>
                </div>
                <div>
                  <h4 className="text-[#C6A77D] text-sm font-bold tracking-wider mb-4">
                    {mockData.workScope.approach.title}
                  </h4>
                  <StaggerChildren>
                    <ul className="space-y-3">
                      {mockData.workScope.approach.items.map((item, idx) => (
                        <StaggerItem key={idx}>
                          <li className="text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer">
                            {item}
                          </li>
                        </StaggerItem>
                      ))}
                    </ul>
                  </StaggerChildren>
                </div>
                <div>
                  <h4 className="text-[#C6A77D] text-sm font-bold tracking-wider mb-4">
                    {mockData.workScope.commitment.title}
                  </h4>
                  <p className="text-[#6B7280] leading-relaxed">
                    {mockData.workScope.commitment.description}
                  </p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="mt-6 inline-flex items-center gap-2 text-[#111111] font-medium border-b border-[#C6A77D] pb-1 cursor-pointer group"
                  >
                    Learn more{" "}
                    <span className="text-[#C6A77D] group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 md:py-28 bg-[#FBFBFB] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[#C6A77D] text-sm font-mono tracking-wider">
                ✦ THE MINDS BEHIND
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#111111] mt-4 mb-6">
                {mockData.founders.title}
              </h2>
              <div className="w-12 h-px bg-[#C6A77D] mx-auto" />
              <p className="text-[#6B7280] mt-6">{mockData.founders.subtitle}</p>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {mockData.founders.founders.map((founder, idx) => (
              <motion.div
                key={founder.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#E5E7EB] aspect-[4/5] mb-6">
                  {/* Placeholder for actual image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#111111] to-[#1a1a1a] text-white">
                    <div className="text-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-[#C6A77D] text-6xl mb-4"
                      >
                        ✧
                      </motion.div>
                      <p className="text-sm text-[#6B7280]">Professional Photo</p>
                      <p className="text-xs text-[#6B7280] mt-2">
                        Coming Soon
                      </p>
                    </div>
                  </div>
                  {/* Uncomment when images are ready */}
                  {/* <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  /> */}
                </div>
                <div className="text-center md:text-left">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-2xl font-bold text-[#111111]"
                  >
                    {founder.name}
                  </motion.h3>
                  <p className="text-[#C6A77D] font-medium mb-3">{founder.role}</p>
                  <p className="text-[#6B7280] leading-relaxed mb-4">
                    {founder.bio}
                  </p>
                  <div className="mb-4">
                    <p className="text-xs text-[#C6A77D] font-semibold uppercase tracking-wider mb-2">
                      Achievements
                    </p>
                    <ul className="text-sm text-[#6B7280] space-y-1">
                      {founder.achievements.map((achievement, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-[#C6A77D]">✓</span>
                          {achievement}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-4 mt-4 justify-center md:justify-start">
                    <motion.a
                      whileHover={{ y: -2 }}
                      href={founder.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#111111] text-sm hover:text-[#C6A77D] transition-colors"
                    >
                      LinkedIn
                    </motion.a>
                    <span className="text-[#6B7280]">/</span>
                    <motion.a
                      whileHover={{ y: -2 }}
                      href={`mailto:${founder.social.email}`}
                      className="text-[#111111] text-sm hover:text-[#C6A77D] transition-colors"
                    >
                      Email
                    </motion.a>
                    <span className="text-[#6B7280]">/</span>
                    <motion.a
                      whileHover={{ y: -2 }}
                      href={founder.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#111111] text-sm hover:text-[#C6A77D] transition-colors"
                    >
                      Twitter
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#111111] text-white py-20 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#C6A77D] blur-[150px]" />
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-[#C6A77D] text-4xl mb-4 inline-block"
          >
            ✦
          </motion.div>
          <FadeInUp>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to craft your{" "}
              <span className="text-[#C6A77D]">Tatva</span>?
            </h2>
            <p className="text-[#6B7280] text-lg mb-10 max-w-2xl mx-auto">
              {mockData.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {mockData.cta.buttons.map((btn, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-3 font-semibold rounded-full transition-all duration-300 ${
                    btn.primary
                      ? "bg-[#C6A77D] text-[#111111] hover:bg-opacity-90"
                      : "border border-[#C6A77D] text-[#C6A77D] hover:bg-[#C6A77D] hover:text-[#111111]"
                  }`}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </FadeInUp>
        </div>
      </section>
    </main>
  );
}