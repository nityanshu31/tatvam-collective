// components/SmartSections.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionCard from "./SmartSections/SectionCard";
import SectionControls from "./SmartSections/SectionControls";

const SmartSections = ({ 
  sections = [], 
  allowUserToggle = true,
  defaultVisibleSections = "all",
  layoutType = "auto",
  className = "",
  onSectionVisibilityChange = null,
  onSectionClick = null
}) => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Filter sections that are marked as visible (defaultVisible === true) and active
  const visibleOnlySections = useMemo(() => {
    // Only show sections where defaultVisible is true and isActive is true
    return sections.filter(section => section.defaultVisible === true && section.isActive === true);
  }, [sections]);

  // Initialize visible sections (only from visibleOnlySections)
  useEffect(() => {
    if (!isInitialized && visibleOnlySections.length > 0) {
      let initialVisible;
      if (defaultVisibleSections === "all") {
        initialVisible = visibleOnlySections.map(s => s.id);
      } else if (Array.isArray(defaultVisibleSections)) {
        initialVisible = defaultVisibleSections;
      } else {
        initialVisible = visibleOnlySections.filter(s => s.defaultVisible !== false).map(s => s.id);
      }
      setVisibleSections(initialVisible);
      setIsInitialized(true);
    }
  }, [visibleOnlySections, defaultVisibleSections, isInitialized]);

  // Get visible section objects (only from visibleOnlySections)
  const visibleSectionObjects = useMemo(() => {
    return visibleOnlySections.filter(section => visibleSections.includes(section.id));
  }, [visibleOnlySections, visibleSections]);

  const getColumnClass = () => {
    const count = visibleSectionObjects.length;
    if (count === 1) return "grid-cols-1  mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count >= 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1";
  };

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

  // Debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("SmartSections - Total sections from API:", sections.length);
      console.log("SmartSections - Visible only sections:", visibleOnlySections.length);
      console.log("SmartSections - Sections with defaultVisible false:", sections.filter(s => s.defaultVisible === false).length);
      console.log("SmartSections - Visible section objects:", visibleSectionObjects.length);
    }
  }, [sections, visibleOnlySections, visibleSectionObjects]);

  // RETURN NULL IF NO SECTIONS OR NO VISIBLE SECTIONS
  // This ensures nothing is rendered on the homepage
  if (sections.length === 0 || visibleOnlySections.length === 0 || visibleSectionObjects.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Controls - Allow users to toggle sections */}
      {allowUserToggle && visibleOnlySections.length > 1 && (
        <SectionControls
          sections={visibleOnlySections}
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
          className={`grid ${getColumnClass()} gap-6 lg:gap-8 auto-rows-fr`}
        >
          {visibleSectionObjects.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`${getWidthClass(section, visibleSectionObjects.length)} h-full`}
            >
              <SectionCard
                section={section}
                onClick={() => onSectionClick && onSectionClick(section)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SmartSections;