// components/SmartSections/SectionControls.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SectionControls = ({ types, selectedType, onSelectType }) => {
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

  const totalCount = types.length;

  // Desktop: Show all toggles horizontally
  if (!isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pb-4 border-b border-[var(--border)]"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-[var(--black)]">Filter by Category:</span>
          {types.map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => onSelectType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-[var(--black)] text-white shadow-sm scale-102"
                    : "bg-gray-100 text-[var(--muted)] hover:bg-gray-250"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Mobile: Dropdown menu
  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 bg-[var(--black)] text-white rounded-xl shadow-md"
      >
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-400">Filter Category</span>
          <span className="text-sm font-medium">
            Category: {selectedType}
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
            className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[var(--border)] z-50 overflow-hidden"
          >
            <div className="py-1">
              {types.map((type) => {
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      onSelectType(type);
                      setIsExpanded(false);
                    }}
                    className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left"
                  >
                    <span className={`text-sm font-medium ${isSelected ? "text-[var(--accent)]" : "text-[var(--black)]"}`}>
                      {type}
                    </span>
                    {isSelected && (
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