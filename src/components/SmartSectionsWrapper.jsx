// components/SmartSectionsWrapper.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import SmartSections from "@/components/SmartSections";

export default function SmartSectionsWrapper() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("/api/sections");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        setSections(data.sections || []);
      } else {
        throw new Error(data.error || "Failed to fetch sections");
      }
      
    } catch (err) {
      console.error("Error fetching sections:", err);
      setError(err.message);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleSectionClick = (section) => {
    if (section.cta?.link) {
      if (section.cta.openInNewTab) {
        window.open(section.cta.link, "_blank");
      } else {
        window.location.href = section.cta.link;
      }
    }
  };

  const handleVisibilityChange = (visibleSections) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredSections", JSON.stringify(visibleSections));
    }
  };

  // Check if there are any visible sections
  const hasVisibleSections = sections.some(section => section.defaultVisible === true && section.isActive === true);

  // Don't render anything while loading if there are no sections yet
  if (loading) {
    // Optional: You can return null here if you don't want a loading state
    // return null;
    
    // Or keep the loading skeleton
    return (
      <div className="bg-[var(--white)]">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1800px] mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--charcoal)]">
                Highlights and updates
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Don't show error on homepage, just return null
    console.error("Sections error:", error);
    return null;
  }

  // If no visible sections, render nothing
  if (!hasVisibleSections || sections.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--white)]">
      <div className="w-full px-2 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--charcoal)]">
              Highlights and updates
            </h2>
          </div>
          
          <SmartSections
            sections={sections}
            allowUserToggle={true}
            defaultVisibleSections="all"
            layoutType="auto"
            onSectionVisibilityChange={handleVisibilityChange}
            onSectionClick={handleSectionClick}
          />
        </div>
      </div>
    </div>
  );
}