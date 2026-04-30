// components/SmartSections/SectionControls.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SectionControls = ({ sections, visibleSections, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const visibleCount = visibleSections.length;
  const totalCount = sections.length;

  // Desktop: Show all toggles horizontally
  if (!isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pb-4 border-b border-[var(--border)]"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-[var(--black)]">Show:</span>
          {sections.map((section) => {
            const isVisible = visibleSections.includes(section.id);
            return (
              <button
                key={section.id}
                onClick={() => onToggle(section.id, !isVisible)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                  isVisible
                    ? "bg-[var(--black)] text-white"
                    : "bg-gray-100 text-[var(--muted)] hover:bg-gray-200"
                }`}
              >
                {section.title}
                <span className="ml-1 text-xs opacity-70">({section.type})</span>
              </button>
            );
          })}
          
          {/* Reset button */}
          {visibleCount !== totalCount && (
            <button
              onClick={() => sections.forEach(s => {
                if (!visibleSections.includes(s.id)) {
                  onToggle(s.id, true);
                }
              })}
              className="ml-2 text-xs text-[var(--accent)] hover:underline"
            >
              Show All
            </button>
          )}
        </div>
        
        {/* Layout indicator */}
        <p className="text-xs text-[var(--muted)] mt-3">
          {visibleCount === 1 && "Single column layout"}
          {visibleCount === 2 && "Two column layout"}
          {visibleCount >= 3 && "Three column layout"}
          {visibleCount === 0 && "No sections visible"}
        </p>
      </motion.div>
    );
  }

  // Mobile: Dropdown menu
  return (
    <div className="mb-6" ref={dropdownRef}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 bg-[var(--black)] text-white rounded-xl shadow-md"
      >
        <div className="flex flex-col items-start">
          <span className="text-xs text-[var(--muted)]">Filter Sections</span>
          <span className="text-sm font-medium">
            Showing {visibleCount} of {totalCount} sections
          </span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-[var(--border)] z-50"
          >
            <div className="p-3">
              {sections.map((section) => {
                const isVisible = visibleSections.includes(section.id);
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      onToggle(section.id, !isVisible);
                      setIsExpanded(false);
                    }}
                    className="w-full flex items-center justify-between py-3 px-2 border-b border-[var(--border)] last:border-0"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-[var(--black)]">{section.title}</span>
                      <span className="text-xs text-[var(--muted)]">{section.type}</span>
                    </div>
                    {isVisible && (
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectionControls;