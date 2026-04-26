"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  projectCounts,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sticky shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setIsDropdownOpen(false);
  };

  const allCategories = ["ALL", ...categories];

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <motion.div
        className={`sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[var(--border)] transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : ""
        } hidden md:block`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex flex-wrap items-center gap-2 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
              {allCategories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCategoryChange(category)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeCategory === category
                      ? "text-white"
                      : "text-[var(--black)] hover:text-[var(--accent)]"
                  }`}
                >
                  {activeCategory === category && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--black)] rounded-full"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    {category === "ALL" ? "All Projects" : category}
                    <span className="text-xs opacity-70">
                      ({projectCounts[category] || 0})
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[var(--border)] py-3">
        <div className="w-full px-4">
          <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full px-5 py-3 bg-[var(--black)] rounded-xl text-white shadow-lg"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-[var(--muted)] opacity-70">
                  Filter by
                </span>
                <span className="text-base font-semibold">
                  {activeCategory === "ALL"
                    ? "All Projects"
                    : activeCategory}
                </span>
              </div>

              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
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

            {/* Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[var(--border)] overflow-hidden z-50"
                >
                  <div className="max-h-80 overflow-y-auto">
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full px-5 py-3 flex items-center justify-between transition-colors ${
                          activeCategory === category
                            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "text-[var(--black)] hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-base font-medium">
                          {category === "ALL"
                            ? "All Projects"
                            : category}
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm ${
                              activeCategory === category
                                ? "text-[var(--accent)]"
                                : "text-[var(--muted)]"
                            }`}
                          >
                            ({projectCounts[category] || 0})
                          </span>

                          {activeCategory === category && (
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
                    ))}
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

export default CategoryFilter;