// components/SmartSections.jsx - Using CSS Grid with fraction units
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

  const visibleOnlySections = useMemo(() => {
    return sections.filter(section => section.defaultVisible === true && section.isActive === true);
  }, [sections]);

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

  const visibleSectionObjects = useMemo(() => {
    return visibleOnlySections.filter(section => visibleSections.includes(section.id));
  }, [visibleOnlySections, visibleSections]);

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

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("SmartSections - Visible sections:", visibleSectionObjects.length);
    }
  }, [visibleSectionObjects.length]);

  if (sections.length === 0 || visibleOnlySections.length === 0 || visibleSectionObjects.length === 0) {
    return null;
  }

  const cardCount = visibleSectionObjects.length;
  
  // Generate inline grid style for true width expansion
  const gridStyle = {
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: cardCount === 1 
      ? '1fr' 
      : cardCount === 2 
        ? 'repeat(2, 1fr)' 
        : 'repeat(3, 1fr)',
    maxWidth: cardCount === 1 ? '800px' : '100%',
    margin: cardCount === 1 ? '0 auto' : '0',
  };

  // Responsive grid for mobile
  const responsiveGridStyle = {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: '1fr',
    '@media (min-width: 768px)': {
      gap: '2rem',
      gridTemplateColumns: cardCount === 1 
        ? '1fr' 
        : cardCount === 2 
          ? 'repeat(2, 1fr)' 
          : 'repeat(3, 1fr)',
      maxWidth: cardCount === 1 ? '800px' : '100%',
      margin: cardCount === 1 ? '0 auto' : '0',
    }
  };

  // Just replace the return statement with this:
return (
  <div className={`w-full ${className}`}>
    {allowUserToggle && visibleOnlySections.length > 1 && (
      <SectionControls
        sections={visibleOnlySections}
        visibleSections={visibleSections}
        onToggle={handleToggleSection}
      />
    )}

    <AnimatePresence mode="wait">
      <motion.div
        key={visibleSections.join(",")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className={`
          grid gap-6 lg:gap-8
          ${visibleSectionObjects.length === 1 
            ? 'grid-cols-1 max-w-3xl mx-auto' 
            : visibleSectionObjects.length === 2 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }
        `}>
          {visibleSectionObjects.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="h-full"
            >
              <SectionCard
                section={section}
                onClick={() => onSectionClick && onSectionClick(section)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
);
};

export default SmartSections;