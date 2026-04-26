"use client";

import { useState } from "react";

export default function Hero({
  imageUrl,
  title,
  subtitle,
}) {
  const [position, setPosition] = useState(50);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setPosition(x);
  };

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setPosition(50);
      }}
    >
      {/* Mobile */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />

      {/* Desktop Base Image (Grayscale) */}
      <img
        src={imageUrl}
        alt={title}
        className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale"
      />

      {/* Desktop Color Reveal with Spotlight */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: isHovering ? "brightness(1.05) contrast(1.02) saturate(1.1)" : "none",
          maskImage: `linear-gradient(
            90deg,
            transparent 0%,
            transparent ${isHovering ? Math.max(position - 45, 0) : 0}%,
            black ${isHovering ? position : 0}%,
            transparent ${isHovering ? Math.min(position + 45, 100) : 0}%,
            transparent 100%
          )`,
          WebkitMaskImage: `linear-gradient(
            90deg,
            transparent 0%,
            transparent ${isHovering ? Math.max(position - 45, 0) : 0}%,
            black ${isHovering ? position : 0}%,
            transparent ${isHovering ? Math.min(position + 45, 100) : 0}%,
            transparent 100%
          )`,
          transition: "all 0.08s linear",
        }}
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-20 text-white max-w-5xl">
        <p
          className="uppercase tracking-[0.25em] mb-4"
          style={{
            color: "var(--accent)",
            fontSize: "18px",
            textShadow: "0 2px 6px rgba(0,0,0,0.6)",
            padding: "4px 10px",
            borderRadius: "6px",
          }}
        >
          Tatvam Collective
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
          {title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}