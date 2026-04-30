// components/SmartSectionsWrapper.jsx
"use client";

import SmartSections from "@/components/SmartSections";
import { mockSections } from "@/data/smartSectionsData";

export default function SmartSectionsWrapper() {
  const handleSectionClick = (section) => {
    console.log("Section clicked:", section);
    // Add your analytics or navigation logic here
    if (section.cta?.link) {
      // For internal navigation
      // router.push(section.cta.link);
      // Or for external links
      // window.location.href = section.cta.link;
    }
  };

  const handleVisibilityChange = (visibleSections) => {
    console.log("Visible sections changed:", visibleSections);
    // Save user preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredSections", JSON.stringify(visibleSections));
    }
  };

  return (
    <div className="bg-[var(--white)]">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1800px] mx-auto">
          <SmartSections
            sections={mockSections}
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