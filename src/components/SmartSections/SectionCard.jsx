// components/SmartSections/SectionCard.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MediaCarousel from "./MediaCarousel";
import CountdownTimer from "./CountdownTimer";

const SectionCard = ({ section, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);

  const {
    id,
    title,
    description,
    type = "default",
    cta,
    media,
    stats,
    badges = [],
    expiryDate,
    collapsible = false,
    expandable = false,
    accentColor = "var(--accent)",
    backgroundColor = "var(--white)",
    priority = "medium"
  } = section;

  // Check if section is expired
  const isExpired = expiryDate && new Date(expiryDate) < new Date();

  // Auto-hide expired sections
  if (isExpired) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "notification":
        return "border-l-4 border-l-[var(--accent)]";
      case "hiring":
        return "bg-gradient-to-br from-[var(--white)] to-[var(--accent)]/5";
      case "promotion":
        return "border-2 border-[var(--accent)]/20";
      case "dashboard":
        return "shadow-lg";
      default:
        return "";
    }
  };

  const renderMedia = () => {
    if (!media) return null;

    const { type: mediaType, images, videoUrl, autoplay = false, interval = 3000 } = media;

    if (mediaType === "carousel" && images && images.length > 0) {
      return (
        <MediaCarousel
          images={images}
          autoplay={autoplay}
          interval={interval}
          isHovered={isHovered}
        />
      );
    }

    if (mediaType === "image" && images && images[0]) {
      return (
        <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl">
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={true}
          />
        </div>
      );
    }

    if (mediaType === "video" && videoUrl) {
      return (
        <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl">
          <video
            src={videoUrl}
            autoPlay={autoplay}
            loop
            muted
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return null;
  };

  const renderStats = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--border)]">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">{value}</p>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider">{key}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderBadges = () => {
    if (badges.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {badges.map((badge, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs rounded-full bg-[var(--accent)]/10 text-[var(--accent)]"
          >
            {badge}
          </span>
        ))}
      </div>
    );
  };

  const handleCTAClick = (e) => {
    e.stopPropagation();
    if (cta?.onClick) {
      cta.onClick();
    } else if (cta?.link && typeof window !== "undefined") {
      window.location.href = cta.link;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-[var(--white)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full ${getTypeStyles()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick && onClick(section)}
      style={{
        backgroundColor: backgroundColor,
        borderColor: `${accentColor}20`
      }}
    >
      {/* Media Section - Fixed height */}
      <div className="flex-shrink-0">
        {renderMedia()}
      </div>

      {/* Content Section - Grows to fill available space */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1">
          {renderBadges()}

          {/* Title */}
          <h3 className="text-xl lg:text-2xl font-semibold text-[var(--black)] mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description - Fixed height with overflow handling */}
          <div className="min-h-[4rem]">
            <p className={`text-[var(--muted)] text-sm leading-relaxed ${
              expandable && !expanded ? "line-clamp-3" : ""
            }`}>
              {description}
            </p>

            {/* Expand/Collapse Button */}
            {expandable && description && description.length > 150 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="text-xs text-[var(--accent)] mt-2 hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Stats Section */}
          {renderStats()}

          {/* Countdown Timer */}
          {expiryDate && (
            <div className="mt-4">
              <CountdownTimer targetDate={expiryDate} accentColor={accentColor} />
            </div>
          )}
        </div>

        {/* CTA Button - Always at bottom */}
        {cta && (
          <div className="mt-5 pt-2">
            <button
              onClick={handleCTAClick}
              className="w-full px-5 py-2.5 bg-[var(--black)] text-white rounded-xl text-sm font-medium hover:bg-[var(--accent)] transition-all duration-300"
            >
              {cta.text || "Learn More"}
            </button>
          </div>
        )}

        {/* Collapsible Toggle Indicator */}
        {collapsible && (
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle collapse logic in parent
              }}
              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
            >
              <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SectionCard;