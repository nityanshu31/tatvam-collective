// components/SmartSections.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionCard from "./SmartSections/SectionCard";
import SectionControls from "./SmartSections/SectionControls";

const SmartSections = ({ 
  sections = [], 
  allowUserToggle = true,
  defaultVisibleSections = "all", // "all" or array of IDs
  layoutType = "auto", // "auto", "equal", "priority"
  className = "",
  onSectionVisibilityChange = null,
  onSectionClick = null
}) => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize visible sections
  useEffect(() => {
    if (!isInitialized && sections.length > 0) {
      let initialVisible;
      if (defaultVisibleSections === "all") {
        initialVisible = sections.map(s => s.id);
      } else if (Array.isArray(defaultVisibleSections)) {
        initialVisible = defaultVisibleSections;
      } else {
        initialVisible = sections.filter(s => s.defaultVisible !== false).map(s => s.id);
      }
      setVisibleSections(initialVisible);
      setIsInitialized(true);
    }
  }, [sections, defaultVisibleSections, isInitialized]);

  // Get visible section objects
  const visibleSectionObjects = useMemo(() => {
    return sections.filter(section => visibleSections.includes(section.id));
  }, [sections, visibleSections]);

  // Calculate column class based on visible sections count
  const getColumnClass = () => {
    const count = visibleSectionObjects.length;
    if (count === 1) return "grid-cols-1 max-w-4xl mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count >= 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1";
  };

  // Get priority-based width class (for non-equal widths)
  const getWidthClass = (section, totalCount) => {
    if (layoutType !== "priority") return "col-span-1";
    
    const priority = section.priority || "medium";
    if (totalCount === 2) {
      return priority === "high" ? "md:col-span-1 lg:col-span-2" : "md:col-span-1";
    }
    if (totalCount === 3) {
      if (priority === "high") return "lg:col-span-2";
      if (priority === "low") return "lg:col-span-1";
      return "lg:col-span-1";
    }
    return "col-span-1";
  };

  const handleToggleSection = (sectionId, isVisible) => {
    if (!allowUserToggle) return;
    
    const newVisibleSections = isVisible
      ? [...visibleSections, sectionId]
      : visibleSections.filter(id => id !== sectionId);
    
    setVisibleSections(newVisibleSections);
    
    if (onSectionVisibilityChange) {
      onSectionVisibilityChange(newVisibleSections);
    }
  };

  if (sections.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <p className="text-[var(--muted)]">No sections available</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Controls - Allow users to toggle sections */}
      {allowUserToggle && sections.length > 1 && (
        <SectionControls
          sections={sections}
          visibleSections={visibleSections}
          onToggle={handleToggleSection}
        />
      )}

      {/* Sections Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={visibleSections.join(",")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`grid ${getColumnClass()} gap-6 lg:gap-8`}
        >
          {visibleSectionObjects.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={getWidthClass(section, visibleSectionObjects.length)}
            >
              <SectionCard
                section={section}
                onClick={() => onSectionClick && onSectionClick(section)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty state when all sections hidden */}
      {visibleSectionObjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-[var(--muted)]">All sections are hidden. Toggle above to show content.</p>
        </motion.div>
      )}
    </div>
  );
};

export default SmartSections;