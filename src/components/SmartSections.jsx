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
  const [selectedType, setSelectedType] = useState("All");

  const visibleOnlySections = useMemo(() => {
    return sections.filter(section => section.defaultVisible === true && section.isActive === true);
  }, [sections]);

  const uniqueTypes = useMemo(() => {
    const types = visibleOnlySections.map(s => s.type).filter(Boolean);
    return ["All", ...Array.from(new Set(types))];
  }, [visibleOnlySections]);

  const visibleSectionObjects = useMemo(() => {
    if (selectedType === "All") {
      return visibleOnlySections;
    }
    return visibleOnlySections.filter(section => section.type === selectedType);
  }, [visibleOnlySections, selectedType]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("SmartSections - Visible sections:", visibleSectionObjects.length);
    }
  }, [visibleSectionObjects.length]);

  if (sections.length === 0 || visibleOnlySections.length === 0) {
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

return (
  <div className={`w-full ${className}`}>
    {allowUserToggle && uniqueTypes.length > 2 && (
      <SectionControls
        types={uniqueTypes}
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />
    )}

    {visibleSectionObjects.length === 0 ? (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 text-gray-400 font-light border border-dashed border-gray-200 rounded-2xl"
      >
        <p className="text-lg">No sections selected</p>
        <p className="text-sm mt-1">Please select one or more categories above to display sections.</p>
      </motion.div>
    ) : (
      <AnimatePresence mode="wait">
      <motion.div
        key={selectedType}
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
    )}
  </div>
);
};

export default SmartSections;